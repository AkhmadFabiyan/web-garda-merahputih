import React from 'react';
import Image from 'next/image';
import { Container } from '../ui/Container';
import { Countdown } from '../ui/Countdown';
import { FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import styles from './Hero.module.css';
import { Button } from '../ui/Button';
import heroEmblem from '../../../public/assets/hero-emblem.png';

export const Hero = ({ children }: { children?: React.ReactNode }) => {
  return (
    <section className={styles.heroSection}>
      <Image 
        src={heroEmblem}
        placeholder="blur"
        alt="GARDA UNESA Emblem" 
        fill 
        priority 
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
              <div className={styles.badge}><span className={styles.stars} aria-hidden="true"><span>✦</span><span>✦</span><span>✦</span></span> PKKMB UNESA 2026</div>
              <h1 className={styles.headline}>
                <span className={styles.welcome}>WELCOME TO</span>
                <br />
                <span className={styles.highlight}>PKKMB UNESA 2026</span>
              </h1>
              <h2 className={styles.subHeadline}>JAYANTARA NUSWANTARA</h2>
              <p className={styles.description}>Pelopor Pendidikan, Pilar Kemajuan Bangsa</p>
              <div className={styles.actionWrap}>
                <Button href="/jadwal" size="lg" className={`${styles.heroBtn} ${styles.sheen}`}>
                  Lihat Jadwal <FaCalendarAlt />
                </Button>
                <Button href="/#info-garda" variant="secondary" size="lg" className={styles.heroBtn}>
                  Info Garda <FaInfoCircle />
                </Button>
              </div>
            </div>

            <div className={styles.countdownCol}>
              <div className={styles.countdownCard}>
                <Countdown />
              </div>
            </div>
          </div>
        </Container>
      </div>
      {children}
    </section>
  );
};
