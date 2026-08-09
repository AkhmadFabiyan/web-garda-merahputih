import { QuickAccessItem } from '../types';
import { FaCalendarAlt, FaClipboardCheck, FaPen, FaListAlt, FaFileAlt, FaQuestionCircle, FaPhone } from 'react-icons/fa';

export const quickAccessData: QuickAccessItem[] = [
  { id: 'jadwal', title: 'Jadwal', icon: FaCalendarAlt, href: '/jadwal' },
  { id: 'presensi', title: 'Presensi', icon: FaClipboardCheck, href: '/#info-garda' },
  { id: 'penugasan', title: 'Penugasan', icon: FaPen, href: '/#info-garda' },
  { id: 'pendataan', title: 'Pendataan', icon: FaListAlt, href: '/#info-garda' },
  { id: 'perizinan', title: 'Perizinan', icon: FaFileAlt, href: '/#info-garda' },
  { id: 'faq', title: 'FAQ', icon: FaQuestionCircle, href: '/faq' },
  { id: 'kontak', title: 'Kontak', icon: FaPhone, href: '/kontak' },
];
