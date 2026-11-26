import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/layout/PageHeader';
import { Schedule } from '../../components/sections/Schedule';

// Same Peta Perjalanan component as the home page, in full mode: every stage's details listed.
export default function JadwalPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Jadwal Lengkap"
          subtitle="Rangkaian kegiatan PKKMB UNESA 2026 dari awal hingga akhir."
        />
        <Schedule full />
      </main>
      <Footer />
    </>
  );
}
