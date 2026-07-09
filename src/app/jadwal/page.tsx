"use client";
import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/layout/PageHeader';
import { Container } from '../../components/ui/Container';
import { timelineData } from '../../data/schedule';
import styles from './page.module.css';

function getNodeIcon(status: string) {
  if (status === 'statusDone') return '✓';
  if (status === 'statusOngoing') return '▶';
  return '○';
}

function getStatusLabel(status: string) {
  if (status === 'statusDone') return '✓ Selesai';
  if (status === 'statusOngoing') return '● Sedang Berlangsung';
  return 'Akan Datang';
}

export default function JadwalPage() {
  const [now, setNow] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setNow(new Date().getTime()), 0);
    const interval = setInterval(() => setNow(new Date().getTime()), 1000 * 60);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  const getStatus = (startStr: string, endStr: string) => {
    if (now === 0) return 'statusUpcoming';
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    if (now > end) return 'statusDone';
    if (now >= start && now <= end) return 'statusOngoing';
    return 'statusUpcoming';
  };

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Jadwal Lengkap"
          subtitle="Rangkaian kegiatan PKKMB UNESA 2026 dari awal hingga akhir."
        />
        <Container>
          <div className={styles.timelineList}>
            {timelineData.map((item, idx) => {
              const status = getStatus(item.startDate, item.endDate);
              const nodeClass = status === 'statusDone' ? styles.nodeDone : status === 'statusUpcoming' ? styles.nodeUpcoming : '';
              const cardClass = status === 'statusOngoing' ? styles.cardOngoing : status === 'statusDone' ? styles.cardDone : '';
              const hasInfo = item.details?.location || item.details?.dresscode || item.details?.notes;

              return (
                <div key={idx} className={styles.item}>
                  {/* Node */}
                  <div className={`${styles.node} ${nodeClass}`} aria-hidden="true">
                    {getNodeIcon(status)}
                  </div>

                  {/* Card */}
                  <div className={`${styles.card} ${cardClass}`}>
                    <div className={styles.cardHeader}>
                      <div className={styles.date}>{item.date}</div>
                      <span className={`${styles.statusBadge} ${styles[status]}`}>
                        {getStatusLabel(status)}
                      </span>
                    </div>

                    <h3 className={styles.title}>{item.title}</h3>

                    {item.details?.activities && item.details.activities.length > 0 && (
                      <ul className={styles.activities}>
                        {item.details.activities.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    )}

                    {hasInfo && (
                      <div className={styles.infoGrid}>
                        {item.details?.location && (
                          <div className={styles.infoRow}>
                            <span>📍</span>
                            <span><strong>Lokasi:</strong> {item.details.location}</span>
                          </div>
                        )}
                        {item.details?.dresscode && (
                          <div className={styles.infoRow}>
                            <span>👕</span>
                            <span><strong>Dresscode:</strong> {item.details.dresscode}</span>
                          </div>
                        )}
                        {item.details?.notes && (
                          <div className={`${styles.infoRow} ${styles.infoRowNote}`}>
                            <span>⚠️</span>
                            <span>{item.details.notes}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
