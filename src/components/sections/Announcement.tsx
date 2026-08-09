import React from 'react';
import { Container } from '../ui/Container';
import { FaBullhorn } from 'react-icons/fa';
import styles from './Announcement.module.css';
import { announcements } from '../../data/announcements';

export const Announcement = () => {
  const activeAnnouncements = announcements.filter(a => a.isActive);

  if (activeAnnouncements.length === 0) return null;

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
              {activeAnnouncements.map((ann, idx) => (
                <React.Fragment key={ann.id}>
                  <span className={styles.textMain}>{ann.content}</span>
                  {idx < activeAnnouncements.length - 1 && (
                    <span className={styles.textDivider}>•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <a href="/pengumuman" className={styles.linkSemua}>Lihat Semua →</a>
        </div>
      </Container>
    </section>
  );
};
