import fs from 'fs';
import path from 'path';

export function logQuestion(message: string, intent: string, usedGemini: boolean) {
  // Only log in Node.js server environment
  if (typeof process === 'undefined' || !process.cwd) return;

  try {
    // Save in project root as garda-questions.log
    const logPath = path.join(process.cwd(), 'garda-questions.log');
    
    // Local date format
    const date = new Date();
    const timestamp = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19);

    const geminiTag = usedGemini ? '[GEMINI]' : '[LOCAL]';
    const cleanMessage = message.replace(/\n/g, ' '); // Remove newlines for single-line logging
    
    const logEntry = `[${timestamp}] ${geminiTag} [Intent: ${intent}] -> ${cleanMessage}\n`;
    
    fs.appendFileSync(logPath, logEntry, 'utf8');
  } catch (error) {
    console.error('[Gara Logger] Gagal menulis ke file log:', error);
  }
}
