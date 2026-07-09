'use client';

import React from 'react';
import styles from './GardaSuggestions.module.css';

const SUGGESTIONS = [
  'Kapan presensi dibuka?',
  'Hari ini saya harus ngapain?',
  'Siapa CP FT?',
  'Di mana link twibbon?',
  'Apa dresscode hari pertama?',
];

interface GardaSuggestionsProps {
  onSelect: (question: string) => void;
}

export const GardaSuggestions: React.FC<GardaSuggestionsProps> = ({ onSelect }) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.label}>Pertanyaan populer:</div>
      <div className={styles.chips} role="list">
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            className={styles.chip}
            onClick={() => onSelect(q)}
            role="listitem"
            aria-label={`Tanya: ${q}`}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
