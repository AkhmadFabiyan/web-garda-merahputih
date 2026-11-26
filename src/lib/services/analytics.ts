/**
 * Analytics Service (Client-Side)
 * Tracks most asked questions, contacts, topics via localStorage.
 * Dashboard-ready: data persists across sessions.
 */

interface AnalyticsEvent {
  type: 'question' | 'contact_lookup' | 'topic_view';
  value: string;
  timestamp: number;
}



const STORAGE_KEY = 'garda_analytics';
const MAX_EVENTS = 500;

function loadEvents(): AnalyticsEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEvents(events: AnalyticsEvent[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Keep only recent events
    const trimmed = events.slice(-MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Ignore storage errors
  }
}

export function trackQuestion(question: string): void {
  const events = loadEvents();
  events.push({ type: 'question', value: question.slice(0, 200), timestamp: Date.now() });
  saveEvents(events);
}

export function trackContactLookup(faculty: string): void {
  const events = loadEvents();
  events.push({ type: 'contact_lookup', value: faculty, timestamp: Date.now() });
  saveEvents(events);
}

export function trackTopicView(topic: string): void {
  const events = loadEvents();
  events.push({ type: 'topic_view', value: topic, timestamp: Date.now() });
  saveEvents(events);
}


/** Counts a FAQ open or contact click on the server, which drives the "most popular first" order. */
export function trackClick(type: 'faq' | 'contact', id: string): void {
  fetch('/api/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, id }),
  }).catch((e) => console.error(`Error tracking ${type} click:`, e));
}
