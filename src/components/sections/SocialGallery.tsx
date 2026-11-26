import React from 'react';
import Image from 'next/image';
import { FaInstagram, FaYoutube, FaWhatsapp, FaTiktok, FaTelegram } from 'react-icons/fa';
import styles from './SocialGallery.module.css';
import { SectionTitle } from '../ui/SectionTitle';

const socialData = [
  { id: 'yt', platform: 'youtube', url: 'https://youtube.com/@username', icon: FaYoutube, color: 'var(--color-brand-primary)' },
  { id: 'ig', platform: 'instagram', url: 'https://instagram.com/username', icon: FaInstagram, color: '#E1306C' },
  { id: 'tt', platform: 'tiktok', url: 'https://tiktok.com/@username', icon: FaTiktok, color: '#000000' },
  { id: 'wa', platform: 'whatsapp', url: 'https://wa.me/628000000000', icon: FaWhatsapp, color: '#25D366' },
  { id: 'tg', platform: 'telegram', url: 'https://telegram.me/+CU1TLTL67h5iMGI1', icon: FaTelegram, color: '#0088cc' },
];

const galleryImages = [
  'https://www.unesa.ac.id/images/foto-15-01-2019-09-07-28-7836.png',
  'https://www.unesa.ac.id/files/94079914527ce5224e10e392583f173c/DJI_0328_11zon.jpg',
  'https://unesa.ac.id/images/gallery/5/b7175540e96b7bd1bbd38f1ff41df8ef.jpg'
];

export const SocialGallery = () => {
  return (
    <div className={styles.wrapper} id="galeri">
      <SectionTitle variant="label" title="IKUTI KAMI" description="Follow Social Media Garda" />
      <div className={styles.socialGrid}>
        {socialData.map(item => (
          <a 
            key={item.id} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialCard} 
            style={{ '--hover-color': item.color } as React.CSSProperties}
            aria-label={`Kunjungi ${item.platform} kami`}
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
