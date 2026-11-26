'use client';

import React, { useEffect, useRef } from 'react';
import styles from './GardaModal.module.css';
import { FaRobot } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const GardaChat = dynamic(() => import('./GardaChat').then(mod => mod.GardaChat), {
  loading: () => <div className={styles.loading}>Memuat Gara AI...</div>
});

interface GardaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GardaModal: React.FC<GardaModalProps> = ({ isOpen, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Gara - Asisten PKKMB Garda UNESA 2026"
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar} aria-hidden="true"><FaRobot /></div>
            <div className={styles.headerInfo}>
              <div className={styles.headerTitle}>Gara</div>
              <div className={styles.headerSubtitle}>Asisten Resmi Garda UNESA 2026</div>
              <div className={styles.statusDot}>Online</div>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Tutup Gara"
          >
            ×
          </button>
        </div>

        {/* Chat Body + Footer rendered by GardaChat */}
        <GardaChat
          bodyClassName={styles.body}
          footerClassName={styles.footer}
          inputClassName={styles.input}
          sendBtnClassName={styles.sendBtn}
          disclaimerClassName={styles.disclaimer}
          inputRowClassName={styles.inputRow}
        />
      </div>
    </div>
  );
};
