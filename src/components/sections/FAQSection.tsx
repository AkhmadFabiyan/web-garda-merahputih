"use client";
import React from 'react';
import Link from 'next/link';
import { FaqList } from '../ui/FaqList';
import { faqData } from '../../data/faq';
import { sortByPopularity } from '../../lib/popularity';
import styles from './FAQSection.module.css';

export const FAQSection = ({ faqOrder = [] }: { faqOrder?: string[] }) => {
  const sorted = sortByPopularity(faqData, faqOrder, (f) => f.id);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.sectionTitle} data-reveal>FAQ</h2>
      <h3 className={styles.sectionSubtitle}>Pertanyaan yang Sering Diajukan</h3>
      
      <div className={styles.accordionWrap}>
        <FaqList items={sorted} limit={4} />
      </div>
      <div className={styles.actionWrap}>
        <Link href="/faq" className={styles.btn}>Lihat Semua FAQ</Link>
      </div>
    </div>
  );
};
