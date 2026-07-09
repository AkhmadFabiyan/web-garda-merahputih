"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCheck, FaClock, FaCalendarAlt, FaMapMarkedAlt } from 'react-icons/fa';
import { Container } from '../ui/Container';
import { timelineData } from '../../data/schedule';
import styles from './Schedule.module.css';

export const Schedule = () => {
  const [now, setNow] = useState(0);
  const [expandedCards, setExpandedCards] = useState<number[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setNow(new Date().getTime()), 0);
    const interval = setInterval(() => setNow(new Date().getTime()), 1000 * 60);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  const getStatus = (startStr: string, endStr: string) => {
    if (now === 0) return { text: 'MEMUAT...', status: 'Upcoming', icon: <FaCalendarAlt /> };
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();

    if (now > end) return { text: 'SELESAI', status: 'Done', icon: <FaCheck /> };
    if (now >= start && now <= end) return { text: 'SEDANG BERLANGSUNG', status: 'Ongoing', icon: <FaClock /> };
    return { text: 'AKAN DATANG', status: 'Upcoming', icon: <FaCalendarAlt /> };
  };

  const calculateProgress = () => {
    if (now === 0) return 0;
    
    let activeIndex = -1;
    for (let i = timelineData.length - 1; i >= 0; i--) {
      const start = new Date(timelineData[i].startDate).getTime();
      if (now >= start) {
        activeIndex = i;
        break;
      }
    }
    
    if (activeIndex === -1) return 0;
    
    const endOfLast = new Date(timelineData[timelineData.length - 1].endDate).getTime();
    if (now > endOfLast) return 100;
    
    const stepSize = 100 / (timelineData.length - 1);
    return activeIndex * stepSize;
  };

  const toggleCard = (idx: number) => {
    setExpandedCards(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className={styles.section} id="jadwal">
      <Container>
        <div className={styles.masterBox}>
          <div className={styles.centeredHeader}>
            <h2 className={styles.sectionTitle}>PETA PERJALANAN PKKMB</h2>
          </div>

          <div className={styles.timelineJourney}>
            <div className={styles.verticalLine}>
              <div className={styles.progressLine} style={{ height: `${calculateProgress()}%` }}></div>
            </div>

            {timelineData.map((item, idx) => {
              const statusObj = getStatus(item.startDate, item.endDate);
              const isLeft = idx % 2 === 0;
              const sideClass = isLeft ? styles.leftSide : styles.rightSide;
              
              const nodeClass = styles[`node${statusObj.status}`];
              const cardClass = styles[`card${statusObj.status}`];
              const statusWrapClass = styles[`status${statusObj.status}`];
              
              const isExpanded = expandedCards.includes(idx);
              const hasDetails = item.details && (
                (item.details.activities && item.details.activities.length > 0) || 
                item.details.location || 
                item.details.dresscode || 
                item.details.notes
              );

              return (
                <div key={idx} className={`${styles.checkpoint} ${sideClass} ${statusWrapClass}`} style={{ animationDelay: `${idx * 0.2}s` }}>
                  <div className={`${styles.node} ${nodeClass}`}>
                    {statusObj.icon}
                  </div>
                  
                  <div 
                    id={`schedule-btn-${idx}`}
                    className={`${styles.card} ${cardClass} ${hasDetails ? styles.clickableCard : ''}`}
                    onClick={() => hasDetails && toggleCard(idx)}
                    role={hasDetails ? "button" : undefined}
                    tabIndex={hasDetails ? 0 : undefined}
                    aria-expanded={hasDetails ? isExpanded : undefined}
                    aria-controls={hasDetails ? `schedule-details-${idx}` : undefined}
                    onKeyDown={(e) => {
                      if (hasDetails && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        toggleCard(idx);
                      }
                    }}
                  >
                    <div className={styles.date}>{item.date}</div>
                    <h3 className={styles.title}>{item.title}</h3>
                    
                    <div className={styles.statusBadge}>
                      {statusObj.text}
                    </div>

                    {hasDetails && (
                      <div 
                        className={styles.expandBtn} 
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? 'Tutup Detail' : 'Lihat Detail'} <span aria-hidden="true">▼</span>
                      </div>
                    )}

                    {hasDetails && isExpanded && (
                      <div id={`schedule-details-${idx}`} className={styles.detailsWrap} role="region" aria-labelledby={`schedule-btn-${idx}`}>
                        {item.details?.activities && item.details.activities.length > 0 && (
                          <div className={styles.infoBlock}>
                            <div className={styles.infoLabel}>Kegiatan Utama</div>
                            <ul className={styles.activities}>
                              {item.details.activities.map((act, i) => (
                                <li key={i}>{act}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {item.details?.location && (
                          <div className={styles.infoBlock}>
                            <div className={styles.infoLabel}>Lokasi</div>
                            <div className={styles.infoText}>{item.details.location}</div>
                          </div>
                        )}

                        {item.details?.dresscode && (
                          <div className={styles.infoBlock}>
                            <div className={styles.infoLabel}>Dresscode</div>
                            <div className={styles.infoText}>{item.details.dresscode}</div>
                          </div>
                        )}

                        {item.details?.notes && (
                          <div className={styles.infoBlock}>
                            <div className={styles.infoLabel}>Catatan Khusus</div>
                            <div className={styles.infoText}>{item.details.notes}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className={styles.actionWrap}>
            <Link href="/jadwal" className={styles.linkFull}>
              <FaMapMarkedAlt /> Lihat Jadwal Lengkap
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
