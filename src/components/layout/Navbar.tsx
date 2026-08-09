"use client";
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const pathname = usePathname();

  // Derive the active section for non-home pages directly from pathname
  // This avoids calling setState synchronously inside a useEffect body.
  const getStaticSection = () => {
    if (pathname.startsWith('/jadwal')) return 'jadwal';
    if (pathname.startsWith('/faq')) return 'faq';
    if (pathname.startsWith('/kontak')) return 'kontak';
    if (pathname !== '/') return '';
    return null; // null = let scroll spy handle it
  };
  const staticSection = getStaticSection();

  const [scrollSection, setScrollSection] = useState('beranda');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (staticSection !== null) return; // non-home page: scroll spy not needed

    const handleScroll = () => {
      const sections = ['beranda', 'jadwal', 'info-garda', 'faq', 'kontak'];
      const scrollPos = window.scrollY + 120;

      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el) {
          if (scrollPos >= el.offsetTop) {
            setScrollSection(section);
            break;
          }
        }
      }

      if (window.scrollY < 50) {
        setScrollSection('beranda');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [staticSection]);

  const activeSection = staticSection !== null ? staticSection : scrollSection;

  // Lock body scroll and handle Escape key when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={styles.header}>
      <Container className={styles.navContainer}>
        <div className={styles.logo}>
          <div className={styles.logoFlame}>
            <Image src="/assets/icon.png" alt="Garda UNESA Logo" width={32} height={32} style={{ objectFit: 'contain' }} />
          </div>
          <div className={styles.logoText}>
            <h1>GARDA UNESA</h1>
            <span>2 0 2 6</span>
          </div>
        </div>
        
        <nav className={styles.navLinks}>
          <Link href="/" className={activeSection === 'beranda' ? styles.active : ''}>Beranda</Link>
          <Link href="/jadwal" className={activeSection === 'jadwal' ? styles.active : ''}>Jadwal</Link>
          <Link href="/#info-garda" className={activeSection === 'info-garda' ? styles.active : ''}>Info Garda</Link>
          <Link href="/faq" className={activeSection === 'faq' ? styles.active : ''}>FAQ</Link>
          <Link href="/kontak" className={activeSection === 'kontak' ? styles.active : ''}>Kontak</Link>
          <a href="https://www.unesa.ac.id/berita-unesa/" target="_blank" rel="noopener noreferrer">Berita</a>
        </nav>

        <div className={styles.actions}>
          <Link href="/#quick-access" style={{ textDecoration: 'none' }} className={styles.desktopBtn}>
            <Button variant="secondary" className={styles.qaBtn}>
              <span className={styles.qaIcon}>⚡</span> Quick Access
            </Button>
          </Link>
          <button 
            className={styles.mobileMenuBtn} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FaTimes size={24} color="var(--color-brand-primary)" /> : <FaBars size={24} color="var(--color-brand-primary)" />}
          </button>
        </div>
      </Container>

      <div className={`${styles.mobileDrawer} ${isMobileMenuOpen ? styles.mobileDrawerOpen : ''}`}>
        <nav className={styles.mobileNavLinks}>
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
          <Link href="/jadwal" onClick={() => setIsMobileMenuOpen(false)}>Jadwal</Link>
          <Link href="/#info-garda" onClick={() => setIsMobileMenuOpen(false)}>Info Garda</Link>
          <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
          <Link href="/kontak" onClick={() => setIsMobileMenuOpen(false)}>Kontak</Link>
          <a href="https://www.unesa.ac.id/berita-unesa/" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>Berita</a>
          <Link href="/#quick-access" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="secondary" className={styles.qaBtnMobile}>
              <span className={styles.qaIcon}>⚡</span> Quick Access
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
