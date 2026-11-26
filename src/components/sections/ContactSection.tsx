"use client";
import React from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { contacts } from '../../data/contacts';
import { waLink } from '../../lib/links';
import { sortByPopularity } from '../../lib/popularity';
import { trackClick } from '../../lib/services/analytics';
import styles from './ContactSection.module.css';

export const ContactSection = ({ contactOrder = [] }: { contactOrder?: string[] }) => {
  const sortedContacts = sortByPopularity(contacts, contactOrder, (c) => c.faculty);

  const handleTrackClick = (faculty: string) => trackClick('contact', faculty);
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const handleToggle = (idx: number, faculty: string) => {
    if (openIndex === idx) {
      setOpenIndex(null);
    } else {
      setOpenIndex(idx);
      handleTrackClick(faculty);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.sectionTitle} data-reveal>CONTACT PERSON</h2>
      <h3 className={styles.sectionSubtitle}>Hubungi Narahubung Fakultasmu</h3>
      <div className={styles.grid}>
        {sortedContacts.slice(0, 6).map((contact, idx) => (
          <div key={idx} className={styles.contactCard} data-reveal>
            <input 
              type="checkbox" 
              id={`faculty-${idx}`} 
              className={styles.toggleInput} 
              checked={openIndex === idx}
              onChange={() => handleToggle(idx, contact.faculty)} 
            />
            <label htmlFor={`faculty-${idx}`} className={styles.facultyTitle}>{contact.faculty}</label>
            <div className={styles.personsList}>
              {/* CP 1 */}
              <div className={styles.personItem}>
                <span className={styles.personName}>{contact.cp1.name}</span>
                <a href={waLink(contact.cp1.phone)} target="_blank" rel="noopener noreferrer" className={styles.waBtn} onClick={() => handleTrackClick(contact.faculty)}>
                  <FaWhatsapp size={16} /> {contact.cp1.phone}
                </a>
              </div>
              {/* CP 2 */}
              <div className={styles.personItem}>
                <span className={styles.personName}>{contact.cp2.name}</span>
                <a href={waLink(contact.cp2.phone)} target="_blank" rel="noopener noreferrer" className={styles.waBtn} onClick={() => handleTrackClick(contact.faculty)}>
                  <FaWhatsapp size={16} /> {contact.cp2.phone}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.actionWrap}>
        <Link href="/kontak" className={styles.btn}>Lihat Semua Fakultas ➔</Link>
      </div>
    </div>
  );
};
