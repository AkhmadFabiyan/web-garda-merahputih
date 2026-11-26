import React from 'react';
import { Container } from '../ui/Container';
import styles from './FooterCTA.module.css';
import { Button } from '../ui/Button';

export const FooterCTA = () => {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.card} data-reveal>
          <div className={styles.flagBackgroundWrap}>
            <div className={styles.flagBackground} />
          </div>
          <div className={styles.glow} />
          <h2 className={styles.title}>Siap Menjadi Garda UNESA 2026?</h2>
          <p className={styles.description}>
            Akses seluruh informasi PKKMB, jadwal kegiatan, panduan peserta, dan informasi penting dalam satu tempat.
          </p>
          <div className={styles.actionWrap}>
            <Button href="/jadwal" className={styles.ctaBtn}>
              Lihat Jadwal
            </Button>
            <Button href="/#info-garda" variant="secondary" className={styles.ctaBtn}>
              Info Garda
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
