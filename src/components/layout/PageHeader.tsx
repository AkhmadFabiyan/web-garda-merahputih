import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <div className={styles.headerWrap}>
      <Container>
        <Link href="/" className={styles.backBtn}>
          <span>←</span> Kembali ke Beranda
        </Link>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </Container>
    </div>
  );
};
