import React from 'react';
import { getFaqOrder } from '../../lib/redis';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/layout/PageHeader';
import { Container } from '../../components/ui/Container';
import { FaqList } from '../../components/ui/FaqList';
import { faqData } from '../../data/faq';
import { sortByPopularity } from '../../lib/popularity';
import styles from './page.module.css';

export const revalidate = 3600;

export default async function FAQPage() {
  const faqOrder = await getFaqOrder();
  const sortedFaqData = sortByPopularity(faqData, faqOrder, (f) => f.id);

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
            <FaqList items={sortedFaqData} />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
