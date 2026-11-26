'use client';
import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { waLink } from '../../lib/links';
import { trackClick } from '../../lib/services/analytics';
import type { contacts } from '../../data/contacts';
import styles from './ContactCard.module.css';

type Contact = (typeof contacts)[number];

interface ContactCardProps {
  contact: Contact;
  /** Smaller card for the home page section. */
  compact?: boolean;
  /** On screens up to 64em the card collapses into an accordion row; `open`/`onToggle` control it. */
  collapsible?: boolean;
  open?: boolean;
  onToggle?: () => void;
}

/** One faculty with its two contact persons. Used on the home page and on /kontak. */
export const ContactCard: React.FC<ContactCardProps> = ({ contact, compact = false, collapsible = false, open = false, onToggle }) => {
  const people = [contact.cp1, contact.cp2];
  // The accordion only exists up to 64em; wider screens show a plain heading with the list open.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    if (!collapsible) return;
    const mq = window.matchMedia('(width > 64em)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [collapsible]);
  const asAccordion = collapsible && !wide;
  const listId = `contact-${contact.faculty}`;
  const classes = [styles.card, compact && styles.compact, collapsible && styles.collapsible, open && styles.open].filter(Boolean).join(' ');

  return (
    <div className={classes} data-reveal>
      {asAccordion ? (
        <button type="button" className={styles.faculty} aria-expanded={open} aria-controls={listId} onClick={onToggle}>
          {contact.faculty}
        </button>
      ) : (
        <h3 className={styles.faculty}>{contact.faculty}</h3>
      )}
      <div id={listId} className={styles.people}>
        {people.map((p) => (
          <div key={p.phone} className={styles.person}>
            <span className={styles.name}>{p.name}</span>
            <a
              href={waLink(p.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.wa}
              onClick={() => trackClick('contact', contact.faculty)}
            >
              <FaWhatsapp aria-hidden="true" /> {p.phone}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
