import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import styles from './FooterCTA.module.css';

export const FooterCTA = () => {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.card}>
          <div className={styles.flagBackgroundWrap}>
            <div className={styles.flagBackground} />
          </div>
          <div className={styles.glow} />
          <h2 className={styles.title}>Siap Menjadi Garda UNESA 2026?</h2>
          <p className={styles.description}>
            Akses seluruh informasi PKKMB, jadwal kegiatan, panduan peserta, dan informasi penting dalam satu tempat.
          </p>
          <div className={styles.actionWrap}>
            <Link href="/jadwal" className={styles.primaryBtn}>
              Lihat Jadwal
            </Link>
            <Link href="/#info-garda" className={styles.secondaryBtn}>
              Info Garda
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
