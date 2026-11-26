"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCheck, FaMapMarkedAlt, FaMapMarkerAlt, FaTshirt, FaExclamationTriangle } from 'react-icons/fa';
import { Container } from '../ui/Container';
import { timelineData } from '../../data/schedule';
import { stageStatus, currentStageIndex, type StageStatus } from '../../lib/schedule';
import styles from './Schedule.module.css';

const STATUS_TEXT: Record<StageStatus, string> = {
  Done: 'Selesai',
  Ongoing: 'Sedang berlangsung',
  Upcoming: 'Akan datang',
};

export const Schedule = () => {
  const [now, setNow] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setNow(Date.now()), 0);
    const interval = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  const current = now === 0 ? 0 : currentStageIndex(timelineData, now);
  const active = selected ?? current;
  const lastEnd = new Date(timelineData[timelineData.length - 1].endDate).getTime();
  const allDone = now !== 0 && now > lastEnd;
  // Share of the rail between the first and last station that is already travelled.
  const progress = now === 0 ? 0 : allDone ? 1 : current / (timelineData.length - 1);
  const item = timelineData[active];
  const details = item.details;

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (idx + step + timelineData.length) % timelineData.length;
    setSelected(next);
    document.getElementById(`stage-tab-${next}`)?.focus();
  };

  return (
    <section className={styles.section} id="jadwal">
      <Container>
        <div className={styles.centeredHeader}>
          <h2 className={styles.sectionTitle} data-reveal>PETA PERJALANAN PKKMB</h2>
          <p className={styles.hint}>Pilih tahap untuk melihat detailnya.</p>
        </div>

        <div className={styles.route} style={{ '--progress': progress } as React.CSSProperties}>
          <div className={styles.rail} aria-hidden="true">
            <div className={styles.railFill} />
          </div>

          <div className={styles.stations} role="tablist" aria-label="Tahapan PKKMB">
            {timelineData.map((stage, idx) => {
              const status: StageStatus = now === 0 ? 'Upcoming' : stageStatus(stage, now);
              const isActive = idx === active;
              return (
                <button
                  key={idx}
                  id={`stage-tab-${idx}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="stage-panel"
                  tabIndex={isActive ? 0 : -1}
                  className={`${styles.station} ${styles[`is${status}`]} ${isActive ? styles.isSelected : ''}`}
                  style={{ '--i': idx } as React.CSSProperties}
                  onClick={() => setSelected(idx)}
                  onKeyDown={(e) => onKeyDown(e, idx)}
                >
                  <span className={styles.marker} aria-hidden="true">
                    {status === 'Done' ? <FaCheck /> : String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.stationText}>
                    <span className={styles.date}>{stage.date}</span>
                    <span className={styles.title}>{stage.title}</span>
                    <span className={styles.status}>{STATUS_TEXT[status]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="stage-panel"
          role="tabpanel"
          aria-labelledby={`stage-tab-${active}`}
          className={styles.panel}
          key={active}
        >
          <div className={styles.panelHead}>
            <span className={styles.panelStep}>Tahap {String(active + 1).padStart(2, '0')}</span>
            <h3 className={styles.panelTitle}>{item.title}</h3>
            <span className={styles.panelDate}>{item.date}</span>
          </div>

          <div className={styles.panelBody}>
            {details.activities.length > 0 && (
              <div className={styles.block}>
                <h4 className={styles.blockLabel}>Kegiatan utama</h4>
                <ul className={styles.activities}>
                  {details.activities.map((act, i) => <li key={i}>{act}</li>)}
                </ul>
              </div>
            )}

            <div className={styles.facts}>
              {details.location && (
                <div className={styles.fact}>
                  <FaMapMarkerAlt aria-hidden="true" />
                  <div><span className={styles.blockLabel}>Lokasi</span>{details.location}</div>
                </div>
              )}
              {details.dresscode && (
                <div className={styles.fact}>
                  <FaTshirt aria-hidden="true" />
                  <div><span className={styles.blockLabel}>Dresscode</span>{details.dresscode}</div>
                </div>
              )}
              {details.notes && (
                <div className={`${styles.fact} ${styles.factNote}`}>
                  <FaExclamationTriangle aria-hidden="true" />
                  <div><span className={styles.blockLabel}>Catatan khusus</span>{details.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.actionWrap}>
          <Link href="/jadwal" className={styles.linkFull}>
            <FaMapMarkedAlt /> Lihat Jadwal Lengkap
          </Link>
        </div>
      </Container>
    </section>
  );
};
