'use client';

import React, { forwardRef } from 'react';
import styles from './GardaButton.module.css';
import { HiSparkles } from 'react-icons/hi';

interface GardaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
}

export const GardaButton = forwardRef<HTMLButtonElement, GardaButtonProps>(
  ({ onClick, isOpen, ...props }, ref) => {
    if (isOpen) return null;

    return (
      <button
        ref={ref}
        id="garda-floating-button"
        className={styles.button}
        onClick={onClick}
        aria-label="Buka Gara - Asisten PKKMB"
        aria-haspopup="dialog"
        {...props}
      >
        <span className={styles.sparkle} aria-hidden="true"><HiSparkles /></span>
        <span className={styles.label}>Tanya Gara</span>
        <span className={styles.pulse} aria-hidden="true" />
      </button>
    );
  }
);

GardaButton.displayName = 'GardaButton';
