import React from 'react';
import Image from 'next/image';
import { Container } from '../ui/Container';
import { Countdown } from '../ui/Countdown';
import { FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';
import styles from './Hero.module.css';

export const Hero = ({ children }: { children?: React.ReactNode }) => {
  return (
    <section className={styles.heroSection}>
      <Image 
        src="/assets/hero-emblem.png" 
        alt="GARDA UNESA Emblem" 
        fill 
        priority 
        quality={100}
        sizes="100vw"
        className={styles.heroEmblem}
      />
      <div className={styles.ambientBackground}>
        <div className={styles.particles}></div>
        <div className={styles.glowSpot}></div>
      </div>
      <div className={styles.mainContentWrap}>
        <Container>
          <div className={styles.grid}>
            <div className={styles.textCol}>
              <div className={styles.badge}>PKKMB UNESA 2026</div>
              <h1 className={styles.headline}>
                <span className={styles.welcome}>WELCOME TO</span>
                <br />
                <span className={styles.highlight}>PKKMB UNESA 2026</span>
              </h1>
              <h2 className={styles.subHeadline}>JAYANTARA NUSWANTARA</h2>
              <p className={styles.description}>Pelopor Pendidikan, Pilar Kemajuan Bangsa</p>
              <div className={styles.actionWrap}>
                <Link href="/jadwal" className={styles.primaryBtn}>
                  Lihat Jadwal <FaCalendarAlt />
                </Link>
                <Link href="/#info-garda" className={styles.secondaryBtn}>
                  Info Garda <FaInfoCircle />
                </Link>
              </div>
            </div>

            <div className={styles.countdownCol}>
              <div className={styles.countdownCard}>
                <p className={styles.countdownLabel}>Countdown Pra-PKKMB</p>
                <Countdown targetDate="2026-08-15T00:00:00+07:00" />
              </div>
            </div>
          </div>
        </Container>
      </div>
      {children}
    </section>
  );
};
