interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// Module-level store (persists across requests in same process)
const store = new Map<string, RateLimitEntry>();

const LIMIT = 20;
const WINDOW_MS = 60 * 1000; // 1 minute

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > WINDOW_MS * 2) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // New window
    store.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: LIMIT - 1, resetInMs: WINDOW_MS };
  }

  if (entry.count >= LIMIT) {
    const resetInMs = WINDOW_MS - (now - entry.windowStart);
    return { allowed: false, remaining: 0, resetInMs };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: LIMIT - entry.count,
    resetInMs: WINDOW_MS - (now - entry.windowStart),
  };
}

export function getIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

export const RATE_LIMIT_RESPONSE =
  '😅 Gara sedang melayani banyak mahasiswa saat ini. Silakan coba beberapa saat lagi ya.';
