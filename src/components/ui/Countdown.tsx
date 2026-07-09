"use client";
/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from './Countdown.module.css';

interface CountdownProps {
  targetDate: string;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsFinished(true);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return <div className={styles.card} style={{ opacity: 0 }}></div>;

  return (
    <div className={styles.card}>
      {isFinished ? (
        <div className={styles.finishedMessage}>Dimulai</div>
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
  );
};
