'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GardaMessage, Message, WaContact } from './GardaMessage';
import { GardaTyping } from './GardaTyping';
import { GardaSuggestions } from './GardaSuggestions';
import { GardaFacultyPicker, getSavedFaculty } from './GardaFacultyPicker';
import { trackQuestion, trackContactLookup, trackTopicView } from '../../../lib/services/analytics';

import { generateProactiveGreeting } from '../../../lib/ai/gardaProactive';

function getWelcomeMessage(): Message {
  return {
    id: 'welcome',
    role: 'bot',
    text: generateProactiveGreeting(),
    timestamp: new Date(),
    isWelcome: true,
  };
}


interface GardaChatProps {
  bodyClassName: string;
  footerClassName: string;
  inputClassName: string;
  sendBtnClassName: string;
  disclaimerClassName: string;
  inputRowClassName: string;
}

export const GardaChat: React.FC<GardaChatProps> = ({
  bodyClassName,
  footerClassName,
  inputClassName,
  sendBtnClassName,
  disclaimerClassName,
  inputRowClassName,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingElapsed, setTypingElapsed] = useState(0);
  const [faculty, setFaculty] = useState<string | null>(null);
  const [showFacultyPicker, setShowFacultyPicker] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingStartRef = useRef<number>(0);

  // Load saved faculty on mount
  useEffect(() => {
    const t = setTimeout(() => {
      setMessages([getWelcomeMessage()]);
      const saved = getSavedFaculty();
      if (saved) {
        setFaculty(saved);
        setInitialized(true);
      } else {
        // Check if user has dismissed picker before
        const dismissed = localStorage.getItem('garda_faculty_dismissed');
        if (dismissed) {
          setInitialized(true);
        } else {
          setShowFacultyPicker(true);
          setInitialized(true);
        }
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Typing elapsed timer
  const startTypingTimer = useCallback(() => {
    typingStartRef.current = Date.now();
    setTypingElapsed(0);
    typingTimerRef.current = setInterval(() => {
      setTypingElapsed(Math.floor((Date.now() - typingStartRef.current) / 1000));
    }, 500);
  }, []);

  const stopTypingTimer = useCallback(() => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTypingTimer();
  }, [stopTypingTimer]);

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  // Smooth reset mechanism when reaching 20 messages
  useEffect(() => {
    if (messages.length >= 20 && !isTyping && !isResetting) {
      const resetSeq = async () => {
        setIsResetting(true);
        // Wait a moment after the last message was typed
        await new Promise((r) => setTimeout(r, 1500));
        addMessage({
          id: `bot-reset-${Date.now()}`,
          role: 'bot',
          text: 'Wah, seru banget obrolan kita! Tapi supaya memori Gara tetap segar dan ringan, Gara rapikan dulu riwayat pesannya ya... 🧹✨',
          timestamp: new Date(),
        });
        // Let user read the reset message
        await new Promise((r) => setTimeout(r, 4000));
        
        setMessages([getWelcomeMessage()]);
        setIsResetting(false);
      };
      // Defer execution to avoid synchronous cascading renders
      setTimeout(resetSeq, 0);
    }
  }, [messages.length, isTyping, isResetting, addMessage]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    };
    addMessage(userMsg);
    setInput('');

    // Track analytics
    trackQuestion(trimmed);

    // Build conversation history for Gemini.
    // We capture the current messages snapshot + the new user message
    // before the state update so the history is always complete and ordered.
    const historySnapshot = [...messages, userMsg]
      .filter((m) => !m.isWelcome)
      .slice(-8) // last 8 turns (4 pairs)
      .map((m) => ({
        role: m.role === 'bot' ? ('model' as const) : ('user' as const),
        text: m.text,
      }));
    // Remove the last entry (the current user message itself — the API receives
    // it separately as `message`, so we only pass prior turns as history)
    // PERFORMANCE: Only send the last 6 messages (3 pairs) to save bandwidth
    const history = historySnapshot.slice(0, -1).slice(-6);

    // Show typing effect immediately
    const startTime = Date.now();
    setIsTyping(true);
    startTypingTimer();

    try {
      const response = await fetch('/api/garda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          faculty: faculty ?? undefined,
          history,
        }),
      });

      let data: any;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid JSON response');
      }

      if (!response.ok || !data || !data.answer) {
        throw new Error(data?.message || data?.error || 'API Request failed');
      }

      // Track intent analytics
      if (data.intent === 'CONTACT' && faculty) {
        trackContactLookup(faculty);
      }
      if (data.intent && data.intent !== 'ERROR') {
        trackTopicView(data.intent);
      }

      // Add a natural minimum delay for "thinking"
      const elapsed = Date.now() - startTime;
      const minDelay = 1500;
      if (elapsed < minDelay) {
        await new Promise((r) => setTimeout(r, minDelay - elapsed));
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: data.answer,
        timestamp: new Date(),
        contacts: data.contacts,
        suggestions: data.suggestions,
      };

      stopTypingTimer();
      setIsTyping(false);
      addMessage(botMsg);
    } catch {
      stopTypingTimer();
      setIsTyping(false);
      addMessage({
        id: `bot-err-${Date.now()}`,
        role: 'bot',
        text: '😅 Gara sedang tidak tersedia. Silakan coba lagi beberapa saat.',
        timestamp: new Date(),
      });
    }
  }, [messages, isTyping, faculty, addMessage, startTypingTimer, stopTypingTimer]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSuggestionSelect = (question: string) => {
    sendMessage(question);
  };

  const handleFacultySelect = (selectedFaculty: string) => {
    setFaculty(selectedFaculty);
    setShowFacultyPicker(false);
    addMessage({
      id: `bot-faculty-${Date.now()}`,
      role: 'bot',
      text: `Siap! Aku sudah menyimpan fakultasmu: **${selectedFaculty}** 🎓\n\nSekarang aku bisa memberikan informasi kontak person yang lebih spesifik untukmu. Ada yang ingin kamu tanyakan?`,
      timestamp: new Date(),
    });
    inputRef.current?.focus();
  };

  const handleFacultySkip = () => {
    try { localStorage.setItem('garda_faculty_dismissed', '1'); } catch {}
    setShowFacultyPicker(false);
    inputRef.current?.focus();
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  const showSuggestions = messages.length === 1 && !isTyping && !isResetting;

  return (
    <>
      {/* Body */}
      <div ref={bodyRef} className={bodyClassName} role="log" aria-live="polite" aria-label="Percakapan dengan Gara">
        {messages.map((msg) => (
          <GardaMessage key={msg.id} message={msg} onSuggestionSelect={handleSuggestionSelect} />
        ))}
        {showSuggestions && (
          <GardaSuggestions onSelect={handleSuggestionSelect} />
        )}
        {isTyping && <GardaTyping elapsedSeconds={typingElapsed} />}

        {/* Faculty picker overlay */}
        {showFacultyPicker && initialized && (
          <GardaFacultyPicker
            onSelect={handleFacultySelect}
            onSkip={handleFacultySkip}
          />
        )}
      </div>

      {/* Footer */}
      <div className={footerClassName}>
        {faculty && (
          <div style={{ 
            fontSize: '11px', 
            color: '#1F2937', 
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>🎓</span>
            <span>{faculty}</span>
            <button
              onClick={() => setShowFacultyPicker(true)}
              style={{ 
                background: 'none', border: 'none', color: 'var(--color-brand-primary)',
                fontSize: '11px', cursor: 'pointer', padding: '0 4px',
                transform: 'none'
              }}
            >
              (ubah)
            </button>
          </div>
        )}
        
        {/* AI Quick Actions (Feature 3) */}
        <div style={{ display: 'flex', overflowX: 'auto', gap: '6px', paddingBottom: '10px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
           {['Presensi', 'Jadwal', 'FAQ', 'Hari Ini', 'Contact Person', 'Pengumuman', 'Panduan'].map(act => (
             <button 
               key={act} 
               onClick={() => !isTyping && !isResetting && sendMessage(act)} 
               disabled={isTyping || isResetting}
               style={{ 
                 whiteSpace: 'nowrap', padding: '6px 12px', background: '#FFFFFF', 
                 border: '1px solid var(--color-brand-primary)', borderRadius: '20px', 
                 color: 'var(--color-brand-primary)', fontSize: '11px', cursor: (isTyping || isResetting) ? 'not-allowed' : 'pointer',
                 flexShrink: 0
               }}>
               ⚡ {act}
             </button>
           ))}
        </div>

        <div className={inputRowClassName}>
          <textarea
            ref={inputRef}
            id="garda-input"
            className={inputClassName}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Tanya sesuatu tentang PKKMB..."
            rows={1}
            disabled={isTyping || isResetting}
            aria-label="Tulis pertanyaanmu"
            maxLength={500}
          />
          <button
            id="garda-send-btn"
            className={sendBtnClassName}
            onClick={() => sendMessage(input)}
            disabled={isTyping || isResetting || !input.trim()}
            aria-label="Kirim pesan"
          >
            ➤
          </button>
        </div>
        <p className={disclaimerClassName}>
          Gara dapat membuat kesalahan. Untuk info penting, hubungi panitia.
        </p>
      </div>
    </>
  );
};
