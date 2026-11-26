import React, { Suspense } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/sections/Hero';
import { QuickAccess } from '../components/sections/QuickAccess';
import { Announcement } from '../components/sections/Announcement';
import { About } from '../components/sections/About';
import { Schedule } from '../components/sections/Schedule';
import { InfoGarda } from '../components/sections/InfoGarda';
import { UnesaNews } from '../components/sections/UnesaNews';
import { UnesaNewsSkeleton } from '../components/sections/UnesaNewsSkeleton';
import { PreFooter } from '../components/sections/PreFooter';
import { FooterCTA } from '../components/sections/FooterCTA';
import { Footer } from '../components/layout/Footer';
import { RenderOnScroll } from '../components/ui/RenderOnScroll';

export const revalidate = 3600; //


export default function Home() {

  return (
    <>
      <Navbar />
      <main>
        <Hero>
          <QuickAccess />
        </Hero>
        <Announcement />
        <About />
        <RenderOnScroll id="jadwal" minHeight="50rem">
          <Schedule />
        </RenderOnScroll>
        <RenderOnScroll id="info-garda" minHeight="37.5rem">
          <InfoGarda />
        </RenderOnScroll>
        <RenderOnScroll id="unesa-news" minHeight="37.5rem">
          <Suspense fallback={<UnesaNewsSkeleton />}>
            <UnesaNews />
          </Suspense>
        </RenderOnScroll>
        <RenderOnScroll minHeight="75rem">
          <Suspense fallback={<div style={{ minHeight: '25rem' }} />}>
            <PreFooter />
          </Suspense>
          <FooterCTA />
          <Footer />
        </RenderOnScroll>
      </main>
    </>
  );
}
