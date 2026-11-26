export const GEMINI_RATE_LIMIT_RESPONSE = 'Antrean sedang penuh nih! Coba beberapa detik lagi ya.';

export interface GeminiResponse {
  text: string;
  tokenCount?: number;
}

export interface ConversationTurn {
  role: 'user' | 'model';
  text: string;
}

// Circuit Breaker
let circuitBreakerFailures = 0;
let circuitBreakerUntil = 0;
const MAX_FAILURES = 3;
const COOLDOWN_MS = 30000; // 30 seconds

export function isCircuitBreakerTripped(): boolean {
  return Date.now() < circuitBreakerUntil;
}

export function hasGeminiKey(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

const GEMINI_OPENAI_BASE = 'https://generativelanguage.googleapis.com/v1beta/openai';
// Alias "-latest" selalu menunjuk model Flash terbaru, jadi tidak rusak saat Google mempensiunkan versi lama
// (gemini-1.5/2.0/2.5-flash sudah ditolak untuk key baru). Lite = cadangan saat Flash sedang penuh (503).
const GEMINI_DIRECT_MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest'];
// aiAnswer gives the whole AI call 12s; half per model leaves Lite time to answer.
const PER_MODEL_TIMEOUT_MS = 6000;

async function callGeminiDirect(
  messages: Array<{ role: string; content: string }>,
  temperature: number,
  maxTokens: number,
  abortSignal?: AbortSignal
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY!;
  // Try models in order. Each gets its own time cap: a busy Flash can hang instead of
  // answering 503, and must not use up the caller's whole budget before Lite is tried.
  for (const model of GEMINI_DIRECT_MODELS) {
    const signals = [AbortSignal.timeout(PER_MODEL_TIMEOUT_MS), ...(abortSignal ? [abortSignal] : [])];
    let response: Response;
    try {
      response = await fetch(`${GEMINI_OPENAI_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens }),
        signal: AbortSignal.any(signals),
      });
    } catch (err) {
      if (abortSignal?.aborted) throw err; // caller gave up: stop
      console.warn(`[Gemini Direct] Model ${model} timed out after ${PER_MODEL_TIMEOUT_MS}ms`);
      continue;
    }
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

// Unified Entry Point
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

  // OpenAI-compatible messages format (Gemini's /openai endpoint)
  const messages: Array<{ role: string; content: string }> = history.map((turn) => ({
    role: turn.role === 'model' ? 'assistant' : 'user',
    content: turn.text,
  }));
  messages.push({ role: 'user', content: prompt });

  if (!hasGeminiKey()) throw new Error('No AI API key configured');

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

