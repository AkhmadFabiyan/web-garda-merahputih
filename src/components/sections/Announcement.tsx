import React from 'react';
import { Container } from '../ui/Container';
import { FaBullhorn } from 'react-icons/fa';
import styles from './Announcement.module.css';

export const Announcement = () => {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.bar}>
          <div className={styles.prefixBlock}>
            <FaBullhorn color="#F4C542" size={20} />
            <span className={styles.prefixText}>PENGUMUMAN</span>
          </div>
          <div className={styles.badge}>BARU</div>
          <div className={styles.scrollWrapper}>
            <div className={styles.textTrack}>
              <span className={styles.textMain}>Presensi hari pertama dibuka pukul 06.00 WIB</span>
              <span className={styles.textDivider}>•</span>
              <span className={styles.textMain}>Besok (19/08) menggunakan pakaian PDH</span>
              <span className={styles.textDivider}>•</span>
              <span className={styles.textMain}>Tugas 1 dikumpulkan sebelum 23:59 WIB</span>
            </div>
          </div>
          <a href="/pengumuman" className={styles.linkSemua}>Lihat Semua →</a>
        </div>
      </Container>
    </section>
  );
};
