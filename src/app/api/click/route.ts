import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { checkRateLimit, getIP } from '@/lib/ai/rateLimit';
import { faqData } from '@/data/faq';
import { contacts } from '@/data/contacts';

// Only known ids may be counted, so clients cannot stuff arbitrary members into the sorted sets.
const ALLOWED: Record<string, { key: string; ids: Set<string> }> = {
  faq: { key: 'faq_clicks', ids: new Set(faqData.map(f => f.id)) },
  contact: { key: 'contact_clicks', ids: new Set(contacts.map(c => c.faculty)) },
};

export async function POST(req: Request) {
  try {
    if (!checkRateLimit(`click:${getIP(req)}`).allowed) {
      return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    const target = typeof body?.type === 'string' && Object.hasOwn(ALLOWED, body.type) ? ALLOWED[body.type] : undefined;

    if (!target || typeof body.id !== 'string' || !target.ids.has(body.id)) {
      return NextResponse.json({ success: false, message: 'Invalid type or id' }, { status: 400 });
    }

    if (!redis) {
      return NextResponse.json({ success: false, message: 'Redis not configured' }, { status: 500 });
    }

    await redis.zincrby(target.key, 1, body.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Redis Click Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
