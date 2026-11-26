import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getIP, RATE_LIMIT_RESPONSE } from '../../../lib/ai/rateLimit';
import { sanitizeInput, parseGardaRequest, SECURITY_RESPONSE } from '../../../lib/ai/security';
import { logQuestion } from '../../../lib/ai/logger';
import { answerLocally, type GardaResponse } from '../../../lib/ai/localAnswer';
import { answerWithAI } from '../../../lib/ai/aiAnswer';
import { contacts } from '../../../data/contacts';

export type { GardaResponse };

export interface GardaRequest {
  message: string;
  faculty?: string;
  history?: Array<{ role: 'user' | 'model'; text: string }>;
}

// proxy.ts hanya mengecek header content-length, yang tidak ada pada body chunked.
const MAX_BODY_CHARS = 10240;
const KNOWN_FACULTIES = contacts.map((c) => c.faculty);
const INVALID: GardaResponse = { answer: 'Permintaan tidak valid.', intent: 'ERROR', usedGemini: false };

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Rate limit
  if (!checkRateLimit(getIP(request)).allowed) {
    return NextResponse.json<GardaResponse>(
      { answer: RATE_LIMIT_RESPONSE, intent: 'RATE_LIMITED', usedGemini: false },
      { status: 429 }
    );
  }

  // 2. Parse & validate body
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_CHARS) return NextResponse.json(INVALID, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json(INVALID, { status: 400 });
  }
  const parsed = parseGardaRequest(body, KNOWN_FACULTIES);
  if (!parsed) return NextResponse.json(INVALID, { status: 400 });
  const { message: rawMessage, faculty, history } = parsed;

  // 3. Security check (on raw message)
  const security = sanitizeInput(rawMessage);
  if (typeof rawMessage !== 'string' || !security.safe) {
    if (security.reason === 'too_long') {
      return NextResponse.json<GardaResponse>({
        answer: 'Pertanyaanmu terlalu panjang. Silakan ringkas ya 😊',
        intent: 'INVALID',
        usedGemini: false,
      }, { status: 400 });
    }
    if (security.reason === 'invalid_input' || security.reason === 'empty_input') {
      return NextResponse.json(INVALID, { status: 400 });
    }
    logQuestion(String(rawMessage), 'SECURITY_THREAT', false);
    return NextResponse.json<GardaResponse>({ answer: SECURITY_RESPONSE, intent: 'SECURITY_THREAT', usedGemini: false });
  }

  const sendResponse = (data: GardaResponse) => {
    logQuestion(rawMessage, data.intent, data.usedGemini);
    return NextResponse.json(data);
  };

  // 4. Local answer (intent, small talk, links, contacts, knowledge base)
  const local = answerLocally(rawMessage, faculty, history);
  if (local.kind === 'answer') return sendResponse(local.response);

  // 5. AI (Gemini) with local fallback
  return sendResponse(await answerWithAI(local, history));
}
