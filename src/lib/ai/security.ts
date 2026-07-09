/**
 * Security Module
 * Input sanitization and threat detection.
 */

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
  { pattern: /\bpassword\b/i, reason: 'secret_extraction' },
  { pattern: /auth(entication)?\s+token/i, reason: 'secret_extraction' },
  { pattern: /bearer\s+token/i, reason: 'secret_extraction' },
  { pattern: /server\s+(config|configuration|setup)/i, reason: 'secret_extraction' },
];

export function sanitizeInput(input: string): SecurityResult {
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

export const SECURITY_RESPONSE =
  '⚠️ Permintaan tersebut tidak dapat diproses oleh Gara. Aku hanya dapat membantu informasi seputar PKKMB Garda UNESA 2026.';

export const OFF_TOPIC_RESPONSE =
  'Maaf 😊 Gara hanya dapat membantu informasi seputar PKKMB Garda UNESA 2026. Ada yang ingin kamu tanyakan tentang jadwal, presensi, tugas, atau kontak panitia?';
