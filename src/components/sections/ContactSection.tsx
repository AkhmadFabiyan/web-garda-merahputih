"use client";
import React from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { contacts } from '../../data/contacts';
import styles from './ContactSection.module.css';

const getWaLink = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/62${cleanPhone.substring(1)}`;
};

export const ContactSection = ({ contactOrder = [] }: { contactOrder?: string[] }) => {
  const sortedContacts = [...contacts].sort((a, b) => {
    const indexA = contactOrder.indexOf(a.faculty);
    const indexB = contactOrder.indexOf(b.faculty);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const handleTrackClick = (faculty: string) => {
    fetch('/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'contact', id: faculty })
    }).catch(e => console.error('Error tracking contact click:', e));
  };
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
      <h2 className={styles.sectionTitle}>CONTACT PERSON</h2>
      <h3 className={styles.sectionSubtitle}>Hubungi Narahubung Fakultasmu</h3>
      <div className={styles.grid}>
        {sortedContacts.slice(0, 6).map((contact, idx) => (
          <div key={idx} className={styles.contactCard}>
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
                <a href={getWaLink(contact.cp1.phone)} target="_blank" rel="noopener noreferrer" className={styles.waBtn} onClick={() => handleTrackClick(contact.faculty)}>
                  <FaWhatsapp size={16} /> {contact.cp1.phone}
                </a>
              </div>
              {/* CP 2 */}
              <div className={styles.personItem}>
                <span className={styles.personName}>{contact.cp2.name}</span>
                <a href={getWaLink(contact.cp2.phone)} target="_blank" rel="noopener noreferrer" className={styles.waBtn} onClick={() => handleTrackClick(contact.faculty)}>
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
