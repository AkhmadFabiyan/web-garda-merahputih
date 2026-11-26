import React from 'react';
import { getContactOrder } from '../../lib/redis';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/layout/PageHeader';
import { Container } from '../../components/ui/Container';
import { contacts } from '../../data/contacts';
import { sortByPopularity } from '../../lib/popularity';
import { ContactCard } from '../../components/ui/ContactCard';
import styles from './page.module.css';

export const revalidate = 3600;

export default async function KontakPage() {
  const contactOrder = await getContactOrder();
  const sortedContacts = sortByPopularity(contacts, contactOrder, (c) => c.faculty);

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
            {sortedContacts.map((contact) => (
              <ContactCard key={contact.faculty} contact={contact} />
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
