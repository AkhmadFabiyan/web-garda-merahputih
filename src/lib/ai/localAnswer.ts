// Jawaban lokal Gara: semua yang bisa dijawab tanpa memanggil AI.
// Dipakai oleh /api/garda dan oleh scripts/garda-eval.mjs.
import { detectIntent, type DetectedIntent, type ConversationTurn } from './intentDetector';
import { searchKnowledge, type KnowledgeChunk } from './knowledgeSearch';
import { getTodayInfo } from './todayEngine';
import { filterOutput } from './outputFilter';
import { preprocessInput } from './preprocess';
import { SECURITY_RESPONSE, OFF_TOPIC_RESPONSE } from './security';
import { contacts } from '../../data/contacts';
import { findLinkByKeyword } from '../../data/linkRegistry';

export interface GardaResponse {
  answer: string;
  intent: string;
  usedGemini: boolean;
  contacts?: Array<{ name: string; phone: string }>;
  suggestions?: string[];
}

export type LocalResult =
  | { kind: 'answer'; response: GardaResponse }
  | {
      kind: 'needs_ai';
      message: string;
      detected: DetectedIntent;
      faculty?: string;
      chunks: KnowledgeChunk[];
      creative: boolean;
    };

// Small Talk Responses
// Rotated to avoid monotony
const GREET_REPLIES = [
  'Halo! Ada yang bisa Gara bantu seputar PKKMB Garda UNESA 2026?',
  'Hai! Tanya aja soal jadwal, presensi, tugas, atau kontak panitia — Gara siap bantu!',
  'Hey! Ada info apa yang kamu butuhkan hari ini?',
];
const THANKS_REPLIES = [
  'Sama-sama! Ada lagi yang mau ditanyain?',
  'No problem! Kalau ada pertanyaan lain, tanya aja ya.',
  'Siap! Jangan sungkan kalau butuh info lainnya.',
];
const CONFIRM_REPLIES = [
  'Siap! Kalau ada yang mau ditanyain lagi, langsung tanya aja.',
  'Oke noted! Ada lagi yang bisa Gara bantu?',
  'Sip! Semangat ya untuk PKKMBnya 🎓',
];
const GREET_PATTERNS = /^(halo|hai|hi|hello|hey|p+|hei|selamat\s+(pagi|siang|sore|malam)|gara!?)\b/i;
const THANKS_PATTERNS = /^(makasih|terima\s*kasih|thanks?|thx|tks|mksh)\b/i;
const IDENTITY_PATTERNS = /^(kamu\s+siapa|siapa\s+kamu|nama\s+kamu|kamu\s+ai|siapa\s+namamu)/i;

let smallTalkIndex = 0;
function pickRotating(arr: string[]): string {
  return arr[smallTalkIndex++ % arr.length];
}

// Creative Request Detection
const CREATIVE_PATTERNS = [
  /pantun/i, /puisi/i, /tebak.?tebakan/i, /jokes?/i,
  /\blucu\b/i, /humor/i, /bercanda/i, /candaan/i,
  /buat.*cerita/i, /sajak/i, /syair/i,
];

function isCreativeRequest(msg: string): boolean {
  return CREATIVE_PATTERNS.some((p) => p.test(msg));
}

// Follow-up Suggestions — hanya pertanyaan yang bisa dijawab dari data lokal (ikut dicek di scripts/garda-eval.mjs)
export const SUGGESTIONS_BY_INTENT: Record<string, string[]> = {
  SCHEDULE:     ['Apa dresscode Opening Ceremony?', 'Siapa CP untuk fakultasku?', 'Jadwal hari ini?'],
  PRESENSI:     ['Di mana link presensi?', 'Berapa minimal kehadiran?', 'Gimana kalau telat?'],
  PENUGASAN:    ['Kapan deadline esai?', 'Di mana link pengumpulan tugas?', 'Berapa batas plagiarisme tugas?'],
  DRESSCODE:    ['Apa saja barang yang perlu dibawa?', 'Apakah warna scarf tiap fakultas beda?', 'Jadwal kegiatan besok?'],

  ANNOUNCEMENT: ['Jadwal PKKMB kapan?', 'Siapa CP fakultasku?', 'Apa tugas Pra-PKKMB?'],
  FAQ:          ['Apa saja barang yang perlu dibawa?', 'Siapa CP untuk fakultasku?', 'Jadwal Pra-PKKMB kapan?'],
  PERIZINAN:    ['Di mana form perizinan?', 'Bolehkah meninggalkan lokasi kegiatan?', 'Gimana kalau telat?'],
  CONTACT:      ['Jadwal hari ini?', 'Apa tugas Pra-PKKMB?', 'Apa dresscode Opening Ceremony?'],
};

export function getSuggestions(intent: string, faculty?: string): string[] | undefined {
  const suggs = SUGGESTIONS_BY_INTENT[intent];
  if (!suggs) return undefined;
  if (!faculty) return suggs;
  return suggs.map(s => s.replace('fakultasku', faculty).replace('Fakultasku', faculty));
}

// Helpers
function findContact(faculty?: string) {
  return faculty ? contacts.find((c) => c.faculty.toUpperCase() === faculty.toUpperCase()) : undefined;
}

function contactList(contact: ReturnType<typeof findContact>) {
  return contact
    ? [
        { name: contact.cp1.name, phone: contact.cp1.phone },
        { name: contact.cp2.name, phone: contact.cp2.phone },
      ]
    : undefined;
}

/** Jawaban dari potongan pengetahuan teratas (dipakai saat AI tidak dipakai/gagal). */
export function chunkAnswer(chunks: KnowledgeChunk[], intent: string, faculty?: string): GardaResponse | null {
  if (chunks.length === 0) return null;
  const top = chunks[0];
  return {
    answer: filterOutput(top.answer ?? top.content).filtered,
    intent,
    usedGemini: false,
    suggestions: getSuggestions(intent, faculty),
  };
}

/** Fallback terakhir: arahkan ke CP fakultas. */
export function finalFallback(faculty?: string): GardaResponse {
  const contactData = findContact(faculty);

  const answer = contactData
    ? `Hmm, Gara belum punya info valid soal itu.\n\nCoba hubungi CP Fakultas ${contactData.faculty} ya:\n- ${contactData.cp1.name} (${contactData.cp1.phone})\n- ${contactData.cp2.name} (${contactData.cp2.phone})`
    : faculty
      ? `Hmm, Gara belum punya info valid soal itu untuk Fakultas ${faculty}. Ketik "CP ${faculty}" untuk dapat kontak panitia yang bisa bantu.`
      : `Hmm, Gara belum punya info valid soal itu. Ketik "CP [fakultasmu]" (contoh: "CP FT") untuk dapat kontak panitia yang bisa bantu.`;

  return { answer, intent: 'CONTACT', usedGemini: false, contacts: contactList(contactData) };
}

export function answerLocally(
  rawMessage: string,
  bodyFaculty?: string,
  history: ConversationTurn[] = []
): LocalResult {
  const done = (response: GardaResponse): LocalResult => ({ kind: 'answer', response });

  // Preprocess (normalize typos & abbreviations)
  const message = preprocessInput(rawMessage);

  // Detect intent (with memory from history)
  const detected = detectIntent(message, history);
  const faculty = detected.faculty ?? bodyFaculty;

  if (detected.intent === 'SECURITY_THREAT') {
    return done({ answer: SECURITY_RESPONSE, intent: 'SECURITY_THREAT', usedGemini: false });
  }

  // SMALL TALK — zero Gemini, instant reply
  if (detected.intent === 'SMALL_TALK') {
    let reply: string;
    if (IDENTITY_PATTERNS.test(message)) {
      reply = 'Aku Gara, Asisten Virtual Garda UNESA 2026! Siap bantu kamu seputar info PKKMB 🎓';
    } else if (GREET_PATTERNS.test(message)) {
      reply = pickRotating(GREET_REPLIES);
    } else if (THANKS_PATTERNS.test(message)) {
      reply = pickRotating(THANKS_REPLIES);
    } else {
      reply = pickRotating(CONFIRM_REPLIES);
    }
    return done({ answer: reply, intent: 'SMALL_TALK', usedGemini: false });
  }

  if (detected.intent === 'OFF_TOPIC') {
    return done({ answer: OFF_TOPIC_RESPONSE, intent: 'OFF_TOPIC', usedGemini: false });
  }

  // SMART LINK NAVIGATOR
  const linkMatch = findLinkByKeyword(message);
  if (linkMatch) {
    let answerText = linkMatch.message;
    if (linkMatch.url) answerText += `\n\n[Buka ${linkMatch.name}](${linkMatch.url})`;
    return done({
      answer: answerText,
      intent: detected.intent === 'GENERAL' ? 'FAQ' : detected.intent,
      usedGemini: false,
    });
  }

  if (detected.intent === 'TODAY') {
    return done({ answer: getTodayInfo().message, intent: 'TODAY', usedGemini: false });
  }

  if (detected.intent === 'CONTACT') {
    const searchResult = searchKnowledge(message, 'CONTACT', faculty);
    if (searchResult.hasLocalAnswer && searchResult.localAnswer) {
      return done({
        answer: searchResult.localAnswer,
        intent: 'CONTACT',
        usedGemini: false,
        contacts: contactList(findContact(faculty)),
        suggestions: getSuggestions('CONTACT', faculty),
      });
    }
    return done({
      answer: 'Untuk melihat kontak person, ketik nama fakultasmu (contoh: "CP FT" atau "kontak FEB") 📱',
      intent: 'CONTACT',
      usedGemini: false,
    });
  }

  const searchResult = searchKnowledge(message, detected.intent, faculty);
  const creative = isCreativeRequest(message);
  const needsAI: LocalResult = { kind: 'needs_ai', message, detected, faculty, chunks: searchResult.chunks, creative };

  // Pantun/humor selalu ke AI (tidak ada jawaban lokalnya)
  if (creative) return needsAI;

  // Relevant local answer (chunks are already filtered by MIN_RELEVANT_SCORE), non-GENERAL
  if (searchResult.hasLocalAnswer) {
    return done(chunkAnswer(searchResult.chunks, detected.intent, faculty)!);
  }

  // No relevant context → CP fallback, no AI (AI would only answer "belum ada info")
  if (searchResult.chunks.length === 0) {
    return done(finalFallback(faculty));
  }

  return needsAI;
}
