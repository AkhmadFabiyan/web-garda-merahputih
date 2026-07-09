/**
 * OpenRouter + Gemini Direct Client
 * Auto-detects available API key and routes accordingly.
 * - OPENROUTER_API_KEY → OpenRouter (multi-model, load-balanced)
 * - GEMINI_API_KEY     → Gemini Direct via OpenAI-compatible endpoint
 * Both can coexist; OpenRouter is tried first, Gemini as fallback.
 */

export const GEMINI_RATE_LIMIT_RESPONSE = 'Antrean sedang penuh nih! Coba beberapa detik lagi ya.';

export interface GeminiResponse {
  text: string;
  tokenCount?: number;
}

export interface ConversationTurn {
  role: 'user' | 'model';
  text: string;
}

// ─── Circuit Breaker ──────────────────────────────────────────
let circuitBreakerFailures = 0;
let circuitBreakerUntil = 0;
const MAX_FAILURES = 3;
const COOLDOWN_MS = 30000; // 30 seconds

export function isCircuitBreakerTripped(): boolean {
  return Date.now() < circuitBreakerUntil;
}

// ─── OpenRouter ───────────────────────────────────────────────
let currentOpenRouterKeyIndex = 0;

export function getGeminiKeys(): string[] {
  const keysString = process.env.OPENROUTER_API_KEY;
  if (!keysString) return [];
  return keysString.split(',').map((k) => k.trim()).filter(Boolean);
}

export function hasGeminiKey(): boolean {
  return getGeminiKeys().length > 0 || hasDirectGeminiKey();
}

function getNextOpenRouterKey(): string | null {
  const keys = getGeminiKeys();
  if (keys.length === 0) return null;
  const key = keys[currentOpenRouterKeyIndex % keys.length];
  currentOpenRouterKeyIndex = (currentOpenRouterKeyIndex + 1) % keys.length;
  return key;
}

// ─── Gemini Direct ────────────────────────────────────────────
export function hasDirectGeminiKey(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

const GEMINI_OPENAI_BASE = 'https://generativelanguage.googleapis.com/v1beta/openai';
const GEMINI_DIRECT_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash'];

async function callGeminiDirect(
  messages: Array<{ role: string; content: string }>,
  temperature: number,
  maxTokens: number,
  abortSignal?: AbortSignal
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY!;
  // Try models in order
  for (const model of GEMINI_DIRECT_MODELS) {
    const response = await fetch(`${GEMINI_OPENAI_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens }),
      signal: abortSignal,
    });
    if (response.ok) {
      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        return data.choices[0].message.content;
      }
    } else {
      const errText = await response.text().catch(() => 'unknown');
      console.warn(`[Gemini Direct] Model ${model} failed with ${response.status}: ${errText}`);
      if (response.status === 429) throw new Error('RATE_LIMIT_EXCEEDED');
    }
  }
  throw new Error('Gemini direct: all models failed');
}

// ─── OpenRouter ───────────────────────────────────────────────
const OPENROUTER_MODELS = [
  'openai/gpt-oss-120b:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
];

async function callOpenRouter(
  messages: Array<{ role: string; content: string }>,
  temperature: number,
  maxTokens: number,
  abortSignal?: AbortSignal
): Promise<string> {
  const apiKey = getNextOpenRouterKey();
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

  // Shuffle models for load balancing
  const models = [...OPENROUTER_MODELS].sort(() => Math.random() - 0.5);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'https://garda.unesa.ac.id',
      'X-Title': 'Garda UNESA Chatbot',
    },
    body: JSON.stringify({ models, messages, temperature, top_p: temperature > 0.3 ? 0.95 : 0.85, max_tokens: maxTokens }),
    signal: abortSignal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'unknown error');
    if (response.status === 429) throw new Error('RATE_LIMIT_EXCEEDED');
    throw new Error(`OpenRouter error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
  throw new Error('Invalid response from OpenRouter');
}

// ─── Unified Entry Point ──────────────────────────────────────
export async function callGemini(
  prompt: string,
  abortSignal?: AbortSignal,
  history: ConversationTurn[] = [],
  temperature: number = 0.1
): Promise<GeminiResponse> {
  if (isCircuitBreakerTripped()) {
    throw new Error('CIRCUIT_BREAKER_TRIPPED');
  }

  const maxTokens = temperature > 0.3 ? 800 : 600;

  // Build messages array (shared format for both providers)
  const messages: Array<{ role: string; content: string }> = history.map((turn) => ({
    role: turn.role === 'model' ? 'assistant' : 'user',
    content: turn.text,
  }));
  messages.push({ role: 'user', content: prompt });

  // Strategy: OpenRouter first, then Gemini Direct as fallback (or vice versa)
  const hasOR = getGeminiKeys().length > 0;
  const hasGD = hasDirectGeminiKey();

  if (!hasOR && !hasGD) throw new Error('No AI API key configured');

  // Try OpenRouter first (if available)
  if (hasOR) {
    try {
      const text = await callOpenRouter(messages, temperature, maxTokens, abortSignal);
      circuitBreakerFailures = 0; // Reset on success
      return { text };
    } catch (err) {
      if (!hasGD) {
        circuitBreakerFailures++;
        if (circuitBreakerFailures >= MAX_FAILURES) {
          circuitBreakerUntil = Date.now() + COOLDOWN_MS;
        }
        throw err; // No fallback available
      }
      // Fall through to Gemini Direct for any OpenRouter error (rate limit, timeout, 5xx)
      console.warn('[AI] OpenRouter failed, falling back to Gemini Direct. Error:', err instanceof Error ? err.message : 'Unknown error');
    }
  }

  // Try Gemini Direct
  if (hasGD) {
    try {
      const text = await callGeminiDirect(messages, temperature, maxTokens, abortSignal);
      circuitBreakerFailures = 0; // Reset on success
      return { text };
    } catch (err) {
      circuitBreakerFailures++;
      if (circuitBreakerFailures >= MAX_FAILURES) {
        circuitBreakerUntil = Date.now() + COOLDOWN_MS;
      }
      throw err;
    }
  }

  throw new Error('All AI providers failed');
}

// Keep for legacy compatibility
export function getGeminiKeys_legacy() { return getGeminiKeys(); }
