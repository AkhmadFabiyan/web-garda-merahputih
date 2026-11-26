"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Accordion } from '../ui/Accordion';
import { faqData } from '../../data/faq';
import styles from './FAQSection.module.css';

export const FAQSection = ({ faqOrder = [] }: { faqOrder?: string[] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const sortedFaqData = [...faqData].sort((a, b) => {
    const indexA = faqOrder.indexOf(a.id);
    const indexB = faqOrder.indexOf(b.id);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const filteredFaq = sortedFaqData.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayData = searchTerm ? filteredFaq : sortedFaqData.slice(0, 4);

  const handleToggle = (id: string) => {
    fetch('/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'faq', id })
    }).catch(e => console.error('Error tracking click:', e));
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.sectionTitle} data-reveal>FAQ</h2>
      <h3 className={styles.sectionSubtitle}>Pertanyaan yang Sering Diajukan</h3>
      
      <div className={styles.searchWrap}>
        <input 
          type="text" 
          placeholder="Cari pertanyaan..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          maxLength={100}
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      <div className={styles.accordionWrap}>
        {displayData.length > 0 ? (
          <Accordion items={displayData} onToggle={handleToggle} />
        ) : (
          <p className={styles.noResult}>Pertanyaan tidak ditemukan.</p>
        )}
      </div>
      <div className={styles.actionWrap}>
        <Link href="/faq" className={styles.btn}>Lihat Semua FAQ</Link>
      </div>
    </div>
  );
};
