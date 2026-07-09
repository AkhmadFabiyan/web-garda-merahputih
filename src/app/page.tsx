import React from 'react';
import { getFaqOrder, getContactOrder } from '../lib/redis';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/sections/Hero';
import { QuickAccess } from '../components/sections/QuickAccess';
import { Announcement } from '../components/sections/Announcement';
import { About } from '../components/sections/About';
import { Schedule } from '../components/sections/Schedule';
import { InfoGarda } from '../components/sections/InfoGarda';
import { PreFooter } from '../components/sections/PreFooter';
import { FooterCTA } from '../components/sections/FooterCTA';
import { Footer } from '../components/layout/Footer';
import { RenderOnScroll } from '../components/ui/RenderOnScroll';

export const revalidate = 3600; //


export default async function Home() {
  let faqOrder: string[] = [];
  let contactOrder: string[] = [];

  try {
    faqOrder = await getFaqOrder();
    contactOrder = await getContactOrder();
  } catch (e) {
    console.error('Failed to fetch Redis order:', e);
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero>
          <QuickAccess />
        </Hero>
        <Announcement />
        <About />
        <RenderOnScroll id="jadwal" minHeight="800px">
          <Schedule />
        </RenderOnScroll>
        <RenderOnScroll id="info-garda" minHeight="600px">
          <InfoGarda />
        </RenderOnScroll>
        <RenderOnScroll minHeight="1200px">
          <PreFooter faqOrder={faqOrder} contactOrder={contactOrder} />
          <FooterCTA />
          <Footer />
        </RenderOnScroll>
      </main>
    </>
  );
}
