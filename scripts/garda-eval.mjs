// Self-check chatbot Gara: jalankan pertanyaan di scripts/garda-eval.json ke logika lokal
// (sanitizeInput -> answerLocally: intent + knowledgeSearch), tanpa memanggil Gemini/OpenRouter.
// Pakai: node scripts/garda-eval.mjs [--verbose] [--min=<skor%>]
//   --min  gagal (exit 1) bila skor total di bawah angka ini; dipakai sebagai regression guard.
// TS dari src/ dimuat lewat `typescript` (devDependency yang sudah ada), jadi tanpa dependency baru.
import { registerHooks } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import ts from 'typescript';

const SRC = new URL('../src/', import.meta.url);

registerHooks({
  resolve(specifier, context, next) {
    const target = specifier.startsWith('@/') ? new URL(specifier.slice(2), SRC).href
      : specifier.startsWith('.') && context.parentURL?.endsWith('.ts') ? new URL(specifier, context.parentURL).href
      : null;
    if (target && !/\.[cm]?[jt]sx?$/.test(target)) {
      for (const ext of ['.ts', '.tsx', '/index.ts']) {
        if (existsSync(fileURLToPath(target + ext))) return { url: target + ext, shortCircuit: true };
      }
    }
    return next(target ?? specifier, context);
  },
  load(url, context, next) {
    if (!url.endsWith('.ts')) return next(url, context);
    const { outputText } = ts.transpileModule(readFileSync(fileURLToPath(url), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    });
    return { format: 'module', source: outputText, shortCircuit: true };
  },
});

const ai = (p) => import(pathToFileURL(fileURLToPath(new URL(`lib/ai/${p}.ts`, SRC))).href);
const { sanitizeInput } = await ai('security');
const { detectIntent } = await ai('intentDetector');
const { preprocessInput } = await ai('preprocess');
const { answerLocally } = await ai('localAnswer');

const verbose = process.argv.includes('--verbose');
const min = Number(process.argv.find((a) => a.startsWith('--min='))?.slice(6) ?? 0);
const cases = JSON.parse(readFileSync(new URL('./garda-eval.json', import.meta.url), 'utf8'));
assert.ok(cases.length >= 50, 'set eval minimal 50 pertanyaan');

let intentOk = 0, answerOk = 0;
const failures = [];
for (const c of cases) {
  const history = c.history ?? [];
  const blocked = !sanitizeInput(c.q).safe;
  const intent = blocked ? 'SECURITY_THREAT' : detectIntent(preprocessInput(c.q), history).intent;
  const local = blocked ? null : answerLocally(c.q, c.faculty, history);
  const text = blocked ? '' : local.kind === 'answer' ? local.response.answer.toLowerCase() : '';

  const iPass = intent === c.intent;
  const aPass = c.intent === 'SECURITY_THREAT' ? blocked
    : c.ai ? local?.kind === 'needs_ai'
    : local?.kind === 'answer' && (!c.expect || c.expect.some((k) => text.includes(k.toLowerCase())));

  intentOk += iPass;
  answerOk += aPass;
  if (!iPass || !aPass) {
    failures.push(`${iPass ? '  ' : 'I!'} ${aPass ? '  ' : 'A!'} "${c.q}" -> ${intent} (mau ${c.intent})` +
      (aPass ? '' : ` | ${local?.kind ?? 'blocked'}: ${text.slice(0, 90).replace(/\n/g, ' ')}`));
  }
}

const pct = (n) => ((n / cases.length) * 100).toFixed(1);
const total = ((intentOk + answerOk) / (2 * cases.length)) * 100;
if (verbose) console.log(failures.join('\n') || '(tidak ada yang gagal)');
console.log(`Intent : ${intentOk}/${cases.length} (${pct(intentOk)}%)`);
console.log(`Jawaban: ${answerOk}/${cases.length} (${pct(answerOk)}%)`);
console.log(`Skor   : ${total.toFixed(1)}%`);
assert.ok(total >= min, `skor ${total.toFixed(1)}% di bawah batas --min=${min}`);
