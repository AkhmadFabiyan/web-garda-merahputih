import { GARDA_CONFIG } from './gardaConfig';

export interface TimelineItem {
  date: string;
  startDate: string;
  endDate: string;
  title: string;
  details: {
    activities: string[];
    location: string;
    dresscode: string;
    notes?: string;
  };
}

export const timelineData: TimelineItem[] = [
  {
    date: '14 Agustus 2026',
    startDate: GARDA_CONFIG.DATES.PRA_PKKMB_START,
    endDate: GARDA_CONFIG.DATES.PRA_PKKMB_END,
    title: 'Pra-PKKMB',
    details: {
      activities: [
        '08.00 WIB - Selesai'
      ],
      location: 'Daring melalui Live YouTube Mawal UNESA & Zoom Meeting',
      dresscode: 'Bebas Rapi',
    }
  },
  {
    date: '17 Agustus 2026',
    startDate: GARDA_CONFIG.DATES.UPACARA_START,
    endDate: GARDA_CONFIG.DATES.UPACARA_END,
    title: 'D-Day PKKMB (Opening Ceremony)',
    details: {
      activities: [
        '06.00 - 08.30 WIB: Opening Ceremony'
      ],
      location: 'Lapangan Rektorat UNESA',
      dresscode: `Dresscode Putra:
- Kemeja putih lengan panjang (berkerah & bersaku), celana kain formal warna hitam, ikat pinggang hitam, dan dasi resmi UNESA.
- Sepatu pantofel hitam dengan kaos kaki hitam polos.
- Topi Hitam (dari panitia GARDA), tas punggung/ransel rapi, scarf/slayer penanda fakultas, serta wajib membawa Jas Almamater UNESA.
- Rambut rapi, pendek, dan tidak diwarnai.

Dresscode Putri:
- Kemeja putih lengan panjang (berkerah & bersaku), rok kain formal warna hitam (model A-Line), ikat pinggang hitam, dan dasi resmi UNESA.
- Sepatu pantofel hitam dengan kaos kaki putih polos.
- Hijab memakai segi empat warna hitam polos. Bagi yang non-hijab, rambut hitam rapi dan wajib memakai hair-net.
- Topi Hitam (dari panitia GARDA), tas punggung/ransel rapi, scarf/slayer penanda fakultas, serta wajib membawa Jas Almamater UNESA.`,
    }
  },
  {
    date: '17 Agustus 2026',
    startDate: GARDA_CONFIG.DATES.UPACARA_START,
    endDate: GARDA_CONFIG.DATES.UPACARA_END,
    title: 'D-Day PKKMB (Welcoming Party)',
    details: {
      activities: [
        '08.00 WIB - Selesai'
      ],
      location: 'Graha Sawunggaling UNESA',
      dresscode: `Dresscode Putra:
- Kemeja putih lengan panjang (berkerah & bersaku), celana blue jeans rapi, dan ikat pinggang warna hitam.
- Sepatu pantofel hitam dengan kaos kaki putih polos.
- Wajib memakai Jas Almamater UNESA, menggunakan scarf penanda dari panitia, dan tas punggung/ransel rapi.
- Rambut rapi, pendek, dan tidak diwarnai.

Dresscode Putri:
- Kemeja putih lengan panjang (berkerah & bersaku), celana blue jeans rapi, dan ikat pinggang warna hitam.
- Sepatu pantofel hitam dengan kaos kaki putih polos.
- Hijab memakai segi empat warna hitam polos. Bagi yang non-hijab, rambut hitam rapi dan menggunakan hair-net.
- Wajib memakai Jas Almamater UNESA, menggunakan scarf penanda dari panitia, dan tas punggung/ransel rapi.`,
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
