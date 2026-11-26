export interface SecurityResult {
  safe: boolean;
  reason?: string;
}

const BLOCKED_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  // Prompt injection
  { pattern: /ignore\s+(previous|all|your)\s+instructions?/i, reason: 'prompt_injection' },
  { pattern: /forget\s+(everything|all|your|previous)/i, reason: 'prompt_injection' },
  { pattern: /new\s+instructions?\s*:/i, reason: 'prompt_injection' },
  { pattern: /override\s+(your\s+)?(rules|instruction|behavior)/i, reason: 'prompt_injection' },
  { pattern: /disregard\s+(previous|all|your)/i, reason: 'prompt_injection' },
  // Versi bahasa Indonesia
  { pattern: /(abaikan|lupakan|acuhkan)\s+(semua\s+|seluruh\s+)?(instruksi|perintah|aturan|prompt)/i, reason: 'prompt_injection' },
  { pattern: /(instruksi|perintah)\s+baru\s*:/i, reason: 'prompt_injection' },
  { pattern: /(kamu|anda|lu|lo)\s+sekarang\s+(adalah|jadi|menjadi|bebas)/i, reason: 'jailbreak' },
  { pattern: /(berpura.?pura|pura.?pura)\s+(jadi|menjadi|sebagai)/i, reason: 'jailbreak' },
  { pattern: /(tunjukkan|tampilkan|bocorkan|kasih\s+tau|beri\s*tahu|sebutkan|tulis\s+ulang)\s+(isi\s+)?(prompt|instruksi|aturan)\s+(sistem|kamu|mu)/i, reason: 'extraction' },
  { pattern: /\bsystem\s+prompt\b/i, reason: 'extraction' },

  // System prompt extraction
  { pattern: /reveal\s+(your\s+)?(prompt|instruction|system|rules)/i, reason: 'extraction' },
  { pattern: /show\s+(me\s+)?(your\s+)?(system\s+)?prompt/i, reason: 'extraction' },
  { pattern: /what\s+(is\s+)?your\s+(system\s+)?prompt/i, reason: 'extraction' },
  { pattern: /print\s+(your\s+)?(system\s+)?prompt/i, reason: 'extraction' },
  { pattern: /repeat\s+(your\s+)?(system\s+)?prompt/i, reason: 'extraction' },

  // Developer / jailbreak
  { pattern: /developer\s+mode/i, reason: 'jailbreak' },
  { pattern: /\bjailbreak\b/i, reason: 'jailbreak' },
  { pattern: /\bdan\s+mode\b/i, reason: 'jailbreak' },
  { pattern: /pretend\s+(you\s+are|to\s+be)\s+(?!a\s+helpful)/i, reason: 'jailbreak' },
  { pattern: /act\s+as\s+(if\s+you\s+(are|have\s+no)|a\s+different)/i, reason: 'jailbreak' },
  { pattern: /you\s+(are\s+)?now\s+(a\s+)?(?!an\s+assistant)/i, reason: 'jailbreak' },
  { pattern: /simulate\s+(being|a)\s+(?!helpful)/i, reason: 'jailbreak' },
  { pattern: /roleplay\s+as\s+(?!a\s+helpful)/i, reason: 'jailbreak' },

  // Secret/config extraction
  { pattern: /api[\s_-]?key/i, reason: 'secret_extraction' },
  { pattern: /\.env/i, reason: 'secret_extraction' },
  { pattern: /database\s+dump/i, reason: 'secret_extraction' },
  { pattern: /internal\s+config/i, reason: 'secret_extraction' },
  { pattern: /secret\s+token/i, reason: 'secret_extraction' },
  // "lupa password SSO" itu pertanyaan wajar; yang diblokir hanya kredensial sistem.
  { pattern: /(password|kata\s+sandi)\s+(admin|server|database|db|sistem|gara|bot)/i, reason: 'secret_extraction' },
  { pattern: /auth(entication)?\s+token/i, reason: 'secret_extraction' },
  { pattern: /bearer\s+token/i, reason: 'secret_extraction' },
  { pattern: /server\s+(config|configuration|setup)/i, reason: 'secret_extraction' },
];

export function isBlocked(text: string): boolean {
  return BLOCKED_PATTERNS.some(({ pattern }) => pattern.test(text));
}

export function sanitizeInput(input: unknown): SecurityResult {
  if (!input || typeof input !== 'string') {
    return { safe: false, reason: 'invalid_input' };
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return { safe: false, reason: 'empty_input' };
  }

  if (trimmed.length > 1000) {
    return { safe: false, reason: 'too_long' };
  }

  for (const { pattern, reason } of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { safe: false, reason };
    }
  }

  return { safe: true };
}

const MAX_HISTORY_TURNS = 6; // 3 pasang
const MAX_TURN_LENGTH = 1000;

export interface GardaTurn {
  role: 'user' | 'model';
  text: string;
}

/**
 * Validasi body /api/garda (data klien, jadi semua field dicek tipenya).
 * - faculty hanya diterima bila ada di daftar fakultas yang dikenal.
 * - history: maks 6 giliran, teks dipotong, dan giliran berpola injeksi dibuang
 *   (termasuk giliran 'model', karena klien bisa memalsukannya), sebab history ikut dikirim ke AI.
 */
export function parseGardaRequest(
  body: unknown,
  knownFaculties: string[]
): { message: unknown; faculty?: string; history: GardaTurn[] } | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const b = body as Record<string, unknown>;

  const rawFaculty = typeof b.faculty === 'string' ? b.faculty.trim().toUpperCase() : '';
  const faculty = knownFaculties.find((f) => f.toUpperCase() === rawFaculty);

  const history = (Array.isArray(b.history) ? b.history : [])
    .filter((t): t is GardaTurn =>
      !!t && typeof t === 'object' && (t.role === 'user' || t.role === 'model') && typeof t.text === 'string')
    .slice(-MAX_HISTORY_TURNS)
    .map((t) => ({ role: t.role, text: t.text.slice(0, MAX_TURN_LENGTH) }))
    .filter((t) => !isBlocked(t.text));

  return { message: b.message, faculty, history };
}

export const SECURITY_RESPONSE =
  '⚠️ Permintaan tersebut tidak dapat diproses oleh Gara. Aku hanya dapat membantu informasi seputar PKKMB Garda UNESA 2026.';

export const OFF_TOPIC_RESPONSE =
  'Maaf 😊 Gara hanya dapat membantu informasi seputar PKKMB Garda UNESA 2026. Ada yang ingin kamu tanyakan tentang jadwal, presensi, tugas, atau kontak panitia?';
