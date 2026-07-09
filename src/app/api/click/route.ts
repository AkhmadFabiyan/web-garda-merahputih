import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis only if keys are present (prevents crash on build without env vars)
const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export async function POST(req: Request) {
  try {
    if (!redis) {
      return NextResponse.json({ success: false, message: 'Redis not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { type, id } = body;

    if (!type || !id) {
      return NextResponse.json({ success: false, message: 'Missing type or id' }, { status: 400 });
    }

    // Determine the Redis sorted set key
    const redisKey = type === 'faq' ? 'faq_clicks' : type === 'contact' ? 'contact_clicks' : null;

    if (!redisKey) {
      return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
    }

    // Increment the score of the specific ID by 1
    await redis.zincrby(redisKey, 1, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Redis Click Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
