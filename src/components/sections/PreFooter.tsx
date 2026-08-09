import React from 'react';
import { Container } from '../ui/Container';
import { FAQSection } from './FAQSection';
import { ContactSection } from './ContactSection';
import { SocialGallery } from './SocialGallery';
import { getFaqOrder, getContactOrder } from '../../lib/redis';
import styles from './PreFooter.module.css';

export const PreFooter = async () => {
  let faqOrder: string[] = [];
  let contactOrder: string[] = [];

  try {
    faqOrder = await getFaqOrder();
    contactOrder = await getContactOrder();
  } catch (e) {
    console.error('Failed to fetch Redis order in PreFooter:', e);
  }

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
