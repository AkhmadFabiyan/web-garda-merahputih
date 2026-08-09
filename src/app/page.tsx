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
        <RenderOnScroll id="jadwal" minHeight="800px">
          <Schedule />
        </RenderOnScroll>
        <RenderOnScroll id="info-garda" minHeight="600px">
          <InfoGarda />
        </RenderOnScroll>
        <RenderOnScroll id="unesa-news" minHeight="600px">
          <Suspense fallback={<UnesaNewsSkeleton />}>
            <UnesaNews />
          </Suspense>
        </RenderOnScroll>
        <RenderOnScroll minHeight="1200px">
          <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
            <PreFooter />
          </Suspense>
          <FooterCTA />
          <Footer />
        </RenderOnScroll>
      </main>
    </>
  );
}
