import React from 'react';
import { Container } from '../ui/Container';
import { FAQSection } from './FAQSection';
import { ContactSection } from './ContactSection';
import { SocialGallery } from './SocialGallery';
import styles from './PreFooter.module.css';

interface PreFooterProps {
  faqOrder?: string[];
  contactOrder?: string[];
}

export const PreFooter = ({ faqOrder = [], contactOrder = [] }: PreFooterProps) => {
  return (
    <section className={styles.section} id="pre-footer">
      <Container>
        <div className={styles.hubWrapper}>
          <div className={styles.grid3Col}>
            <div className={styles.col} id="faq"><FAQSection faqOrder={faqOrder} /></div>
            <div className={styles.col} id="kontak"><ContactSection contactOrder={contactOrder} /></div>
            <div className={styles.col}><SocialGallery /></div>
          </div>
        </div>
      </Container>
    </section>
  );
};
