import fs from 'fs';
import path from 'path';

// Set to true after the first write failure (e.g. read-only filesystem on serverless),
// so the error is reported once instead of on every request.
let disabled = false;

export function logQuestion(message: string, intent: string, usedGemini: boolean) {
  // Only log in Node.js server environment
  if (disabled || typeof process === 'undefined' || !process.cwd) return;

  // Save in project root as garda-questions.log
  const logPath = path.join(process.cwd(), 'garda-questions.log');

  // Local date format
  const date = new Date();
  const timestamp = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    .toISOString()
    .replace('T', ' ')
    .slice(0, 19);

  const geminiTag = usedGemini ? '[GEMINI]' : '[LOCAL]';
  // Single line, no control chars (log injection), bounded length
  const cleanMessage = message.replace(/[\u0000-\u001f\u007f]+/g, ' ').slice(0, 500);

  const logEntry = `[${timestamp}] ${geminiTag} [Intent: ${intent}] -> ${cleanMessage}\n`;

  // Async so the request is not blocked on disk I/O
  fs.promises.appendFile(logPath, logEntry, 'utf8').catch((error) => {
    disabled = true;
    console.error('[Gara Logger] Gagal menulis ke file log, logging dimatikan:', error);
  });
}
