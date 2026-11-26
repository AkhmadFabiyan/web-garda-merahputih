// Checks that GEMINI_API_KEY in .env.local works, without printing the key.
// Usage: node scripts/check-ai-keys.mjs .env.local
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync(process.argv[2], 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')])
);
const key = env.GEMINI_API_KEY;
if (!key) { console.log('GEMINI_API_KEY: kosong / tidak ada'); process.exit(0); }
console.log(`GEMINI_API_KEY: ada (panjang ${key.length}, awalan ${key.slice(0, 4)}…)`);

for (const model of ['gemini-flash-latest', 'gemini-flash-lite-latest']) {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages: [{ role: 'user', content: 'Jawab satu kata: halo' }], max_tokens: 10 }),
  });
  const body = await res.text();
  let detail = '';
  try {
    const j = JSON.parse(body);
    detail = j.choices?.[0]?.message?.content ?? JSON.stringify(j.error ?? j[0]?.error ?? j).slice(0, 220);
  } catch { detail = body.slice(0, 220); }
  console.log(`${model}: HTTP ${res.status} -> ${String(detail).replace(key, '***')}`);
}
