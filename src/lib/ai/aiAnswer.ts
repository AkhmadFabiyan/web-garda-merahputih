// Jalur AI Gara (Gemini) untuk pertanyaan yang tidak bisa dijawab lokal.
import { buildContext, type KnowledgeChunk } from './knowledgeSearch';
import { getTodayInfo } from './todayEngine';
import { buildGeminiPrompt } from './systemPrompt';
import { callGemini, hasGeminiKey, GEMINI_RATE_LIMIT_RESPONSE, type ConversationTurn } from './gemini';
import { filterOutput } from './outputFilter';
import { getCachedResponse, setCachedResponse, getCacheKey } from './cache';
import { chunkAnswer, finalFallback, getSuggestions, type GardaResponse, type LocalResult } from './localAnswer';

const GEMINI_ERROR_RESPONSE = 'Maaf, sistem AI Gara sedang mengalami gangguan jaringan. Coba lagi nanti ya!';
const CIRCUIT_BREAKER_RESPONSE = 'Mohon maaf, sistem AI sedang dalam perlindungan dari kelebihan beban (Circuit Breaker Aktif). Silakan tanya kembali dalam 30 detik ya.';
const AI_TIMEOUT_MS = 12000;

async function callGeminiWithFallback(
  message: string,
  contextChunks: KnowledgeChunk[],
  intent: string,
  mood: string,
  history: ConversationTurn[],
  temperature: number,
  creative: boolean
): Promise<{ answer: string; usedGemini: boolean }> {
  const prompt = buildGeminiPrompt(message, buildContext(contextChunks), getTodayInfo().message, mood, creative);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const result = await callGemini(prompt, controller.signal, history, temperature);
    return { answer: filterOutput(result.text).filtered, usedGemini: true };
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'RATE_LIMIT_EXCEEDED') {
      return { answer: GEMINI_RATE_LIMIT_RESPONSE, usedGemini: false };
    }
    if (err instanceof Error && err.message === 'CIRCUIT_BREAKER_TRIPPED') {
      return { answer: CIRCUIT_BREAKER_RESPONSE, usedGemini: false };
    }
    console.error(`[Gara] AI error (intent=${intent}):`, err);
    return { answer: GEMINI_ERROR_RESPONSE, usedGemini: false };
  } finally {
    clearTimeout(timeout);
  }
}

/** Respons untuk kegagalan AI yang harus diteruskan ke pengguna, atau null bila boleh lanjut ke fallback lokal. */
function aiFailure(answer: string): GardaResponse | null {
  if (answer === GEMINI_RATE_LIMIT_RESPONSE) return { answer, intent: 'RATE_LIMITED', usedGemini: false };
  if (answer === GEMINI_ERROR_RESPONSE) return { answer, intent: 'ERROR', usedGemini: false };
  return null;
}

export async function answerWithAI(
  local: Extract<LocalResult, { kind: 'needs_ai' }>,
  history: ConversationTurn[]
): Promise<GardaResponse> {
  const { message, detected, faculty, chunks, creative } = local;
  const intent = detected.intent;
  const mood = detected.mood || 'NEUTRAL';

  if (hasGeminiKey()) {
    // CREATIVE request — high temp, no cache
    if (creative) {
      const { answer, usedGemini } = await callGeminiWithFallback(message, chunks, intent, mood, history, 0.65, true);
      if (usedGemini && answer) return { answer, intent, usedGemini: true };
      const failure = aiFailure(answer);
      if (failure) return failure;
    }

    // Pertanyaan lanjutan pendek ("kalau yang putri?") bergantung pada riwayat → jangan pakai cache,
    // kalau tidak, jawaban percakapan lain ikut tersaji.
    const followUp = history.length > 0 && message.trim().split(/\s+/).length <= 4;
    const cacheKey = followUp ? null : getCacheKey(message, intent, faculty);
    const cached = cacheKey ? getCachedResponse(cacheKey) : null;
    if (cached) {
      return { answer: cached, intent, usedGemini: true, suggestions: getSuggestions(intent, faculty) };
    }

    const { answer, usedGemini } = await callGeminiWithFallback(message, chunks, intent, mood, history, 0.1, false);
    if (usedGemini && answer) {
      if (cacheKey) setCachedResponse(cacheKey, answer);
      return { answer, intent, usedGemini: true, suggestions: getSuggestions(intent, faculty) };
    }
    const failure = aiFailure(answer);
    if (failure) return failure;
  }

  // Local fallback (no key, circuit breaker) → top chunk, else CP
  return chunkAnswer(chunks, intent, faculty) ?? finalFallback(faculty);
}
