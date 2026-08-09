export interface AnnouncementEntry {
  id: string;
  title: string;
  content: string;
  date: string; // ISO date string
  isActive: boolean;
  isPinned?: boolean;
}

export const announcements: AnnouncementEntry[] = [
  {
    id: 'ann-001',
    title: 'Sosialisasi PKKMB UNESA',
    content: 'Saksikan Sosialisasi PKKMB UNESA 2026 pada tanggal 7 Agustus 2026 melalui siaran langsung di YouTube.',
    date: '2026-08-06',
    isActive: true,
    isPinned: true
  }
];


