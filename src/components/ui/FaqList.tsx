'use client';
import React, { useState } from 'react';
import { Accordion } from './Accordion';
import { trackClick } from '../../lib/services/analytics';
import type { FaqItem } from '../../types';
import styles from './FaqList.module.css';

interface FaqListProps {
  /** Already sorted (most popular first). */
  items: FaqItem[];
  /** Show only the first N when not searching (home page). */
  limit?: number;
}

/** Searchable FAQ accordion that counts opens. Used on the home page and on /faq. */
export const FaqList: React.FC<FaqListProps> = ({ items, limit }) => {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const shown = q
    ? items.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
    : items.slice(0, limit ?? items.length);

  return (
    <>
      <div className={styles.searchWrap}>
        <input
          type="search"
          aria-label="Cari pertanyaan FAQ"
          placeholder="Cari pertanyaan..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          maxLength={100}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      {shown.length > 0 ? (
        <Accordion items={shown} onToggle={(id) => trackClick('faq', id)} />
      ) : (
        <p className={styles.noResult} role="status">Pertanyaan tidak ditemukan.</p>
      )}
    </>
  );
};
