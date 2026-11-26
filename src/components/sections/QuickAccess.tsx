import React from 'react';
import { Container } from '../ui/Container';
import { quickAccessData } from '../../data/quickAccess';
import styles from './QuickAccess.module.css';

export const QuickAccess = () => {
  return (
    <section className={styles.section} id="quick-access">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-brand-primary)" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
        </defs>
      </svg>
      <Container>
        <div className={styles.masterBox}>
          <h2 className={styles.title} data-reveal>QUICK ACCESS</h2>
          <div className={styles.grid}>
            {quickAccessData.map(item => {
              const Icon = item.icon;
              return (
                <a key={item.id} href={item.href} className={styles.card} data-reveal>
                  <div className={styles.iconBox}>
                    <Icon size={28} style={{ fill: 'url(#icon-gradient)' }} />
                  </div>
                  <span className={styles.label}>{item.title}</span>
                </a>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
