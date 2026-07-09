"use client";
import React from 'react';
import styles from './page.module.css';
import { timelineData } from '../../data/schedule';

export default function OfflinePage() {
  // Ambil 3 jadwal terdekat dari data lokal statis
  const importantSchedules = timelineData.slice(0, 3);

  return (
    <div className={styles.offlineContainer}>
      <div className={styles.glitchIcon}>📡</div>
      <h1 className={styles.title}>Koneksi Terputus</h1>
      <p className={styles.desc}>
        Anda saat ini berada dalam Mode Offline karena kehilangan sinyal internet. 
        Jangan panik, Anda masih bisa melihat jadwal penting PKKMB di bawah ini.
      </p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Jadwal Tersimpan (Offline)</h2>
        <div className={styles.scheduleList}>
          {importantSchedules.map((item, idx) => (
            <div key={idx} className={styles.scheduleItem}>
              <div>
                <div className={styles.date}>{item.date}</div>
                <div className={styles.eventTitle}>{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        className={styles.actionBtn} 
        onClick={() => {
          if (typeof window !== 'undefined') window.location.reload();
        }}
      >
        Coba Hubungkan Kembali
      </button>
    </div>
  );
}
