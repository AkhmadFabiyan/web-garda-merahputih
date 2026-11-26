import { QuickAccessItem } from '../types';
import { FaCalendarAlt, FaClipboardCheck, FaPen, FaListAlt, FaFileAlt, FaQuestionCircle, FaPhone, FaBook, FaImage } from 'react-icons/fa';
import { GARDA_CONFIG } from './gardaConfig';

export const quickAccessData: QuickAccessItem[] = [
  { id: 'jadwal', title: 'Jadwal', icon: FaCalendarAlt, href: '/jadwal' },
  { id: 'panduan', title: 'Panduan', icon: FaBook, href: GARDA_CONFIG.LINKS.PANDUAN },
  { id: 'presensi', title: 'Presensi', icon: FaClipboardCheck, href: '/#info-garda' },
  { id: 'penugasan', title: 'Penugasan', icon: FaPen, href: '/#info-garda' },
  { id: 'twibbon', title: 'Twibbon', icon: FaImage, href: 'https://drive.google.com/drive/u/0/folders/1TeFh6gCekKeNfX8RBSdK3G3T2Gp4pGrO' },
  { id: 'perizinan', title: 'Perizinan', icon: FaFileAlt, href: '/#info-garda' },
  { id: 'faq', title: 'FAQ', icon: FaQuestionCircle, href: '/faq' },
  { id: 'kontak', title: 'Kontak', icon: FaPhone, href: '/kontak' },
];
