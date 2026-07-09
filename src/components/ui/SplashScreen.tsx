"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './SplashScreen.module.css';

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Prevent browser auto-scroll restoration
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Lock scroll and force top
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    // Start fading out after 600ms
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 600);

    // Completely unmount after 1000ms (0.4s for fade animation)
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    }, 1000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`${styles.splashContainer} ${isFading ? styles.fadeOut : ''}`}>
      <div className={styles.logoWrap}>
        <div className={styles.flameWrap}>
          <Image src="/assets/icon.png" alt="Garda UNESA Logo" width={48} height={48} style={{ objectFit: 'contain' }} priority />
        </div>
        <h1 className={styles.brandText}>
          GARDA UNESA<br />
          <span className={styles.brandYear}>2 0 2 6</span>
        </h1>
      </div>
      <div className={styles.loaderLine}>
        <div className={styles.loaderProgress}></div>
      </div>
    </div>
  );
};
