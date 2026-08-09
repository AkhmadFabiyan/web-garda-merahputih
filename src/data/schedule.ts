import { GARDA_CONFIG } from './gardaConfig';

export const timelineData = [
  {
    date: '14 Agustus 2026',
    startDate: GARDA_CONFIG.DATES.PRA_PKKMB_START,
    endDate: GARDA_CONFIG.DATES.PRA_PKKMB_END,
    title: 'Pra-PKKMB (Online)',
    details: {
      activities: [
        '08.00–Selesai WIB: Pelaksanaan Pra-PKKMB'
      ],
      location: 'Online (YouTube dan Zoom)',
      dresscode: 'Bebas Rapi',
      notes: 'Pastikan koneksi internet stabil dan perangkat siap.'
    }
  },
  {
    date: '17 Agustus 2026',
    startDate: GARDA_CONFIG.DATES.UPACARA_START,
    endDate: GARDA_CONFIG.DATES.UPACARA_END,
    title: 'Pembukaan PKKMB (Blended/Hybrid)',
    details: {
      activities: [
        '06.00–08.30 WIB: Opening Ceremony di Lapangan Rektorat UNESA',
        '08.00–Selesai WIB: Welcoming Party di Graha Sawunggaling UNESA'
      ],
      location: 'Halaman Rektorat & Graha Sawunggaling',
      dresscode: 'Sesuai ketentuan',
      notes: 'Bagi peserta offline, harap datang tepat waktu.'
    }
  },
  {
    date: '18 - 21 Agustus 2026',
    startDate: GARDA_CONFIG.DATES.PKKMB_FAK_START,
    endDate: GARDA_CONFIG.DATES.PKKMB_FAK_END,
    title: 'Pelaksanaan PKKMB (Blended/Hybrid)',
    details: {
      activities: [
        'Waktu Menyesuaikan: Pelaksanaan PKKMB'
      ],
      location: 'Fakultas Masing-masing',
      dresscode: 'Sesuai ketentuan fakultas',
      notes: 'Ikuti panduan spesifik dari BEM Fakultas masing-masing.'
    }
  }
];
