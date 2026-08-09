'use client';

import React from 'react';
import styles from './GardaFacultyPicker.module.css';

const FACULTIES = ['FIP', 'FBS', 'FMIPA', 'FT', 'FEB', 'FISIPOL', 'FIKK', 'FV', 'FH', 'FPsi', 'FK', 'FKP', 'PSDKU'];

const STORAGE_KEY = 'garda_faculty';

interface GardaFacultyPickerProps {
  onSelect: (faculty: string) => void;
  onSkip: () => void;
}

export const GardaFacultyPicker: React.FC<GardaFacultyPickerProps> = ({ onSelect, onSkip }) => {
  const handleSelect = (faculty: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, faculty);
    } catch {
      // ignore storage errors
    }
    onSelect(faculty);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-label="Pilih fakultas">
      <div className={styles.card}>
        <div className={styles.title}>👋 Halo!</div>
        <p className={styles.subtitle}>
          Kamu dari fakultas mana? Aku bisa memberikan informasi yang lebih personal untukmu.
        </p>
        <div className={styles.grid}>
          {FACULTIES.map((fac) => (
            <button
              key={fac}
              className={styles.facultyBtn}
              onClick={() => handleSelect(fac)}
              aria-label={`Pilih Fakultas ${fac}`}
            >
              {fac}
            </button>
          ))}
        </div>
        <button className={styles.skip} onClick={onSkip}>
          Lewati untuk sekarang
        </button>
      </div>
    </div>
  );
};

export function getSavedFaculty(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
