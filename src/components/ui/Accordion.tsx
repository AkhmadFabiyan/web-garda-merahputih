"use client";
import React, { useState } from 'react';
import styles from './Accordion.module.css';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  onToggle?: (id: string) => void;
}

export const Accordion: React.FC<AccordionProps> = ({ items, onToggle }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    const isOpening = openId !== id;
    setOpenId(isOpening ? id : null);
    if (isOpening && onToggle) {
      onToggle(id);
    }
  };

  return (
    <div className={styles.accordion}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className={`${styles.item} ${isOpen ? styles.open : ''}`} data-reveal>
            <button 
              id={`accordion-btn-${item.id}`}
              className={styles.header} 
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <span className={styles.question}>{item.question}</span>
              <span className={styles.icon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <div 
              id={`accordion-content-${item.id}`}
              className={`${styles.content} ${isOpen ? styles.contentOpen : ''}`}
              role="region"
              aria-labelledby={`accordion-btn-${item.id}`}
            >
              <div className={styles.answer}>
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
