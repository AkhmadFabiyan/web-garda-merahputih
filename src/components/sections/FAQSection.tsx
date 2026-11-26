"use client";
import React from 'react';
import { FaqList } from '../ui/FaqList';
import { faqData } from '../../data/faq';
import { sortByPopularity } from '../../lib/popularity';
import styles from './FAQSection.module.css';
import { Button } from '../ui/Button';
import { SectionTitle } from '../ui/SectionTitle';

export const FAQSection = ({ faqOrder = [] }: { faqOrder?: string[] }) => {
  const sorted = sortByPopularity(faqData, faqOrder, (f) => f.id);

  return (
    <div className={styles.wrapper}>
      <SectionTitle variant="label" title="FAQ" description="Pertanyaan yang Sering Diajukan" />
      
      <div className={styles.accordionWrap}>
        <FaqList items={sorted} limit={4} />
      </div>
      <div className={styles.actionWrap}>
        <Button href="/faq" variant="outline" className={styles.moreBtn}>Lihat Semua FAQ</Button>
      </div>
    </div>
  );
};
