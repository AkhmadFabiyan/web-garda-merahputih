import React from 'react';
import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingWrapper}>
      {/* Skeleton Navbar */}
      <div className={styles.skeletonNav}>
        <div className={styles.skeletonLogo}></div>
        <div className={styles.skeletonLinks}>
          <div className={styles.skeletonLink}></div>
          <div className={styles.skeletonLink}></div>
          <div className={styles.skeletonLink}></div>
        </div>
      </div>

      {/* Skeleton Header */}
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonSubtitle}></div>
      </div>

      {/* Skeleton Content Grid */}
      <div className={styles.skeletonContainer}>
        <div className={styles.skeletonGrid}>
          <div className={styles.skeletonCard}></div>
          <div className={styles.skeletonCard}></div>
          <div className={styles.skeletonCard}></div>
          <div className={styles.skeletonCard}></div>
          <div className={styles.skeletonCard}></div>
          <div className={styles.skeletonCard}></div>
        </div>
      </div>
    </div>
  );
}
