import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, RATE_LIMIT_RESPONSE } from '../../../lib/ai/rateLimit';
import { sanitizeInput, SECURITY_RESPONSE, OFF_TOPIC_RESPONSE } from '../../../lib/ai/security';
import { detectIntent } from '../../../lib/ai/intentDetector';
import { searchKnowledge, buildContext } from '../../../lib/ai/knowledgeSearch';
import { getTodayInfo } from '../../../lib/ai/todayEngine';
import { buildGeminiPrompt } from '../../../lib/ai/systemPrompt';
import { callGemini, hasGeminiKey, GEMINI_RATE_LIMIT_RESPONSE, ConversationTurn } from '../../../lib/ai/gemini';
import { filterOutput } from '../../../lib/ai/outputFilter';
import { getCachedResponse, setCachedResponse, getCacheKey } from '../../../lib/ai/cache';
import { contacts } from '../../../data/contacts';
import { logQuestion } from '../../../lib/ai/logger';
import { findLinkByKeyword } from '../../../data/linkRegistry';
import { preprocessInput } from '../../../lib/ai/preprocess';

export interface GardaRequest {
  message: string;
  faculty?: string;
  history?: Array<{ role: 'user' | 'model'; text: string }>;
}

export interface GardaResponse {
  answer: string;
  intent: string;
  usedGemini: boolean;
  contacts?: Array<{ name: string; phone: string }>;
  suggestions?: string[];
}


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

// Follow-up Suggestions
const SUGGESTIONS_BY_INTENT: Record<string, string[]> = {
  SCHEDULE:     ['Apa dresscode kegiatan ini?', 'Siapa CP untuk fakultasku?', 'Jadwal hari ini?'],
  PRESENSI:     ['Bagaimana cara mengisi presensi?', 'Kapan batas waktu presensi?', 'Gimana kalau telat presensi?'],
  PENUGASAN:    ['Kapan deadline penugasan?', 'Di mana link pengumpulan tugas?', 'Apa saja syarat penugasan?'],
  DRESSCODE:    ['Apa yang perlu dibawa?', 'Ada sanksi kalau salah dresscode?', 'Jadwal kegiatan besok?'],

  ANNOUNCEMENT: ['Ada pengumuman tentang jadwal?', 'Siapa CP fakultasku?', 'Apa penugasan terbaru?'],
  FAQ:          ['Apa yang perlu dibawa?', 'Siapa CP untuk fakultasku?', 'Jadwal Pra-PKKMB kapan?'],
  PERIZINAN:    ['Bagaimana prosedur izin?', 'Siapa yang menerima form izin?', 'Kapan batas submit izin?'],
  CONTACT:      ['Jadwal hari ini?', 'Apa penugasan terbaru?', 'Dresscode kegiatan ini?'],
};

function getSuggestions(intent: string, faculty?: string): string[] | undefined {
  const suggs = SUGGESTIONS_BY_INTENT[intent];
  if (!suggs) return undefined;
  if (!faculty) return suggs;
  return suggs.map(s => s.replace('fakultasku', faculty).replace('Fakultasku', faculty));
}

// Helpers
function getIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

function extractFaqAnswer(content: string): string {
  const aIdx = content.indexOf('\nA: ');
  if (aIdx !== -1) return content.slice(aIdx + 4).trim();
  return content.trim();
}

const GEMINI_ERROR_RESPONSE = 'Maaf, sistem AI Gara sedang mengalami gangguan jaringan. Coba lagi nanti ya!';

async function callGeminiWithFallback(
  message: string,
  contextChunks: ReturnType<typeof searchKnowledge>['chunks'],
  intent: string,
  mood: string,
  history: ConversationTurn[] = [],
  temperature: number = 0.1,
  creative: boolean = false
): Promise<{ answer: string; usedGemini: boolean }> {
  const context = buildContext(contextChunks);
  const todayData = getTodayInfo();
  const prompt = buildGeminiPrompt(message, context, todayData.message, mood, creative);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const result = await callGemini(prompt, controller.signal, history, temperature);
    clearTimeout(timeout);
    const { filtered } = filterOutput(result.text);
    return { answer: filtered, usedGemini: true };
  } catch (err: unknown) {
    clearTimeout(timeout);
    if (err instanceof Error && err.message === 'RATE_LIMIT_EXCEEDED') {
      return { answer: GEMINI_RATE_LIMIT_RESPONSE, usedGemini: false };
    }
    if (err instanceof Error && err.message === 'CIRCUIT_BREAKER_TRIPPED') {
      return { answer: 'Mohon maaf, sistem AI sedang dalam perlindungan dari kelebihan beban (Circuit Breaker Aktif). Silakan tanya kembali dalam 30 detik ya.', usedGemini: false };
    }
    console.error(`[Gara] AI error (intent=${intent}):`, err);
    return { answer: GEMINI_ERROR_RESPONSE, usedGemini: false };
  }
}

// Main Handler
export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Rate limit
  const ip = getIP(request);
  const rateResult = checkRateLimit(ip);
  if (!rateResult.allowed) {
    return NextResponse.json<GardaResponse>(
      { answer: RATE_LIMIT_RESPONSE, intent: 'RATE_LIMITED', usedGemini: false },
      { status: 429 }
    );
  }

  // 2. Parse body
  let body: GardaRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { answer: 'Permintaan tidak valid.', intent: 'ERROR', usedGemini: false },
      { status: 400 }
    );
  }

  const { message: rawMessage, faculty, history = [] } = body;
  const safeHistory: ConversationTurn[] = history.slice(-6); // 3 pairs max

  const sendResponse = (data: GardaResponse, init?: ResponseInit) => {
    logQuestion(rawMessage, data.intent, data.usedGemini);
    return NextResponse.json(data, init);
  };

  // 3. Security check (on raw message)
  const security = sanitizeInput(rawMessage);
  if (!security.safe) {
    if (security.reason === 'too_long') {
      return sendResponse({
        answer: 'Pertanyaanmu terlalu panjang. Silakan ringkas ya 😊',
        intent: 'INVALID',
        usedGemini: false,
      }, { status: 400 });
    }
    return sendResponse({ answer: SECURITY_RESPONSE, intent: 'SECURITY_THREAT', usedGemini: false });
  }

  // 4. Preprocess (normalize typos & abbreviations)
  const message = preprocessInput(rawMessage);

  // 5. Detect intent (with memory from history)
  const detected = detectIntent(message, safeHistory);

  if (detected.intent === 'SECURITY_THREAT') {
    return sendResponse({ answer: SECURITY_RESPONSE, intent: 'SECURITY_THREAT', usedGemini: false });
  }

  // 6. SMALL TALK — zero Gemini, instant reply
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
    return sendResponse({ answer: reply, intent: 'SMALL_TALK', usedGemini: false });
  }

  // 7. OFF_TOPIC
  if (detected.intent === 'OFF_TOPIC') {
    return sendResponse({ answer: OFF_TOPIC_RESPONSE, intent: 'OFF_TOPIC', usedGemini: false });
  }

  // 8. SMART LINK NAVIGATOR
  const linkMatch = findLinkByKeyword(message);
  if (linkMatch) {
    let answerText = linkMatch.message;
    if (linkMatch.url) answerText += `\n\n[Buka ${linkMatch.name}](${linkMatch.url})`;
    return sendResponse({
      answer: answerText,
      intent: detected.intent === 'GENERAL' ? 'FAQ' : detected.intent,
      usedGemini: false,
    });
  }

  // 9. TODAY — local only
  if (detected.intent === 'TODAY') {
    const todayInfo = getTodayInfo();
    return sendResponse({ answer: todayInfo.message, intent: 'TODAY', usedGemini: false });
  }

  // 10. CONTACT — local only
  if (detected.intent === 'CONTACT') {
    const resolvedFaculty = detected.faculty ?? faculty;
    const searchResult = searchKnowledge(message, 'CONTACT', resolvedFaculty);

    if (searchResult.hasLocalAnswer && searchResult.localAnswer) {
      const contactData = resolvedFaculty
        ? contacts.find((c) => c.faculty.toUpperCase() === resolvedFaculty?.toUpperCase())
        : undefined;

      return sendResponse({
        answer: searchResult.localAnswer,
        intent: 'CONTACT',
        usedGemini: false,
        contacts: contactData ? [
          { name: contactData.cp1.name, phone: contactData.cp1.phone },
          { name: contactData.cp2.name, phone: contactData.cp2.phone },
        ] : undefined,
        suggestions: getSuggestions('CONTACT', resolvedFaculty),
      });
    }

    return sendResponse({
      answer: 'Untuk melihat kontak person, ketik nama fakultasmu (contoh: "CP FT" atau "kontak FEB") 📱',
      intent: 'CONTACT',
      usedGemini: false,
    });
  }

  // Final Fallback helper
  function getFinalFallback(): GardaResponse {
    const resolvedFaculty = detected.faculty ?? faculty;
    const contactData = resolvedFaculty
      ? contacts.find((c) => c.faculty.toUpperCase() === resolvedFaculty?.toUpperCase())
      : undefined;

    const answer = contactData
      ? `Hmm, Gara belum punya info valid soal itu.\n\nCoba hubungi CP Fakultas ${contactData.faculty} ya:\n- ${contactData.cp1.name} (${contactData.cp1.phone})\n- ${contactData.cp2.name} (${contactData.cp2.phone})`
      : resolvedFaculty 
        ? `Hmm, Gara belum punya info valid soal itu untuk Fakultas ${resolvedFaculty}. Ketik "CP ${resolvedFaculty}" untuk dapat kontak panitia yang bisa bantu.`
        : `Hmm, Gara belum punya info valid soal itu. Ketik "CP [fakultasmu]" (contoh: "CP FT") untuk dapat kontak panitia yang bisa bantu.`;

    return {
      answer,
      intent: 'CONTACT',
      usedGemini: false,
      contacts: contactData ? [
        { name: contactData.cp1.name, phone: contactData.cp1.phone },
        { name: contactData.cp2.name, phone: contactData.cp2.phone },
      ] : undefined,
    };
  }

  // 11. Knowledge search
  const searchResult = searchKnowledge(message, detected.intent, detected.faculty ?? faculty);

  // 12. High-confidence local answer (score ≥ 3, non-GENERAL)
  if (
    detected.intent !== 'GENERAL' &&
    searchResult.chunks.length > 0 &&
    searchResult.chunks[0].score >= 3
  ) {
    const top = searchResult.chunks[0];
    const raw = top.content.includes('Q:') ? extractFaqAnswer(top.content) : top.content;
    const { filtered } = filterOutput(raw);
    return sendResponse({
      answer: filtered,
      intent: detected.intent,
      usedGemini: false,
      suggestions: getSuggestions(detected.intent, detected.faculty ?? faculty),
    });
  }

  // 13. GENERAL with no context → fallback, no Gemini
  if (detected.intent === 'GENERAL' && searchResult.chunks.length === 0) {
    return sendResponse(getFinalFallback());
  }

  // 14. CREATIVE request — Gemini, high temp, no cache
  const creative = isCreativeRequest(message);
  if (creative && hasGeminiKey()) {
    const { answer, usedGemini } = await callGeminiWithFallback(
      message, searchResult.chunks, detected.intent,
      detected.mood || 'NEUTRAL', safeHistory, 0.65, true
    );
    if (usedGemini && answer) {
      return sendResponse({ answer, intent: detected.intent, usedGemini: true });
    }
    if (answer === GEMINI_RATE_LIMIT_RESPONSE) {
      return sendResponse({ answer, intent: 'RATE_LIMITED', usedGemini: false });
    }
    if (answer === GEMINI_ERROR_RESPONSE) {
      return sendResponse({ answer, intent: 'ERROR', usedGemini: false });
    }
  }

  // 15. Gemini for non-creative with cache
  if (hasGeminiKey()) {
    const cacheKey = getCacheKey(message, detected.intent, faculty);
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return sendResponse({
        answer: cached,
        intent: detected.intent,
        usedGemini: true,
        suggestions: getSuggestions(detected.intent, detected.faculty ?? faculty),
      });
    }

    const { answer, usedGemini } = await callGeminiWithFallback(
      message, searchResult.chunks, detected.intent,
      detected.mood || 'NEUTRAL', safeHistory, 0.1, false
    );
    if (usedGemini && answer) {
      setCachedResponse(cacheKey, answer);
      return sendResponse({
        answer,
        intent: detected.intent,
        usedGemini: true,
        suggestions: getSuggestions(detected.intent, detected.faculty ?? faculty),
      });
    }
    if (answer === GEMINI_RATE_LIMIT_RESPONSE) {
      return sendResponse({ answer, intent: 'RATE_LIMITED', usedGemini: false });
    }
    if (answer === GEMINI_ERROR_RESPONSE) {
      return sendResponse({ answer, intent: 'ERROR', usedGemini: false });
    }
  }

  // 16. Local fallback (Gemini error/timeout)
  if (searchResult.chunks.length > 0) {
    const top = searchResult.chunks[0];
    const raw = top.content.includes('Q:') ? extractFaqAnswer(top.content) : top.content;
    const { filtered } = filterOutput(raw);
    return sendResponse({
      answer: filtered,
      intent: detected.intent,
      usedGemini: false,
      suggestions: getSuggestions(detected.intent, detected.faculty ?? faculty),
    });
  }

  // 17. Final fallback → CP
  return sendResponse(getFinalFallback());
}
