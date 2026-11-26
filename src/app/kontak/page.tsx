import React from 'react';
import { getContactOrder } from '../../lib/redis';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/layout/PageHeader';
import { Container } from '../../components/ui/Container';
import { contacts } from '../../data/contacts';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './page.module.css';

const getWaLink = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/62${cleanPhone.substring(1)}`;
};

export const revalidate = 3600;

export default async function KontakPage() {
  const contactOrder = await getContactOrder();
  const sortedContacts = [...contacts].sort((a, b) => {
    const indexA = contactOrder.indexOf(a.faculty);
    const indexB = contactOrder.indexOf(b.faculty);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <>
      <Navbar />
      <main>
        <PageHeader 
          title="Narahubung Fakultas" 
          subtitle="Daftar kontak panitia PKKMB dari seluruh fakultas di UNESA." 
        />
        <Container>
          <div className={styles.grid}>
            {sortedContacts.map((contact, idx) => (
              <div key={idx} className={styles.contactCard} data-reveal>
                <h4 className={styles.facultyTitle}>{contact.faculty}</h4>
                <div className={styles.personsList}>
                  {/* CP 1 */}
                  <div className={styles.personItem}>
                    <span className={styles.personName}>{contact.cp1.name}</span>
                    <a href={getWaLink(contact.cp1.phone)} target="_blank" rel="noopener noreferrer" className={styles.waLink}>
                      <FaWhatsapp size={16} /> {contact.cp1.phone}
                    </a>
                  </div>
                  {/* CP 2 */}
                  <div className={styles.personItem}>
                    <span className={styles.personName}>{contact.cp2.name}</span>
                    <a href={getWaLink(contact.cp2.phone)} target="_blank" rel="noopener noreferrer" className={styles.waLink}>
                      <FaWhatsapp size={16} /> {contact.cp2.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
