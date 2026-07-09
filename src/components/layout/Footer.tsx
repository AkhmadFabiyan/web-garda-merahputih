"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaTiktok, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { Container } from '../ui/Container';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.glowTop} />
      <Container>
        <div className={styles.minimalStack}>
          <div className={styles.brandGroup}>
            <div className={styles.logo}>
              <div className={styles.logoFlame}>
                <Image src="/assets/icon.png" alt="Garda UNESA Logo" width={24} height={24} style={{ objectFit: 'contain' }} />
              </div>
              <div className={styles.logoText}>
                <h2>GARDA UNESA 2026</h2>
              </div>
            </div>
            <p className={styles.tagline}>Jayantara Nuswantara</p>
          </div>

          <nav className={styles.navLinks}>
            <Link href="/">Beranda</Link>
            <span className={styles.dot}>•</span>
            <Link href="/jadwal">Jadwal</Link>
            <span className={styles.dot}>•</span>
            <Link href="/#info-garda">Info Garda</Link>
            <span className={styles.dot}>•</span>
            <Link href="/faq">FAQ</Link>
            <span className={styles.dot}>•</span>
            <Link href="/kontak">Kontak</Link>
            <span className={styles.dot}>•</span>
            <Link href="/syarat-ketentuan">Syarat & Ketentuan</Link>
          </nav>

          <div className={styles.socialRow}>
            <a href="https://youtube.com/@username" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube"><FaYoutube size={18} /></a>
            <a href="https://instagram.com/username" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram"><FaInstagram size={18} /></a>
            <a href="https://tiktok.com/@username" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="TikTok"><FaTiktok size={18} /></a>
            <a href="https://wa.me/628000000000" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="WhatsApp"><FaWhatsapp size={18} /></a>
          </div>

          <p className={styles.copyright}>&copy; 2026 Garda UNESA. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};
