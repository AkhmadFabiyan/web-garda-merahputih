import React from 'react';
import Image from 'next/image';
import { socialLinks } from '../../data/social';
import styles from './SocialGallery.module.css';
import { SectionTitle } from '../ui/SectionTitle';

// shortcut: only image unesa.ac.id still serves (two others return 403); swap in Garda's own photos (public/) when available.
const galleryImages = [
  'https://unesa.ac.id/images/gallery/5/b7175540e96b7bd1bbd38f1ff41df8ef.jpg',
];

export const SocialGallery = () => {
  return (
    <div className={styles.wrapper} id="galeri">
      <SectionTitle variant="label" title="IKUTI KAMI" description="Follow Social Media Garda" />
      <div className={styles.socialGrid}>
        {socialLinks.map(item => (
          <a 
            key={item.id} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialCard} 
            style={{ '--hover-color': item.color } as React.CSSProperties}
            aria-label={`Kunjungi ${item.label} kami`}
          >
            <div className={styles.iconWrap} aria-hidden="true">
              <item.icon size={24} className={styles.icon} />
            </div>
          </a>
        ))}
      </div>
      <div className={styles.galleryGrid}>
        {galleryImages.map((src, index) => (
          <div key={index} style={{ position: 'relative', width: '100%', aspectRatio: '1' }}>
            <Image src={src} alt={`Galeri PKKMB ${index + 1}`} fill className={styles.galleryImg} sizes="(max-width: 48em) 33vw, 20vw" />
          </div>
        ))}
      </div>
    </div>
  );
};
