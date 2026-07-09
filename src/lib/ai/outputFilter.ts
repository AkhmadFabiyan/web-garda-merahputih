/**
 * Output Filter
 * Post-process Gemini output to block accidental secret leaks.
 */

export interface FilterResult {
  safe: boolean;
  filtered: string;
}

const SECRET_PATTERNS: RegExp[] = [
  // API keys and tokens
  /[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{20,}/g, // JWT-like
  /AIza[0-9A-Za-z_-]{35}/g, // Google API keys
  /sk-[a-zA-Z0-9]{32,}/g,   // OpenAI-style keys
  /Bearer\s+[A-Za-z0-9_.~+/-]+=*/gi,
  /token[:\s]+[A-Za-z0-9_.-]{20,}/gi,

  // .env file contents
  /[A-Z_]+=["']?[A-Za-z0-9_./:-]{8,}["']?/g,

  // Internal URLs
  /https?:\/\/(localhost|127\.0\.0\.1|internal|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+)/gi,

  // System prompt leaks
  /system\s+prompt/gi,
  /garda_system_prompt/gi,
  /build_gemini_prompt/gi,

  // Common secrets
  /password\s*[=:]\s*\S+/gi,
  /secret\s*[=:]\s*\S+/gi,
];

const REDACTION = '[REDACTED]';

export function filterOutput(text: string): FilterResult {
  if (!text || typeof text !== 'string') {
    return { safe: false, filtered: 'Maaf, terjadi kesalahan dalam memproses jawaban.' };
  }

  let filtered = text;
  let hasSecrets = false;

  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(filtered)) {
      hasSecrets = true;
      filtered = filtered.replace(pattern, REDACTION);
    }
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0;
  }

  // If too many redactions, return fallback
  const redactionCount = (filtered.match(/\[REDACTED\]/g) || []).length;
  if (redactionCount > 2) {
    return {
      safe: false,
      filtered: 'Maaf, informasi tersebut belum tersedia pada sistem Gara.',
    };
  }

  return { safe: !hasSecrets, filtered };
}
