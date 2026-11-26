"use client";
import React from 'react';
import { contacts } from '../../data/contacts';
import { sortByPopularity } from '../../lib/popularity';
import { trackClick } from '../../lib/services/analytics';
import { ContactCard } from '../ui/ContactCard';
import styles from './ContactSection.module.css';
import { Button } from '../ui/Button';
import { SectionTitle } from '../ui/SectionTitle';

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
      <SectionTitle variant="label" title="CONTACT PERSON" description="Hubungi Narahubung Fakultasmu" />
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
        <Button href="/kontak" variant="outline">Lihat Semua Fakultas ➔</Button>
      </div>
    </div>
  );
};
