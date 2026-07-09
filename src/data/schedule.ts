import { GARDA_CONFIG } from './gardaConfig';

export const timelineData = [
  {
    date: '10 - 15 Agustus 2026',
    startDate: GARDA_CONFIG.DATES.PRA_PKKMB_START,
    endDate: GARDA_CONFIG.DATES.PRA_PKKMB_END,
    title: 'Pra-PKKMB',
    details: {
      activities: [
        'Technical Meeting',
        'Pembagian Kelompok',
        'Pengambilan Atribut'
      ],
      location: 'Graha UNESA (Lidah Wetan)',
      dresscode: 'Bebas Rapi Berkerah',
      notes: 'Harap membawa perlengkapan ATK dan KTM Sementara'
    }
  },
  {
    date: '17 Agustus 2026',
    startDate: GARDA_CONFIG.DATES.UPACARA_START,
    endDate: GARDA_CONFIG.DATES.UPACARA_END,
    title: 'Upacara Kemerdekaan',
    details: {
      activities: [
        'Upacara Bendera',
        'Pengukuhan Mahasiswa Baru',
        'Simulasi Formasi Mozaik'
      ],
      location: 'Lapangan Rektorat UNESA',
      dresscode: 'Kemeja Putih, Bawahan Hitam, Dasi Hitam',
    }
  },
  {
    date: '18 - 20 Agustus 2026',
    startDate: GARDA_CONFIG.DATES.PKKMB_UNIV_START,
    endDate: GARDA_CONFIG.DATES.PKKMB_UNIV_END,
    title: 'PKKMB Universitas',
    details: {
      activities: [
        'Materi Universitas',
        'Student Fair',
        'Gelar Karya & Inovasi'
      ],
      location: 'Graha UNESA',
      dresscode: 'Kemeja Putih, Bawahan Hitam'
    }
  },
  {
    date: '21 - 22 Agustus 2026',
    startDate: GARDA_CONFIG.DATES.PKKMB_FAK_START,
    endDate: GARDA_CONFIG.DATES.PKKMB_FAK_END,
    title: 'PKKMB Fakultas',
    details: {
      activities: [
        'Materi Fakultas',
        'Pengenalan Ormawa BEM-F',
        'Tour Fakultas'
      ],
      location: 'Fakultas Masing-masing',
      dresscode: 'Kemeja Putih, Celana/Rok Hitam',
      notes: 'Ikuti panduan dari BEM Fakultas masing-masing.'
    }
  }
];
