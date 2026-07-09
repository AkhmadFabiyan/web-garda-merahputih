"use client";
import React from 'react';
import styles from './OfflineBanner.module.css';
import { FaWifi } from 'react-icons/fa';

// useSyncExternalStore is the React 18 canonical way to subscribe to external
// state (DOM events) without triggering set-state-in-effect or hydration issues.
function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return !navigator.onLine;
}

// Server snapshot — assume online (false = not offline) to match SSR
function getServerSnapshot() {
  return false;
}

export const OfflineBanner = () => {
  const isOffline = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className={`${styles.banner} ${isOffline ? styles.visible : ''}`} role="alert" aria-live="assertive">
      <FaWifi className={styles.icon} />
      <span>Koneksi Terputus. Menampilkan data offline.</span>
    </div>
  );
};
