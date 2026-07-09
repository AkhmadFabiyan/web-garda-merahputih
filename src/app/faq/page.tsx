import React from 'react';
import { getFaqOrder } from '../../lib/redis';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/layout/PageHeader';
import { Container } from '../../components/ui/Container';
import { Accordion } from '../../components/ui/Accordion';
import { faqData } from '../../data/faq';
import styles from './page.module.css';

export const revalidate = 3600;

export default async function FAQPage() {
  const faqOrder = await getFaqOrder();
  const sortedFaqData = [...faqData].sort((a, b) => {
    const indexA = faqOrder.indexOf(a.id);
    const indexB = faqOrder.indexOf(b.id);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <>
      <Navbar />
      <main>
        <PageHeader 
          title="FAQ Lengkap" 
          subtitle="Kumpulan pertanyaan yang sering diajukan terkait PKKMB UNESA 2026." 
        />
        <Container>
          <div className={styles.contentWrap}>
            <Accordion items={sortedFaqData} />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
