"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaUniversalAccess, FaAdjust, FaTextHeight, FaVolumeUp } from 'react-icons/fa';
import styles from './A11yWidget.module.css';

export const A11yWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [talkback, setTalkback] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Initialize from LocalStorage safely on mount
  useEffect(() => {
    try {
      const savedContrast = localStorage.getItem('a11y-high-contrast') === 'true';
      const savedLargeText = localStorage.getItem('a11y-text-large') === 'true';
      const savedTalkback = localStorage.getItem('a11y-talkback') === 'true';

      setTimeout(() => {
        setHighContrast(savedContrast);
        setLargeText(savedLargeText);
        setTalkback(savedTalkback);
      }, 0);

      if (savedContrast) document.documentElement.classList.add('a11y-high-contrast');
      if (savedLargeText) document.documentElement.classList.add('a11y-text-large');
    } catch {
      console.warn("localStorage not available for A11y settings");
    }
  }, []);

  const toggleHighContrast = () => {
    const newVal = !highContrast;
    setHighContrast(newVal);
    try {
      localStorage.setItem('a11y-high-contrast', newVal.toString());
    } catch {
      // Ignore
    }
    
    if (newVal) {
      document.documentElement.classList.add('a11y-high-contrast');
    } else {
      document.documentElement.classList.remove('a11y-high-contrast');
    }
  };

  const toggleLargeText = () => {
    const newVal = !largeText;
    setLargeText(newVal);
    try {
      localStorage.setItem('a11y-text-large', newVal.toString());
    } catch {
      // Ignore
    }
    
    if (newVal) {
      document.documentElement.classList.add('a11y-text-large');
    } else {
      document.documentElement.classList.remove('a11y-text-large');
    }
  };

  const toggleTalkback = () => {
    const newVal = !talkback;
    setTalkback(newVal);
    try {
      localStorage.setItem('a11y-talkback', newVal.toString());
    } catch {
      // Ignore
    }
    if (newVal) {
      // Ucapkan salam saat diaktifkan
      const utterance = new SpeechSynthesisUtterance("Mode bicara diaktifkan");
      utterance.lang = 'id-ID';
      window.speechSynthesis?.speak(utterance);
    } else {
      window.speechSynthesis?.cancel();
    }
  };

  const lastClickedRef = useRef<{ el: HTMLElement; time: number } | null>(null);

  // Talkback Engine
  useEffect(() => {
    if (!talkback) {
      window.speechSynthesis?.cancel();
      document.querySelectorAll('.a11y-speak-outline').forEach(el => el.classList.remove('a11y-speak-outline'));
      return;
    }

    const speak = (text: string, element: HTMLElement) => {
      window.speechSynthesis?.cancel(); // cancel previous
      
      // Visual indicator
      document.querySelectorAll('.a11y-speak-outline').forEach(el => el.classList.remove('a11y-speak-outline'));
      element.classList.add('a11y-speak-outline');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      
      utterance.onend = () => {
        element.classList.remove('a11y-speak-outline');
      };
      
      window.speechSynthesis?.speak(utterance);
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Abaikan klik pada widget aksesibilitas ini sendiri
      if (target.closest(`.${styles.container}`)) return;

      const now = Date.now();
      const last = lastClickedRef.current;

      // Double tap logic
      if (last && last.el === target && (now - last.time) < 500) {
        lastClickedRef.current = null;
        window.speechSynthesis?.cancel();
        return; 
      }

      e.preventDefault();
      e.stopPropagation();
      lastClickedRef.current = { el: target, time: now };

      let textToRead = '';
      
      let readingTarget = target.closest('button, a, [role="button"], img, p, h1, h2, h3, h4, h5, h6, li, span, label, article, [class*="card"], [class*="Card"], [class*="item"]') as HTMLElement;
      
      if (!readingTarget) {
        readingTarget = target;
      }
      
      if (readingTarget.tagName.toLowerCase() === 'img') {
        textToRead = readingTarget.getAttribute('alt') || 'Gambar tanpa deskripsi';
      } else {
        const tagName = readingTarget.tagName.toLowerCase();
        const id = readingTarget.id;
        
        if (tagName === 'section' || tagName === 'main') {
          if (id === 'jadwal') textToRead = "Bagian Jadwal: Menampilkan peta perjalanan PKKMB. Silakan ketuk kartu jadwal untuk detail.";
          else if (id === 'faq') textToRead = "Bagian FAQ: Daftar pertanyaan yang sering diajukan. Ketuk pertanyaan untuk melihat jawaban.";
          else if (id === 'tentang-garda') textToRead = "Bagian Tentang Garda UNESA.";
          else if (id === 'info-garda') textToRead = "Bagian Info Garda: Panduan dan atribut PKKMB.";
          else textToRead = "";
        } else {
          const text = readingTarget.innerText || readingTarget.textContent || '';
          const cleanText = text.replace(/\n+/g, '. ').replace(/\s\s+/g, ' ').trim();
          if (cleanText.length > 0) {
            textToRead = cleanText;
          }
        }
      }

      console.log('TALKBACK V2 TARGET:', readingTarget.tagName, readingTarget.className, textToRead);

      if (textToRead) {
        speak(textToRead, readingTarget);
      }
    };

    // Gunakan useCapture (true) agar event ditangkap sebelum React Synthetic Events memprosesnya
    document.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
      window.speechSynthesis?.cancel();
      document.querySelectorAll('.a11y-speak-outline').forEach(el => el.classList.remove('a11y-speak-outline'));
    };
  }, [talkback]);

  return (
    <div className={styles.container} ref={containerRef}>
      {isOpen && (
        <div className={styles.menu}>
          <div className={styles.menuHeader}>
            <h3>Aksesibilitas</h3>
            <button className={styles.closeMenu} onClick={() => setIsOpen(false)} aria-label="Tutup Menu">✕</button>
          </div>
          
          <button 
            className={`${styles.option} ${highContrast ? styles.optionActive : ''}`}
            onClick={toggleHighContrast}
            aria-pressed={highContrast}
          >
            <span>Kontras Tinggi</span>
            <FaAdjust className={styles.icon} />
          </button>

          <button 
            className={`${styles.option} ${largeText ? styles.optionActive : ''}`}
            onClick={toggleLargeText}
            aria-pressed={largeText}
          >
            <span>Perbesar Teks</span>
            <FaTextHeight className={styles.icon} />
          </button>

          <button 
            className={`${styles.option} ${talkback ? styles.optionActive : ''}`}
            onClick={toggleTalkback}
            aria-pressed={talkback}
          >
            <span>Mode Bicara</span>
            <FaVolumeUp className={styles.icon} />
          </button>
        </div>
      )}

      <button 
        className={styles.button} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Buka Menu Aksesibilitas"
        title="Menu Aksesibilitas"
      >
        <FaUniversalAccess />
      </button>
    </div>
  );
};
