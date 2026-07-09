/**
 * Knowledge Search
 * Ranked local search across FAQ, contacts, schedule, announcements.
 * Returns relevant text chunks — never full datasets.
 */

import { faqData } from '../../data/faq';
import { contacts } from '../../data/contacts';
import { timelineData } from '../../data/schedule';
import { announcements } from '../../data/announcements';
import type { Intent } from './intentDetector';

export interface KnowledgeChunk {
  source: string;
  content: string;
  score: number;
}

export interface SearchResult {
  chunks: KnowledgeChunk[];
  hasLocalAnswer: boolean;
  localAnswer?: string;
}

const STOP_WORDS = new Set([
  'kamu', 'aku', 'saya', 'dia', 'mereka', 'kami', 'kita',
  'yang', 'di', 'ke', 'dari', 'dan', 'atau', 'untuk', 
  'dengan', 'ini', 'itu', 'adalah', 'apakah', 'siapa'
]);

// --- FAQ Search ---
function searchFaq(query: string): KnowledgeChunk[] {
  const queryLower = query.toLowerCase();
  const results: KnowledgeChunk[] = [];

  for (const item of faqData) {
    const questionLower = item.question.toLowerCase();
    const answerLower = item.answer.toLowerCase();
    // Min length 2 to catch Indonesian short words (CP, FT, etc.)
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 1 && !STOP_WORDS.has(w));

    let score = 0;
    for (const word of queryWords) {
      if (questionLower.includes(word)) score += 3;
      if (answerLower.includes(word)) score += 1;
    }
    // Bonus: full query phrase found in question
    if (questionLower.includes(queryLower)) score += 5;

    if (score > 0) {
      results.push({
        source: 'FAQ',
        content: `Q: ${item.question}\nA: ${item.answer}`,
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 3);
}

// --- Contact Search ---
function searchContacts(query: string, faculty?: string): KnowledgeChunk[] {
  if (faculty) {
    const contact = contacts.find(
      (c) => c.faculty.toUpperCase() === faculty.toUpperCase()
    );
    if (contact) {
      return [
        {
          source: 'CONTACT',
          content: `Kontak Person ${contact.faculty}:\n- ${contact.cp1.name} (${contact.cp1.phone})\n- ${contact.cp2.name} (${contact.cp2.phone})`,
          score: 10,
        },
      ];
    }
  }

  // Search by faculty name in query
  const queryUpper = query.toUpperCase();
  const results: KnowledgeChunk[] = [];
  for (const contact of contacts) {
    if (queryUpper.includes(contact.faculty)) {
      results.push({
        source: 'CONTACT',
        content: `Kontak Person ${contact.faculty}:\n- ${contact.cp1.name} (${contact.cp1.phone})\n- ${contact.cp2.name} (${contact.cp2.phone})`,
        score: 10,
      });
    }
  }
  return results.slice(0, 2);
}

// --- Schedule Search ---
function searchSchedule(query: string): KnowledgeChunk[] {
  const queryLower = query.toLowerCase();
  const results: KnowledgeChunk[] = [];

  for (const event of timelineData) {
    const titleLower = event.title.toLowerCase();
    const activitiesText = event.details?.activities?.join(' ').toLowerCase() || '';
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w));

    let score = 0;
    for (const word of queryWords) {
      if (titleLower.includes(word)) score += 3;
      if (activitiesText.includes(word)) score += 1;
    }
    if (score > 0) {
      results.push({
        source: 'JADWAL',
        content: `${event.title} (${event.date}):\n${event.details?.activities?.map((a) => `• ${a}`).join('\n') || ''}`,
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 2);
}

// --- Announcement Search ---
function searchAnnouncements(query: string): KnowledgeChunk[] {
  const queryLower = query.toLowerCase();
  const active = announcements.filter((a) => a.isActive);
  const results: KnowledgeChunk[] = [];

  for (const ann of active) {
    const titleLower = ann.title.toLowerCase();
    const contentLower = ann.content.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w));

    let score = 0;
    for (const word of queryWords) {
      if (titleLower.includes(word)) score += 3;
      if (contentLower.includes(word)) score += 1;
    }
    if (score > 0) {
      results.push({
        source: 'PENGUMUMAN',
        content: `[${ann.date}] ${ann.title}:\n${ann.content}`,
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 2);
}

// --- Main Search ---
export function searchKnowledge(
  query: string,
  intent: Intent,
  faculty?: string
): SearchResult {
  let chunks: KnowledgeChunk[] = [];

  switch (intent) {
    case 'CONTACT':
      chunks = searchContacts(query, faculty);
      if (chunks.length > 0) {
        return { chunks, hasLocalAnswer: true, localAnswer: formatContact(chunks, faculty) };
      }
      break;

    case 'TODAY':
    case 'SCHEDULE':
      chunks = searchSchedule(query);
      if (chunks.length > 0) {
        return { chunks, hasLocalAnswer: true };
      }
      break;

    case 'ANNOUNCEMENT':
      chunks = searchAnnouncements(query);
      if (chunks.length > 0) {
        return { chunks, hasLocalAnswer: true };
      }
      break;

    case 'PRESENSI':
    case 'TWIBBON':
    case 'DRESSCODE':
    case 'PENUGASAN':
    case 'PERIZINAN':
    case 'FAQ': {
      const faqChunks = searchFaq(query);
      const annChunks = searchAnnouncements(query);
      chunks = [...faqChunks, ...annChunks].sort((a, b) => b.score - a.score).slice(0, 3);
      if (chunks.length > 0) {
        return { chunks, hasLocalAnswer: true };
      }
      break;
    }

    default: {
      // Combined search without contacts (contacts are fallback only)
      const allChunks = [
        ...searchFaq(query),
        ...searchSchedule(query),
        ...searchAnnouncements(query),
      ].sort((a, b) => b.score - a.score);
      chunks = allChunks.slice(0, 4);
      break;
    }
  }

  return { chunks, hasLocalAnswer: false };
}

function formatContact(chunks: KnowledgeChunk[], faculty?: string): string {
  if (chunks.length === 0) {
    return 'Maaf, kontak untuk fakultas tersebut belum tersedia. Silakan hubungi panitia pusat.';
  }
  const info = chunks[0].content;
  const prefix = faculty
    ? `Berikut Kontak Person untuk Fakultas ${faculty} 📱\n\n`
    : `Berikut Kontak Person yang tersedia 📱\n\n`;
  return `${prefix}${info}`;
}

export function buildContext(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) return 'Tidak ada konteks tersedia.';
  return chunks
    .map((c) => `[${c.source}]\n${c.content}`)
    .join('\n\n---\n\n');
}
