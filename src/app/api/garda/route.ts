import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getIP, RATE_LIMIT_RESPONSE } from '../../../lib/ai/rateLimit';
import { sanitizeInput, SECURITY_RESPONSE } from '../../../lib/ai/security';
import type { ConversationTurn } from '../../../lib/ai/gemini';
import { logQuestion } from '../../../lib/ai/logger';
import { answerLocally, type GardaResponse } from '../../../lib/ai/localAnswer';
import { answerWithAI } from '../../../lib/ai/aiAnswer';

export type { GardaResponse };

export interface GardaRequest {
  message: string;
  faculty?: string;
  history?: Array<{ role: 'user' | 'model'; text: string }>;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Rate limit
  if (!checkRateLimit(getIP(request)).allowed) {
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

  // 4. Local answer (intent, small talk, links, contacts, knowledge base)
  const local = answerLocally(rawMessage, faculty, safeHistory);
  if (local.kind === 'answer') return sendResponse(local.response);

  // 5. AI (Gemini/OpenRouter) with local fallback
  return sendResponse(await answerWithAI(local, safeHistory, faculty));
}
