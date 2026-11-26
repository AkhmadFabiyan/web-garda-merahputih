import React from 'react';
import { Container } from '../ui/Container';
import styles from './UnesaNewsSkeleton.module.css';
import { SectionTitle } from '../ui/SectionTitle';
import baseStyles from './UnesaNews.module.css';

export const UnesaNewsSkeleton = () => {
  // Create an array of 6 skeleton cards
  const skeletonCards = Array(6).fill(null);

  return (
    <section className={baseStyles.section} id="berita-unesa-skeleton">
      <Container>
        <div className={baseStyles.masterBox}>
          <SectionTitle variant="section" title="Berita Terbaru Unesa" />

          <div className={baseStyles.grid}>
            {skeletonCards.map((_, index) => (
              <div key={index} className={`${baseStyles.card} ${styles.skeletonCard}`}>
                <div className={`${baseStyles.imageWrapper} ${styles.skeletonImage}`}></div>
                <div className={baseStyles.content}>
                  <div className={styles.skeletonTitle}></div>
                  <div className={styles.skeletonTitle} style={{ width: '80%' }}></div>
                  
                  <div className={styles.skeletonDescWrapper}>
                    <div className={styles.skeletonDesc}></div>
                    <div className={styles.skeletonDesc}></div>
                    <div className={styles.skeletonDesc} style={{ width: '60%' }}></div>
                  </div>
                  
                  <div className={styles.skeletonReadMore}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
