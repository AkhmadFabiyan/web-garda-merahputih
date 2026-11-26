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
}, 5 * 60 * 1000).unref?.(); // jangan menahan proses tetap hidup (skrip/self-check, shutdown)

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
}

const MAX_KEYS = 10000;

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  // Batasi memori bila banyak IP berbeda datang sekaligus.
  if (store.size >= MAX_KEYS) {
    for (const [key, e] of store) if (now - e.windowStart > WINDOW_MS) store.delete(key);
    if (store.size >= MAX_KEYS) store.clear();
  }
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

// Entri PERTAMA x-forwarded-for diisi klien, jadi bisa dipalsukan untuk lolos rate limit.
// Entri TERAKHIR ditambahkan oleh proxy terdekat (Vercel bahkan menimpa seluruh header),
// jadi itu yang dipakai.
// shortcut: mengandalkan satu proxy tepercaya di depan app; bila ada lebih dari satu hop
// (mis. Cloudflare -> nginx -> app), ambil entri ke-N dari belakang atau pakai header khusus platform.
export function getIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',').map((s) => s.trim()).filter(Boolean);
  return forwarded?.at(-1) ?? request.headers.get('x-real-ip')?.trim() ?? 'unknown';
}

export const RATE_LIMIT_RESPONSE =
  '😅 Gara sedang melayani banyak mahasiswa saat ini. Silakan coba beberapa saat lagi ya.';
