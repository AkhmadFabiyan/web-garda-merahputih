interface CacheEntry {
  answer: string;
  expires: number;
}

const MAX_CACHE_SIZE = 500;
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

const responseCache = new Map<string, CacheEntry>();

// Normalize cache key
function normalizeKey(message: string): string {
  return message
    .toLowerCase()
    .trim()
    .replace(/[?!.,;:'"()\[\]{}]/g, '')
    .replace(/\s+/g, ' ');
}

export function getCacheKey(message: string, intent: string, faculty?: string): string {
  return `${intent}:${faculty || ''}:${normalizeKey(message)}`;
}

export function getCachedResponse(key: string): string | null {
  const entry = responseCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expires) {
    responseCache.delete(key);
    return null;
  }

  // LRU: move to end
  responseCache.delete(key);
  responseCache.set(key, entry);

  return entry.answer;
}

export function setCachedResponse(key: string, answer: string): void {
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const firstKey = responseCache.keys().next().value;
    if (firstKey) responseCache.delete(firstKey);
  }

  responseCache.set(key, {
    answer,
    expires: Date.now() + CACHE_TTL,
  });
}
