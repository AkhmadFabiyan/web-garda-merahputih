"use client";
import React, { useState, useEffect } from 'react';
import { FaTrophy, FaFire } from 'react-icons/fa';
import styles from './Countdown.module.css';

export const Countdown: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [activePhase, setActivePhase] = useState<{label: string, date: number} | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      
      const praPkkmb = new Date(2026, 7, 14, 8, 0, 0).getTime();
      const univStart = new Date(2026, 7, 17, 6, 0, 0).getTime();
      const fakEnd = new Date(2026, 7, 21, 16, 30, 0).getTime();

      let currentPhase: {label: string, date: number} | null = null;

      if (now < praPkkmb) {
        currentPhase = { label: 'COUNTDOWN PRA-PKKMB', date: praPkkmb };
      } else if (now < univStart) {
        currentPhase = { label: 'COUNTDOWN PKKMB', date: univStart };
      } else if (now < fakEnd) {
        // Event sedang berlangsung (17 Ags - 21 Ags)
        currentPhase = { label: 'PKKMB SEDANG BERLANGSUNG', date: 0 };
      } else {
        // Event sudah selesai sama sekali (Setelah 21 Ags)
        currentPhase = null;
      }

      if (!currentPhase) {
        setActivePhase(null);
        clearInterval(interval);
        return;
      }

      setActivePhase(currentPhase);

      if (currentPhase.date !== 0) {
        const difference = currentPhase.date - now;
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className={styles.card} style={{ opacity: 0 }}></div>;

  return (
    <>
      <p className="countdownLabelGlobal" style={{
        fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, 
        color: 'var(--color-brand-primary)', marginBottom: '1.5rem', 
        textAlign: 'center', letterSpacing: '0.0938rem', textTransform: 'uppercase'
      }}>
        {activePhase ? activePhase.label : 'PKKMB TELAH SELESAI'}
      </p>
      <div className={styles.card}>
        {!activePhase ? (
          <div className={styles.finishedMessage}>
            Sampai Jumpa! <FaTrophy style={{ marginLeft: '0.5rem', marginBottom: '-0.15rem' }} />
          </div>
        ) : activePhase.date === 0 ? (
          <div className={styles.finishedMessage}>
            <FaFire style={{ marginRight: '0.5rem', marginBottom: '-0.15rem' }} /> 
            MASA ORIENTASI DIMULAI 
            <FaFire style={{ marginLeft: '0.5rem', marginBottom: '-0.15rem' }} />
          </div>
        ) : (
          <div className={styles.grid}>
            <div className={styles.unit}>
              <span className={styles.number}>{String(timeLeft.days).padStart(2, '0')}</span>
              <span className={styles.label}>Hari</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.unit}>
              <span className={styles.number}>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className={styles.label}>Jam</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.unit}>
              <span className={styles.number}>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className={styles.label}>Menit</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.unit}>
              <span className={styles.number}>{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className={styles.label}>Detik</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
