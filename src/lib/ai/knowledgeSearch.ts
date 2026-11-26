import { faqData } from '../../data/faq';
import { contacts } from '../../data/contacts';
import { timelineData } from '../../data/schedule';
import { announcements } from '../../data/announcements';
import { infoData } from '../../data/info';
import { extractFaculty, type Intent } from './intentDetector';

export interface KnowledgeChunk {
  source: string;
  content: string;
  score: number;
  /** Teks jawaban siap tampil (tanpa awalan "Q:/A:"). */
  answer?: string;
}

export interface SearchResult {
  chunks: KnowledgeChunk[];
  hasLocalAnswer: boolean;
  localAnswer?: string;
}

/** Skor minimum agar potongan pengetahuan dianggap relevan (dipakai juga sebagai ambang jawaban lokal). */
export const MIN_RELEVANT_SCORE = 3;

const STOP_WORDS = new Set([
  'kamu', 'aku', 'saya', 'gue', 'gw', 'dia', 'mereka', 'kami', 'kita', 'kak', 'kakak', 'min', 'mimin',
  'yang', 'di', 'ke', 'dari', 'dan', 'atau', 'untuk', 'buat', 'dengan', 'ini', 'itu', 'adalah',
  'apakah', 'siapa', 'apa', 'aja', 'saja', 'ada', 'boleh', 'bisa', 'gimana', 'bagaimana', 'berapa',
  'dong', 'ya', 'ga', 'nih', 'sih', 'deh', 'kah', 'mau', 'harus', 'pas', 'saat', 'kalau', 'kalo', 'jika',
  'tentang', 'soal', 'tanya', 'mohon', 'tolong', 'info', 'peserta', 'unesa', 'garda', '2026', 'tiap',
  'setiap', 'yg', 'sama', 'juga', 'udah', 'sudah', 'belum', 'nya', 'lagi', 'mana',
]);

// Perluasan kata bahasa mahasiswa → istilah di data (training data tanpa fine-tuning).
const SYNONYMS: Record<string, string[]> = {
  cowok: ['putra'], cowo: ['putra'], laki: ['putra'], pria: ['putra'],
  cewek: ['putri'], cewe: ['putri'], perempuan: ['putri'], wanita: ['putri'],
  hp: ['handphone'], ponsel: ['handphone'], gadget: ['handphone'],
  motor: ['kendaraan'], mobil: ['kendaraan'],
  telat: ['terlambat'],
  absen: ['presensi'], absensi: ['presensi'],
  izin: ['perizinan'],
  keluar: ['meninggalkan'],
  makan: ['makanan'],
  bawa: ['dibawa', 'membawa'],
  baju: ['kemeja', 'dresscode'], pakaian: ['dresscode'], outfit: ['dresscode'],
  jam: ['pukul'],
  dimana: ['lokasi'], tempat: ['lokasi'],
  pembukaan: ['opening'],
  plagiasi: ['plagiarisme'], plagiat: ['plagiarisme'],
  essay: ['esai'],
  kumpul: ['pengumpulan'], dikumpul: ['pengumpulan'], ngumpulin: ['pengumpulan'], submit: ['pengumpulan'],
  daring: ['online'], luring: ['offline'],
  jilbab: ['hijab'], kerudung: ['hijab'],
  persen: ['%'],
};

// Kata kunci tambahan per FAQ (id di faq.ts): variasi pertanyaan nyata yang tidak ada di teks FAQ.
const FAQ_KEYWORDS: Record<string, string> = {
  '1': 'apa itu garda pkkmb pengertian',
  '2': 'rangkaian kegiatan tahapan acara',
  '3': 'pelaksanaan hari d-day',
  '4': 'wajib ikut minimal kehadiran persen presensi',
  '5': 'jam datang tepat waktu paling lambat',
  '6': 'telat terlambat presensi',
  '7': 'keluar izin pulang',
  '8': 'motor mobil parkir',
  '9': 'hp ponsel',
  '10': 'makan minum',
  '11': 'bawa perlengkapan',
  '12': 'larangan',
  '17': 'warna scarf fakultas',
  '18': 'tema esai topik judul',
  '19': 'panjang esai jumlah kata',
  '21': 'deadline esai batas',
  '22': 'isi pdf esai berkas',
  '31': 'bahasa isyarat',
  '33': 'kendala bantuan masalah',
  '34': 'sosmed upload posting konten',
  '35': 'sanksi melanggar hukuman',
};

// Kategori dokumen (dicocokkan ke judul + kata kunci) untuk menaikkan skor sesuai intent.
const CATEGORY: Partial<Record<Intent, RegExp>> = {
  PRESENSI: /presensi|kehadiran|terlambat|datang/,
  DRESSCODE: /dresscode|scarf/,
  PENUGASAN: /tugas|esai|resume|plagiarisme|penugasan/,
  PERIZINAN: /izin|perizinan|meninggalkan/,
  SCHEDULE: /jadwal|kapan pkkmb|online|blended/,
  TODAY: /jadwal|kapan pkkmb|online|blended/,
  ANNOUNCEMENT: /pengumuman/,
};
const CATEGORY_BOOST = 1.5;

function stem(word: string): string {
  return word.length > 5 && word.endsWith('nya') ? word.slice(0, -3) : word;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/%/g, ' % ')
    .split(/[^a-z0-9%]+/)
    .map(stem)
    .filter((w) => (w.length > 1 || w === '%') && !STOP_WORDS.has(w));
}

const SYNONYM_WEIGHT = 0.8;

/** Tiap kata query menjadi satu grup [kata, ...sinonim]; satu grup dihitung sekali (tanpa double count). */
function expand(tokens: string[]): string[][] {
  return [...new Set(tokens)].map((t) => [t, ...(SYNONYMS[t] ?? [])]);
}

// "bawa" cocok dengan "membawa"/"dibawa", "makanan" dengan "makan".
function wordMatches(q: string, d: string): boolean {
  if (q === d) return true;
  if (q.length < 4 || d.length < 4) return false;
  return d.endsWith(q) || d.startsWith(q) || q.startsWith(d);
}

interface Doc {
  source: string;
  title: string[];
  body: string[];
  titleText: string;
  content: string;
  answer: string;
}

function makeDoc(source: string, title: string, body: string, content: string, answer: string): Doc {
  return { source, title: tokenize(title), body: tokenize(body), titleText: title.toLowerCase(), content, answer };
}

function formatEvent(e: typeof timelineData[number]): string {
  const d = e.details;
  return [
    `**${e.title}** (${e.date})`,
    ...(d?.activities ?? []).map((a) => `• ${a}`),
    d?.location && `📍 Lokasi: ${d.location}`,
    d?.dresscode && `👔 Dresscode: ${d.dresscode}`,
    d?.notes && `📝 ${d.notes}`,
  ].filter(Boolean).join('\n');
}

const TIMELINE_SUMMARY = `Rangkaian PKKMB Garda UNESA 2026 📅\n\n${timelineData
  .map((e) => `• **${e.title}**: ${e.date}`)
  .join('\n')}\n\nLihat detail lengkapnya di [halaman Jadwal](/jadwal).`;

function linkList(item: typeof infoData[number]): string {
  return item.subItems.map((s) => (s.link ? `• [${s.label}](${s.link})` : `• ${s.label}`)).join('\n');
}

const DOCS: Doc[] = [
  ...faqData.map((f) =>
    makeDoc('FAQ', `${f.question} ${FAQ_KEYWORDS[f.id] ?? ''}`, f.answer, `Q: ${f.question}\nA: ${f.answer}`, f.answer)
  ),
  ...timelineData.map((e) => {
    const text = formatEvent(e);
    return makeDoc('JADWAL', `jadwal ${e.title} ${e.date} ${(e.details?.activities ?? []).join(' ')}`,
      `${e.details?.location ?? ''} ${e.details?.dresscode ?? ''} ${e.details?.notes ?? ''}`, text, text);
  }),
  makeDoc('JADWAL', 'jadwal rangkaian kegiatan timeline tanggal kapan pkkmb garda', timelineData.map((e) => e.date).join(' '),
    TIMELINE_SUMMARY, TIMELINE_SUMMARY),
  ...announcements.filter((a) => a.isActive).map((a) => {
    const text = `📢 **${a.title}** (${a.date})\n${a.content}`;
    return makeDoc('PENGUMUMAN', `pengumuman ${a.title}`, a.content, `[${a.date}] ${a.title}:\n${a.content}`, text);
  }),
  ...infoData.map((item) => {
    const text = `**${item.title}**: ${item.desc}.\n\n${linkList(item)}`;
    return makeDoc('INFO', `${item.title} link form ${item.desc}`, item.subItems.map((s) => s.label).join(' '), text, text);
  }),
];

const IDF = (() => {
  const df = new Map<string, number>();
  for (const doc of DOCS) for (const w of new Set([...doc.title, ...doc.body])) df.set(w, (df.get(w) ?? 0) + 1);
  return (w: string) => Math.log(1 + DOCS.length / (df.get(w) ?? DOCS.length));
})();

function scoreWord(doc: Doc, q: string): number {
  const inTitle = doc.title.find((d) => wordMatches(q, d));
  if (inTitle) return IDF(inTitle) * 3;
  const inBody = doc.body.find((d) => wordMatches(q, d));
  return inBody ? IDF(inBody) : 0;
}

function scoreDoc(doc: Doc, queryGroups: string[][], phrase: string, intent: Intent): number {
  let score = 0;
  for (const [word, ...synonyms] of queryGroups) {
    score += Math.max(scoreWord(doc, word), ...synonyms.map((s) => scoreWord(doc, s) * SYNONYM_WEIGHT));
  }
  // Bonus: whole query phrase appears in the title ("apa itu garda")
  if (phrase.split(' ').length >= 2 && doc.titleText.includes(phrase)) score += 5;
  const category = CATEGORY[intent];
  if (score > 0 && category?.test(doc.titleText)) score *= CATEGORY_BOOST;
  return score;
}

function searchDocs(query: string, intent: Intent, limit: number): KnowledgeChunk[] {
  const groups = expand(tokenize(query));
  const phrase = query.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, ' ').trim();
  return DOCS
    .map((doc) => ({ doc, score: scoreDoc(doc, groups, phrase, intent) }))
    .filter((r) => r.score >= MIN_RELEVANT_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ doc, score }) => ({ source: doc.source, content: doc.content, answer: doc.answer, score: Math.round(score * 10) / 10 }));
}

// Contact Search
function contactChunk(contact: typeof contacts[number]): KnowledgeChunk {
  return {
    source: 'CONTACT',
    content: `Kontak Person ${contact.faculty}:\n- ${contact.cp1.name} (${contact.cp1.phone})\n- ${contact.cp2.name} (${contact.cp2.phone})`,
    score: 10,
  };
}

function searchContacts(query: string, faculty?: string): KnowledgeChunk[] {
  const wanted = (faculty ?? extractFaculty(query))?.toUpperCase();
  const contact = wanted ? contacts.find((c) => c.faculty.toUpperCase() === wanted) : undefined;
  return contact ? [contactChunk(contact)] : [];
}

// Main Search
export function searchKnowledge(query: string, intent: Intent, faculty?: string): SearchResult {
  if (intent === 'CONTACT') {
    const chunks = searchContacts(query, faculty);
    if (chunks.length > 0) {
      return { chunks, hasLocalAnswer: true, localAnswer: formatContact(chunks, faculty) };
    }
    return { chunks, hasLocalAnswer: false };
  }

  let chunks = searchDocs(query, intent, 4);
  // "ada info terbaru?" tidak menyebut topik → tampilkan semua pengumuman aktif
  if (intent === 'ANNOUNCEMENT' && chunks.length === 0) {
    const anns = DOCS.filter((d) => d.source === 'PENGUMUMAN');
    if (anns.length > 0) {
      chunks = [{
        source: 'PENGUMUMAN',
        content: anns.map((d) => d.content).join('\n\n'),
        answer: anns.map((d) => d.answer).join('\n\n'),
        score: MIN_RELEVANT_SCORE,
      }];
    }
  }
  return { chunks, hasLocalAnswer: intent !== 'GENERAL' && chunks.length > 0 };
}

function formatContact(chunks: KnowledgeChunk[], faculty?: string): string {
  const prefix = faculty
    ? `Berikut Kontak Person untuk Fakultas ${faculty} 📱\n\n`
    : `Berikut Kontak Person yang tersedia 📱\n\n`;
  return `${prefix}${chunks[0].content}`;
}

export function buildContext(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) return 'Tidak ada konteks tersedia.';
  return chunks
    .map((c) => `[${c.source}]\n${c.content}`)
    .join('\n\n---\n\n');
}
