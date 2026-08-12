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

const FACULTIES = ['FIP', 'FBS', 'FMIPA', 'FT', 'FEB', 'FISIPOL', 'FIKK', 'FV', 'FH', 'FPSI', 'FK', 'FKP'];

const FACULTY_ALIASES: Record<string, string> = {
  'teknik': 'FT',
  'ekonomi': 'FEB',
  'bisnis': 'FEB',
  'bahasa': 'FBS',
  'sastra': 'FBS',
  'ilmu pendidikan': 'FIP',
  'pendidikan': 'FIP',
  'mipa': 'FMIPA',
  'matematika': 'FMIPA',
  'sains': 'FMIPA',
  'ilmu sosial': 'FISIPOL',
  'sosial': 'FISIPOL',
  'politik': 'FISIPOL',
  'keolahragaan': 'FIKK',
  'olahraga': 'FIKK',
  'vokasi': 'FV',
  'hukum': 'FH',
  'hkm': 'FH',
  'psikologi': 'FPSI',
  'psi': 'FPSI',
  'kedokteran': 'FK',
  'keperawatan': 'FKP',
  'perawatan': 'FKP',
};

const SECURITY_PATTERNS: RegExp[] = [
  /ignore\s+(previous|all|your)\s+instructions?/i,
  /forget\s+(everything|all|your|previous)/i,
  /developer\s+mode/i,
  /jailbreak/i,
  /reveal\s+(your\s+)?(prompt|instruction|system)/i,
  /what\s+(is\s+)?your\s+(system\s+)?prompt/i,
  /show\s+(me\s+)?(your\s+)?(system\s+)?prompt/i,
  /api[\s_-]?key/i,
  /\.env/i,
  /database\s+dump/i,
  /internal\s+config/i,
  /secret\s+token/i,
  /override\s+(your\s+)?(rules|instruction)/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /act\s+as\s+(if\s+you\s+are|a\s+different)/i,
  /new\s+persona/i,
  /bypass\s+(safety|filter|restriction)/i,
];

const PATTERNS: Record<Intent, RegExp[]> = {
  // Small Talk
  SMALL_TALK: [
    /^(halo|hai|hi|hello|hey|p+|hei)\b/i,
    /^(makasih|terima\s*kasih|thanks?|thx|tks|mksh)\b/i,
    /^(oke|ok|okey|sip|siap|noted|noted\s+ya|udah\s+paham)\b/i,
    /^(mantap|keren|good|bagus|nice|asyik|asik)\b/i,
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
    /hari\s+ini\s+(ngapain|harus\s+ngapain|ada\s+apa|kegiatan)/i,
    /kegiatan\s+hari\s+ini/i,
    /jadwal\s+(hari\s+ini|sekarang|malam|sore|pagi)/i,
    /apa\s+yang\s+harus\s+(aku|saya|kita)\s+(lakukan|kerjakan)\s+hari\s+ini/i,
    /agenda\s+hari\s+ini/i,
    /hari\s+ini\s+ada\s+apa/i,
  ],
  SCHEDULE: [
    /jadwal\s+(pkkmb|garda|acara|kegiatan)/i,
    /kapan\s+(pkkmb|garda|acara|upacara|pra.pkkmb)/i,
    /tanggal\s+berapa/i,
    /timeline/i,
    /rangkaian\s+acara/i,
    /pra.?pkkmb/i,
    /pkkmb\s+(universitas|fakultas)/i,
    /upacara\s+kemerdekaan/i,
  ],
  CONTACT: [
    /c\s*p\b/i,
    /kontak\s+(person|panitia|koordinator)/i,
    /siapa\s+cp/i,
    /nomor\s+(hp|wa|whatsapp|telp|telepon)/i,
    /contact\s+person/i,
    /hubungi\s+(siapa|cp)/i,
    /cp\s+(saya|ku|aku|kita)/i,
    /koordinator/i,
    /hubungi/i,
    /\bwa\s+(fakultas|ft|fip|fbs|fmipa|feb|fisipol|fikk|fv|fh|fpsi|fkp|fk|hkm)/i,
    /nomor\s+wa/i,
    /whatsapp/i,
  ],
  PRESENSI: [
    /presensi/i,
    /absen(si)?/i,
    /daftar\s+hadir/i,
    /\bhadir\b/i,
    /keterlambatan/i,
    /telat\s+(presensi|absen)/i,
    /kapan\s+(presensi|absen)\s+dibuka/i,
    /cara\s+(isi|mengisi)\s+(presensi|absen)/i,
  ],
  DRESSCODE: [
    /dresscode/i,
    /dress\s+code/i,
    /pakaian/i,
    /\bbaju\b/i,
    /seragam/i,
    /outfit/i,
    /wajib\s+pakai/i,
    /atribut/i,
  ],
  PENUGASAN: [
    /penugasan/i,
    /\btugas\b/i,
    /kumpul(kan)?\s+tugas/i,
    /submit\s+tugas/i,
    /link\s+tugas/i,
    /deadline\s+tugas/i,
    /form\s+penugasan/i,
  ],
  PERIZINAN: [
    /perizinan/i,
    /\bizin\b/i,
    /berhalangan/i,
    /tidak\s+bisa\s+hadir/i,
    /form\s+izin/i,
    /cara\s+izin/i,
    /dispensasi/i,
  ],
  ANNOUNCEMENT: [
    /pengumuman/i,
    /info\s+terbaru/i,
    /update\s+terbaru/i,
    /berita\s+terbaru/i,
    /apa\s+yang\s+baru/i,
    /infonya\s+apa/i,
    /ada\s+pengumuman/i,
  ],
  FAQ: [
    /apa\s+itu\s+(pkkmb|garda)/i,
    /cara\s+(daftar|mendaftar)/i,
    /syarat/i,
    /ketentuan/i,
    /peraturan/i,
    /sanksi/i,
    /apa\s+yang\s+dibawa/i,
    /tema\s+(pkkmb|garda)/i,
    /jayantara\s+nuswantara/i,
  ],
  // GENERAL: only if no other intent matches
  // Note: /\?/ removed as trigger - too broad
  GENERAL: [
    /bantuan/i,
    /\btolong\b/i,
    /cerita(kan)?/i,
    /jelaskan/i,
    /maksud(nya)?/i,
    /gimana\s+(cara|kalau|jika)/i,
    /bagaimana\s+cara/i,
    /apa\s+(saja|aja)\s+yang/i,
    /boleh\s+(tanya|nanya)/i,
    /bisa\s+(apa|bantu|kasih\s+info)/i,
    /kamu\s+(bisa|tau|tahu)/i,
    /gara\s+(bisa|tau|tahu)/i,
    /tolong\s+(bantu|jelaskan|cerita)/i,
  ],
  SECURITY_THREAT: [],
};

function extractFaculty(text: string): string | undefined {
  const cleanStr = text.toUpperCase().replace(/[^A-Z]/g, '');
  for (const fac of FACULTIES) {
    if (cleanStr.includes(fac)) return fac;
  }
  const lower = text.toLowerCase();
  for (const [alias, fac] of Object.entries(FACULTY_ALIASES)) {
    if (lower.includes(alias)) return fac;
  }
  return undefined;
}

function detectMood(text: string): 'CONFUSED' | 'PANIC' | 'LATE' | 'NEUTRAL' {
  const lower = text.toLowerCase();
  if (/bingung|nggak\s+ngerti|ga\s+ngerti|paham|gimana\s+sih|pusing|bantu/i.test(lower)) return 'CONFUSED';
  if (/panik|takut|gawat|tolong|mati/i.test(lower)) return 'PANIC';
  if (/telat|terlambat|ketinggalan/i.test(lower)) return 'LATE';
  return 'NEUTRAL';
}

export function detectIntent(userMessage: string, history: ConversationTurn[] = []): DetectedIntent {
  const mood = detectMood(userMessage);

  // Security check first
  for (const pattern of SECURITY_PATTERNS) {
    if (pattern.test(userMessage)) {
      return { intent: 'SECURITY_THREAT', confidence: 'HIGH', mood };
    }
  }

  const faculty = extractFaculty(userMessage);

  // Short faculty-only message → contact intent
  if (faculty && userMessage.trim().length <= 15 && !userMessage.includes('apa')) {
    return { intent: 'CONTACT', confidence: 'HIGH', faculty, mood };
  }

  // Priority order: SMALL_TALK first (fastest path), then specific, then general
  const priorityOrder: Intent[] = [
    'SMALL_TALK',
    'OFF_TOPIC',
    'TODAY',
    'CONTACT',
    'PRESENSI',
    'DRESSCODE',
    'PENUGASAN',
    'PERIZINAN',
    'ANNOUNCEMENT',
    'SCHEDULE',
    'FAQ',
    'GENERAL',
  ];

  let detectedIntent: Intent = 'GENERAL';
  let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';

  for (const intent of priorityOrder) {
    const intentPatterns = PATTERNS[intent];
    for (const pattern of intentPatterns) {
      if (pattern.test(userMessage)) {
        detectedIntent = intent;
        confidence = intent === 'GENERAL' ? 'LOW' : 'HIGH';
        break;
      }
    }
    if (detectedIntent !== 'GENERAL') break;
  }

  let finalFaculty = faculty;
  let finalIntent = detectedIntent;

  // Contextual Memory Inheritance
  if (history.length > 0) {
    // Look back at the last 2 user messages to inherit faculty or intent
    for (let i = history.length - 1; i >= Math.max(0, history.length - 4); i--) {
      const turn = history[i];
      if (turn.role === 'user') {
        if (!finalFaculty) {
          const pastFaculty = extractFaculty(turn.text);
          if (pastFaculty) finalFaculty = pastFaculty;
        }
        
        // If current message is too short or GENERAL, inherit intent
        if (finalIntent === 'GENERAL' || userMessage.split(/\s+/).length <= 2) {
           for (const pIntent of priorityOrder) {
             if (pIntent === 'SMALL_TALK' || pIntent === 'GENERAL' || pIntent === 'OFF_TOPIC') continue;
             for (const pattern of PATTERNS[pIntent]) {
               if (pattern.test(turn.text)) {
                 finalIntent = pIntent;
                 confidence = 'MEDIUM'; // Downgrade confidence because it's inherited
                 break;
               }
             }
             if (finalIntent !== 'GENERAL' && finalIntent !== detectedIntent) break;
           }
        }
      }
    }
  }

  return { intent: finalIntent, confidence, faculty: finalFaculty, mood };
}
