"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Container } from '../ui/Container';
import { infoData } from '../../data/info';
import styles from './InfoGarda.module.css';

export const InfoGarda = () => {
  const [selectedInfo, setSelectedInfo] = useState<typeof infoData[0] | null>(null);
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const closeModal = () => {
    setSelectedInfo(null);
    setOpenGroups([]);
  };

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => 
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    );
  };

  return (
    <section className={styles.section} id="info-garda">
      <Container>
        <div className={styles.masterBox}>
          <div className={styles.headerRow}>
            <h2 className={styles.sectionTitle}>INFO GARDA</h2>
          </div>

          <div className={styles.grid}>
            {infoData.map((info) => (
              <button 
                key={info.id} 
                onClick={() => setSelectedInfo(info)} 
                className={`${styles.card} ${info.urgent ? styles.cardWajib : ''}`}
              >
                {info.urgent && <span className={styles.badge}>WAJIB</span>}
                <div className={styles.iconBox}>
                  <Image src={info.icon} alt={info.title} width={24} height={24} />
                </div>
                <h3 className={styles.title}>{info.title}</h3>
                <p className={styles.description}>{info.desc}</p>
                <span className={styles.arrow}>➔</span>
              </button>
            ))}
          </div>
        </div>
      </Container>

      {/* MODAL OVERLAY */}
      {selectedInfo && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>✕</button>
            
            <div className={styles.modalHeader}>
              <div className={styles.iconBox}>
                <Image src={selectedInfo.icon} alt={selectedInfo.title} width={24} height={24} />
              </div>
              <h3>{selectedInfo.title}</h3>
            </div>
            
            <div className={styles.modalList}>
              {selectedInfo.subItems?.map((sub, idx) => {
                // Jika memiliki subLinks (Nested Menu)
                if ('subLinks' in sub) {
                  const isOpen = openGroups.includes(sub.label);
                  return (
                    <div key={idx}>
                      <button 
                        className={`${styles.modalGroupBtn} ${isOpen ? styles.active : ''}`}
                        onClick={() => toggleGroup(sub.label)}
                      >
                        <span>{sub.label}</span>
                        <span className={styles.modalLinkArrow}>▼</span>
                      </button>
                      {isOpen && (
                        <div className={styles.modalSubList}>
                          {sub.subLinks?.map((child, cIdx) => (
                            <a key={cIdx} href={child.link} className={styles.modalSubLink}>
                              {child.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // Jika Direct Link
                return (
                  <a key={idx} href={sub.link} className={styles.modalLink}>
                    <span>{sub.label}</span>
                    <span className={styles.modalLinkArrow}>➔</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
