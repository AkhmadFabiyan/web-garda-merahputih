/**
 * Sorts items by a popularity order (most clicked first, from Redis).
 * Items missing from the order keep their original relative order at the end.
 */
export function sortByPopularity<T>(items: readonly T[], order: readonly string[], key: (item: T) => string): T[] {
  const rank = new Map(order.map((id, i) => [id, i]));
  return items
    .map((item, i) => ({ item, i, r: rank.get(key(item)) ?? Infinity }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.item);
}
