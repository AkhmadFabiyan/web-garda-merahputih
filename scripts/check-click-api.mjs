// Usage: npm run build, then
//   UPSTASH_REDIS_REST_URL=https://127.0.0.1:9 UPSTASH_REDIS_REST_TOKEN=fake npx next start -p 3123
//   node scripts/check-click-api.mjs
// The fake Redis host keeps test clicks out of the real Upstash data.
// Self-check for /api/click. Run against a server whose Redis points at a dead host:
// valid input passes validation and fails at Redis (500); invalid input never reaches Redis (400).
import assert from 'node:assert/strict';
const URL = process.argv[2] ?? 'http://localhost:3123/api/click';
const post = (body, ip = '10.0.0.1') => fetch(URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
  body: typeof body === 'string' ? body : JSON.stringify(body),
}).then(r => r.status);

const cases = [
  ['junk faq id',      { type: 'faq', id: 'spam-entry' }, 400],
  ['object id',        { type: 'faq', id: { $gt: '' } }, 400],
  ['unknown type',     { type: 'x', id: '1' }, 400],
  ['proto type',       { type: '__proto__', id: '1' }, 400],
  ['missing fields',   {}, 400],
  ['bad json',         '{not json', 400],
  ['valid faq',        { type: 'faq', id: '1' }, 500],
  ['valid contact',    { type: 'contact', id: 'FIP' }, 500],
];
for (const [name, body, want] of cases) {
  const got = await post(body);
  assert.equal(got, want, `${name}: expected ${want}, got ${got}`);
  console.log('ok', name, got);
}
// rate limit: 20/min per IP, fresh IP
const ip = '10.0.0.99';
const statuses = [];
for (let i = 0; i < 21; i++) statuses.push(await post({ type: 'faq', id: 'nope' }, ip));
assert.equal(statuses.filter(s => s === 429).length, 1, `rate limit: ${statuses}`);
console.log('ok rate limit -> 21st request 429');
console.log('ALL PASS');
