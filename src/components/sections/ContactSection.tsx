"use client";
import React from 'react';
import Link from 'next/link';
import { contacts } from '../../data/contacts';
import { sortByPopularity } from '../../lib/popularity';
import { trackClick } from '../../lib/services/analytics';
import { ContactCard } from '../ui/ContactCard';
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
          <ContactCard
            key={contact.faculty}
            contact={contact}
            compact
            collapsible
            open={openIndex === idx}
            onToggle={() => handleToggle(idx, contact.faculty)}
          />
        ))}
      </div>
      <div className={styles.actionWrap}>
        <Link href="/kontak" className={styles.btn}>Lihat Semua Fakultas ➔</Link>
      </div>
    </div>
  );
};
