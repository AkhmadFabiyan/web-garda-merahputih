import React from 'react';
import { Container } from '../ui/Container';
import { quickAccessData } from '../../data/quickAccess';
import styles from './QuickAccess.module.css';

export const QuickAccess = () => {
  return (
    <section className={styles.section} id="quick-access">
      <Container>
        <div className={styles.masterBox}>
          <h2 className={styles.title}>QUICK ACCESS</h2>
          <div className={styles.grid}>
            {quickAccessData.map(item => {
              const Icon = item.icon;
              return (
                <a key={item.id} href={item.href} className={styles.card}>
                  <div className={styles.iconBox}>
                    <Icon size={28} color="#C8102E" />
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
