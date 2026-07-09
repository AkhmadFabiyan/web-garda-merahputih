'use client';

import React, { useEffect, useState } from 'react';
import styles from './GardaTyping.module.css';

interface GardaTypingProps {
  elapsedSeconds: number;
}

const TYPING_MESSAGES = [
  "🔎 Oke, Garda cari dulu ya...",
  "📚 Garda lagi buka panduannya...",
  "✍️ Sip, bentar ya...",
  "🔍 Sebentar, Garda pastikan dulu infonya..."
];

export const GardaTyping: React.FC<GardaTypingProps> = () => {
  const [msg, setMsg] = useState("🔎 Garda cari dulu ya informasinya...");

  useEffect(() => {
    const t = setTimeout(() => {
      setMsg(TYPING_MESSAGES[Math.floor(Math.random() * TYPING_MESSAGES.length)]);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={styles.wrap} aria-live="polite" aria-label="Garda sedang mengetik">
      <div className={styles.avatar} aria-hidden="true">🤖</div>
      <div className={styles.bubble}>
        <div className={styles.dots} aria-hidden="true">
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <div className={styles.status}>
          {msg}
        </div>
      </div>
    </div>
  );
};
