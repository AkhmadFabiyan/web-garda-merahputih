import type { IconType } from 'react-icons';
import { FaInstagram, FaTiktok, FaYoutube, FaWhatsapp, FaTelegram } from 'react-icons/fa';

/** Official Garda UNESA social accounts. Used by the footer and the "Ikuti Kami" section. */
export const socialLinks: { id: string; label: string; url: string; icon: IconType; color: string }[] = [
  { id: 'yt', label: 'YouTube', url: 'https://www.youtube.com/@pkkmbgardaunesa', icon: FaYoutube, color: 'var(--color-brand-primary)' },
  { id: 'ig', label: 'Instagram', url: 'https://www.instagram.com/gardaunesa.26/', icon: FaInstagram, color: '#E1306C' },
  { id: 'tt', label: 'TikTok', url: 'https://www.tiktok.com/@pkkmbgardaunesa', icon: FaTiktok, color: '#000000' },
  { id: 'wa', label: 'WhatsApp', url: 'https://whatsapp.com/channel/0029Vb8CO8wDTkK2jfGtxq37', icon: FaWhatsapp, color: '#25D366' },
  { id: 'tg', label: 'Telegram', url: 'https://telegram.me/+CU1TLTL67h5iMGI1', icon: FaTelegram, color: '#0088cc' },
];
