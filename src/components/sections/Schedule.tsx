"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCheck, FaMapMarkedAlt, FaMapMarkerAlt, FaTshirt, FaExclamationTriangle } from 'react-icons/fa';
import { Container } from '../ui/Container';
import { timelineData, type TimelineItem } from '../../data/schedule';
import { stageStatus, currentStageIndex, type StageStatus } from '../../lib/schedule';
import styles from './Schedule.module.css';

const STATUS_TEXT: Record<StageStatus, string> = {
  Done: 'Selesai',
  Ongoing: 'Sedang berlangsung',
  Upcoming: 'Akan datang',
};

const stepLabel = (idx: number) => String(idx + 1).padStart(2, '0');

/** Details of one stage. Shown once (home, the selected stage) or for every stage (/jadwal). */
const StagePanel = ({ stage, idx, ...rest }: { stage: TimelineItem; idx: number } & React.HTMLAttributes<HTMLDivElement>) => {
  const d = stage.details;
  return (
    <div className={styles.panel} {...rest}>
      <div className={styles.panelHead}>
        <span className={styles.panelStep}>Tahap {stepLabel(idx)}</span>
        <h3 className={styles.panelTitle}>{stage.title}</h3>
        <span className={styles.panelDate}>{stage.date}</span>
      </div>

      <div className={styles.panelBody}>
        {d.activities.length > 0 && (
          <div className={styles.block}>
            <h4 className={styles.blockLabel}>Kegiatan utama</h4>
            <ul className={styles.activities}>
              {d.activities.map((act, i) => <li key={i}>{act}</li>)}
            </ul>
          </div>
        )}

        <div className={styles.facts}>
          {d.location && (
            <div className={styles.fact}>
              <FaMapMarkerAlt aria-hidden="true" />
              <div><span className={styles.blockLabel}>Lokasi</span>{d.location}</div>
            </div>
          )}
          {d.dresscode && (
            <div className={styles.fact}>
              <FaTshirt aria-hidden="true" />
              <div><span className={styles.blockLabel}>Dresscode</span>{d.dresscode}</div>
            </div>
          )}
          {d.notes && (
            <div className={`${styles.fact} ${styles.factNote}`}>
              <FaExclamationTriangle aria-hidden="true" />
              <div><span className={styles.blockLabel}>Catatan khusus</span>{d.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Peta Perjalanan: route of stations + stage details.
 * - default (home): stations are tabs, one detail panel for the selected stage.
 * - `full` (/jadwal): every stage's panel is listed; stations jump to their panel.
 */
export const Schedule = ({ full = false }: { full?: boolean }) => {
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

  const select = (idx: number) => {
    setSelected(idx);
    if (full) document.getElementById(`stage-panel-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (full) return; // plain buttons: Tab moves between them
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (idx + step + timelineData.length) % timelineData.length;
    setSelected(next);
    document.getElementById(`stage-tab-${next}`)?.focus();
  };

  return (
    <section className={`${styles.section} ${full ? styles.full : ''}`} id={full ? undefined : 'jadwal'}>
      <Container>
        {!full && (
          <div className={styles.centeredHeader}>
            <h2 className={styles.sectionTitle} data-reveal>PETA PERJALANAN PKKMB</h2>
            <p className={styles.hint}>Pilih tahap untuk melihat detailnya.</p>
          </div>
        )}

        <div className={styles.route} style={{ '--progress': progress } as React.CSSProperties}>
          <div className={styles.rail} aria-hidden="true">
            <div className={styles.railFill} />
          </div>

          <div className={styles.stations} {...(full ? { 'aria-label': 'Lompat ke tahap' } : { role: 'tablist', 'aria-label': 'Tahapan PKKMB' })}>
            {timelineData.map((stage, idx) => {
              const status: StageStatus = now === 0 ? 'Upcoming' : stageStatus(stage, now);
              const isActive = idx === active;
              const a11y = full
                ? { 'aria-controls': `stage-panel-${idx}` }
                : { role: 'tab', 'aria-selected': isActive, 'aria-controls': 'stage-panel', tabIndex: isActive ? 0 : -1 };
              return (
                <button
                  key={idx}
                  id={`stage-tab-${idx}`}
                  type="button"
                  {...a11y}
                  className={`${styles.station} ${styles[`is${status}`]} ${isActive ? styles.isSelected : ''}`}
                  style={{ '--i': idx } as React.CSSProperties}
                  onClick={() => select(idx)}
                  onKeyDown={(e) => onKeyDown(e, idx)}
                >
                  <span className={styles.marker} aria-hidden="true">
                    {status === 'Done' ? <FaCheck /> : stepLabel(idx)}
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

        {full ? (
          <div className={styles.panelList}>
            {timelineData.map((stage, idx) => (
              <StagePanel key={idx} stage={stage} idx={idx} id={`stage-panel-${idx}`} />
            ))}
          </div>
        ) : (
          <StagePanel
            key={active}
            stage={timelineData[active]}
            idx={active}
            id="stage-panel"
            role="tabpanel"
            aria-labelledby={`stage-tab-${active}`}
          />
        )}

        {!full && (
          <div className={styles.actionWrap}>
            <Link href="/jadwal" className={styles.linkFull}>
              <FaMapMarkedAlt /> Lihat Jadwal Lengkap
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
};
