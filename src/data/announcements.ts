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
    title: 'Pendaftaran Pra-PKKMB Dibuka',
    content: 'Pendaftaran untuk rangkaian kegiatan Pra-PKKMB (Technical Meeting, Pembagian Kelompok, dan Pengambilan Atribut) telah dibuka. Pastikan kamu sudah mengisi form pendataan di website ini.',
    date: '2026-06-01',
    isActive: true,
    isPinned: true
  },
  {
    id: 'ann-002',
    title: 'Twibbon Resmi Tersedia',
    content: 'Twibbon resmi Garda UNESA 2026 kini telah tersedia di menu Twibbon. Segera unduh dan pasang twibbon di media sosialmu sebelum acara dimulai.',
    date: '2026-06-05',
    isActive: true,
    isPinned: true
  },
  {
    id: 'ann-003',
    title: 'Form Penugasan Tahap 1 Dibuka',
    content: 'Form penugasan tahap pertama kini sudah dibuka di menu Penugasan. Kerjakan dan kumpulkan tepat waktu untuk menghindari sanksi.',
    date: '2026-06-10',
    isActive: true
  },
  {
    id: 'ann-004',
    title: 'Informasi Dresscode Hari Pertama',
    content: 'Dresscode untuk Upacara Kemerdekaan 17 Agustus 2026 adalah pakaian putih-putih (atasan putih, bawahan putih). Pastikan kamu mempersiapkan pakaian sesuai ketentuan.',
    date: '2026-06-12',
    isActive: true
  }
];


