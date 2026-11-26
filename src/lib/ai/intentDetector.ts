import { contacts } from '../../data/contacts';
import { isBlocked } from './security';

export type Intent =
  | 'SMALL_TALK'
  | 'FAQ'
  | 'CONTACT'
  | 'SCHEDULE'
  | 'TODAY'
  | 'ANNOUNCEMENT'
  | 'DRESSCODE'
  | 'PRESENSI'
  | 'PENUGASAN'
  | 'PERIZINAN'
  | 'GENERAL'
  | 'OFF_TOPIC'
  | 'SECURITY_THREAT';

export interface DetectedIntent {
  intent: Intent;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  faculty?: string;
  mood?: 'CONFUSED' | 'PANIC' | 'LATE' | 'NEUTRAL';
}

export interface ConversationTurn {
  role: 'user' | 'model';
  text: string;
}

// Kode fakultas diambil dari data kontak (ejaan aslinya, mis. "FPsi"), dicocokkan per kata.
const FACULTY_CODES = new Map(contacts.map((c) => [c.faculty.toUpperCase(), c.faculty]));

// Dicocokkan sebagai kata utuh. Alias ambigu ("pendidikan", "bahasa") sengaja tidak dipakai
// karena muncul di pertanyaan lain ("pendidikan berkualitas", "bahasa isyarat").
const FACULTY_ALIASES: Array<[RegExp, string]> = [
  [/\bteknik\b/, 'FT'],
  [/\b(ekonomi|bisnis)\b/, 'FEB'],
  [/\b(bahasa\s+dan\s+seni|sastra|seni)\b/, 'FBS'],
  [/\bilmu\s+pendidikan\b/, 'FIP'],
  [/\b(mipa|matematika|sains)\b/, 'FMIPA'],
  [/\b(ilmu\s+sosial|sosial|politik|fisip)\b/, 'FISIPOL'],
  [/\b(keolahragaan|olahraga|fik)\b/, 'FIKK'],
  [/\bvokasi\b/, 'FV'],
  [/\b(hukum|hkm)\b/, 'FH'],
  [/\b(psikologi|psiko|psi)\b/, 'FPsi'],
  [/\bkedokteran\b/, 'FK'],
  [/\b(keperawatan|perawat)\b/, 'FKP'],
  [/\b(psdku|magetan)\b/, 'PSDKU'],
];

const PATTERNS: Record<Intent, RegExp[]> = {
  // Small Talk: dicek SETELAH intent spesifik, jadi "halo, cp ft siapa?" tetap CONTACT.
  SMALL_TALK: [
    /^(halo|hallo|hai|hi|hello|hey|p+|hei|assalamu'?alaikum|permisi)\b/i,
    /^(makasih|terima\s*kasih|thanks?|thx|tks|mksh|suwun|matur\s+nuwun)\b/i,
    /^(oke|ok|okey|sip|siap|noted|noted\s+ya|udah\s+paham|paham|baik)\b/i,
    /^(mantap|keren|good|bagus|nice|asyik|asik|wkwk|haha)/i,
    /^(sampai\s+jumpa|bye|dadah|selamat\s+tinggal)\b/i,
    /^(selamat\s+(pagi|siang|sore|malam))\b/i,
    /^(gara|gara!|gara\?)\s*$/i,
    /^(apa\s+kabar|kabarmu|kamu\s+baik)/i,
    /^(kamu\s+siapa|siapa\s+kamu|nama\s+kamu|kamu\s+ai|siapa\s+namamu)/i,
    /^(😊|🙏|👍|✅|🎉|😄|😃)\s*$/,
  ],

  // Off-topic
  OFF_TOPIC: [
    /\b(cuaca|prakiraan\s+cuaca|hujan\s+ga|mendung)\b/i,
    /\b(resep|masak|makanan\s+enak|kuliner|resto|warung)\b/i,
    /\b(berita\s+(politik|nasional)|pilkada|pemilu|partai\s+politik)\b/i,
    /\b(harga\s+(saham|crypto|bitcoin|eth))\b/i,
    /\b(film\s+apa|drama\s+korea|anime|manga|series)\b/i,
    /\b(lirik\s+lagu|chord\s+gitar)\b/i,
    /\b(gosip|artis|selebritis|idol\s+kpop)\b/i,
    /\b(cara\s+main\s+(game|ml|pubg|ff)|free\s+fire|mobile\s+legends)\b/i,
    /\b(ramalan\s+bintang|zodiak|shio|horoskop)\b/i,
    /\b(pinjam\s+uang|hutang|dompet\s+digital\s+transfer)\b/i,
  ],

  TODAY: [
    /hari\s+ini\b.*\b(ngapain|ada\s+apa|kegiatan|acara)/i,
    /\b(ngapain|kegiatan|acara)\b.*\bhari\s+ini/i,
    /kegiatan\s+(hari\s+ini|besok|sekarang)/i,
    /jadwal\s+(hari\s+ini|sekarang|besok|malam|sore|pagi)/i,
    /apa\s+yang\s+harus\s+(aku|saya|kita)\s+(lakukan|kerjakan)\s+hari\s+ini/i,
    /agenda\s+(hari\s+ini|besok)/i,
    /(hari\s+ini|besok|sekarang)\s+(ada\s+apa|ngapain)/i,
    /\bbesok\s+(ada\s+)?(kegiatan|acara)/i,
  ],
  SCHEDULE: [
    /\bjadwal\b/i,
    /kapan\s+(pkkmb|garda|acara|upacara|pra.?pkkmb|d.?day|pembukaan|opening|welcoming|kegiatan|dimulai|mulai)/i,
    /tanggal\s+berapa/i,
    /timeline/i,
    /rangkaian\s+(acara|kegiatan)/i,
    /pra.?pkkmb/i,
    /pkkmb\s+(universitas|fakultas)/i,
    /upacara\s+kemerdekaan/i,
    /\b(opening\s+ceremony|welcoming\s+party)\b/i,
    /\bd.?day\b/i,
    /\b(online|offline|daring|luring|hybrid|zoom|youtube)\b/i,
    /\b(lokasi|tempat)(nya)?\s+(acara|kegiatan|pkkmb)/i,
  ],
  CONTACT: [
    /\bc\s?p\b/i,
    /\bkontak\b/i,
    /contact\s+person/i,
    /nomor\s+(hp|wa|whatsapp|telp|telepon)/i,
    /\bno\.?\s*(hp|wa)\b/i,
    /hubungi\s+(siapa|cp|panitia)/i,
    /koordinator/i,
    /\bwa\s+(panitia|fakultas)/i,
    /whatsapp/i,
  ],
  PERIZINAN: [
    /perizinan/i,
    /\bizin(nya)?\b/i,
    /\bijin\b/i,
    /berhalangan/i,
    /(tidak|ga|gak|nggak|ngga|enggak|gabisa|gbs)\s*(bisa\s+)?(hadir|datang|ikut)/i,
    /\bsakit\b/i,
    /dispensasi/i,
  ],
  PRESENSI: [
    /presensi/i,
    /absen(si)?/i,
    /daftar\s+hadir/i,
    /kehadiran/i,
    /\bhadir\b/i,
    /keterlambatan/i,
  ],
  DRESSCODE: [
    /dress\s?code/i,
    /pakaian/i,
    /\bbaju\b/i,
    /seragam/i,
    /outfit/i,
    /wajib\s+pakai/i,
    /\b(pake|pakai)\s+apa\b/i,
    /atribut/i,
    /\b(sepatu|celana|rok|kemeja|hijab|jilbab|kerudung|scarf|dasi|almamater|topi|kaos\s+kaki|hair.?net|ikat\s+pinggang)\b/i,
  ],
  PENUGASAN: [
    /penugasan/i,
    /\btugas\b/i,
    /\b(esai|essay|resume)\b/i,
    /\bdeadline\b/i,
    /plagia/i,
    /turnitin/i,
    /\bnama\s+file\b/i,
  ],
  ANNOUNCEMENT: [
    /pengumuman/i,
    /info\s+terbaru/i,
    /update\s+terbaru/i,
    /berita\s+terbaru/i,
    /apa\s+yang\s+baru/i,
    /infonya\s+apa/i,
    /sosialisasi/i,
  ],
  FAQ: [
    /apa\s+itu\s+(pkkmb|garda)/i,
    /cara\s+(daftar|mendaftar)/i,
    /syarat/i,
    /ketentuan/i,
    /peraturan/i,
    /\baturan\b/i,
    /sanksi/i,
    /melanggar|pelanggaran/i,
    /\b(bawa|dibawa|bawaan|membawa)\b/i,
    /\b(dilarang|larangan|terlarang)\b/i,
    /\b(kendaraan|motor|mobil|parkir)\b/i,
    /\b(hp|handphone|ponsel|gadget)\b/i,
    /\b(makanan|makan|minum|tumbler)\b/i,
    /\b(bisindo|bahasa\s+isyarat)\b/i,
    /\b(keluar|meninggalkan)\s+(lokasi|tempat|area)/i,
    /\b(konten|upload|unggah|posting|sosmed)\b/i,
    /\b(harus|wajib)\s+datang|datang\s+jam|jam\s+berapa\s+(harus\s+)?datang/i,
    /\b(telat|terlambat)\b/i,
    /\bkendala\b/i,
    /tema\s+(pkkmb|garda)/i,
    /jayantara\s+nuswantara/i,
  ],
  // GENERAL: only if no other intent matches
  GENERAL: [],
  SECURITY_THREAT: [],
};

// Urutan prioritas: intent spesifik dulu, small talk setelahnya, GENERAL terakhir.
// PERIZINAN sebelum PRESENSI ("ga bisa hadir" = izin). PENUGASAN sebelum SCHEDULE
// ("deadline resume d-day" = tugas). DRESSCODE sebelum SCHEDULE ("dresscode opening ceremony").
const PRIORITY: Intent[] = [
  'OFF_TOPIC',
  'TODAY',
  'CONTACT',
  'PERIZINAN',
  'PENUGASAN',
  'PRESENSI',
  'DRESSCODE',
  'ANNOUNCEMENT',
  'SCHEDULE',
  'FAQ',
  'SMALL_TALK',
];

function matchIntent(text: string): Intent {
  return PRIORITY.find((intent) => PATTERNS[intent].some((p) => p.test(text))) ?? 'GENERAL';
}

export function extractFaculty(text: string): string | undefined {
  for (const word of text.toUpperCase().split(/[^A-Z]+/)) {
    const code = FACULTY_CODES.get(word);
    if (code) return code;
  }
  const lower = text.toLowerCase();
  return FACULTY_ALIASES.find(([pattern]) => pattern.test(lower))?.[1];
}

function detectMood(text: string): 'CONFUSED' | 'PANIC' | 'LATE' | 'NEUTRAL' {
  const lower = text.toLowerCase();
  if (/panik|takut|gawat|tolong|darurat/i.test(lower)) return 'PANIC';
  if (/bingung|(nggak|ga|gak|tidak|belum)\s+(ngerti|paham)|gimana\s+sih|pusing/i.test(lower)) return 'CONFUSED';
  if (/telat|terlambat|ketinggalan/i.test(lower)) return 'LATE';
  return 'NEUTRAL';
}

export function detectIntent(userMessage: string, history: ConversationTurn[] = []): DetectedIntent {
  const mood = detectMood(userMessage);

  if (isBlocked(userMessage)) {
    return { intent: 'SECURITY_THREAT', confidence: 'HIGH', mood };
  }

  let intent = matchIntent(userMessage);
  let confidence: DetectedIntent['confidence'] = intent === 'GENERAL' ? 'LOW' : 'HIGH';
  let faculty = extractFaculty(userMessage);
  const shortMessage = userMessage.trim().split(/\s+/).length <= 4;

  // Contextual memory: hanya untuk pertanyaan lanjutan yang tidak punya intent sendiri
  // ("kalau fbs?", "yang putri?"). Ambil dari pesan user terbaru yang punya intent spesifik.
  if (intent === 'GENERAL' && history.length > 0) {
    for (let i = history.length - 1; i >= Math.max(0, history.length - 4); i--) {
      const turn = history[i];
      if (turn.role !== 'user') continue;
      const past = matchIntent(turn.text);
      if (past !== 'GENERAL' && past !== 'SMALL_TALK' && past !== 'OFF_TOPIC') {
        intent = past;
        confidence = 'MEDIUM'; // inherited
        break;
      }
    }
  }

  // Fakultas saja ("fikk", "kalau fbs?") → kontak
  if (faculty && shortMessage && (intent === 'GENERAL' || intent === 'SMALL_TALK')) {
    intent = 'CONTACT';
    confidence = 'HIGH';
  }

  // Fakultas diwarisi dari pesan sebelumnya hanya untuk pertanyaan yang bergantung fakultas
  if (!faculty && intent === 'CONTACT') {
    faculty = history.filter((t) => t.role === 'user').map((t) => extractFaculty(t.text)).filter(Boolean).at(-1);
  }

  return { intent, confidence, faculty, mood };
}
