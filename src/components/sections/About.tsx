import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { SectionTitle } from '../ui/SectionTitle';
import styles from './About.module.css';

export const About = () => {

  const paragraphs = [
    "Garda Unesa merupakan acara Pengenalan Kehidupan Kampus Mahasiswa Baru Universitas Negeri Surabaya. Garda Unesa 2026 mengusung tema \"Jayantara Nuswantara\".",
    "UNESA berkomitmen mencetak generasi pelopor yang siap berkontribusi dalam pembangunan nasional melalui jalur pendidikan."
  ];

  const totalLength = paragraphs.join(" ").length;
  // Automatic content-length detection
  const hasHiddenContent = totalLength > 400;

  return (
    <section className={styles.section} id="tentang-garda">
      <Container>
        <div className={styles.grid3Col}>
          {/* Col 1: Text */}
          <div className={styles.textContent}>
            <SectionTitle title="Apa Itu Garda UNESA?" subtitle="TENTANG GARDA" />
            {paragraphs.map((text, idx) => (
              <p key={idx} className={styles.description}>{text}</p>
            ))}
            {hasHiddenContent && (
              <Link href="/#info-garda" className={styles.btn}>Selengkapnya →</Link>
            )}
          </div>
          
          {/* Col 2: Video */}
          <div className={styles.videoContent}>
            <div className={styles.videoCard}>
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube-nocookie.com/embed/LjJCJ4vQTcI" 
                title="YouTube video player" 
                frameBorder="0" 
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '16px' }}
              ></iframe>
            </div>
          </div>

          {/* Col 3: Quote */}
          <div className={styles.quoteContent}>
            <div className={styles.quoteCard}>
              <div className={styles.fireWatermark} />
              <span className={styles.quoteMarkLeft}>“</span>
              <p className={styles.quoteText}>
                Membentuk generasi berkarakter, berdaya saing, dan siap menjadi pelopor kemajuan bangsa melalui pendidikan.
              </p>
              <p className={styles.quoteAuthor}>- Garda UNESA 2026 -</p>
              <span className={styles.quoteMarkRight}>”</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
