interface InfoSubItem {
  label: string;
  link?: string;
  subLinks?: { label: string; link: string }[];
}

interface InfoItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  urgent?: boolean;
  subItems: InfoSubItem[];
}

export const infoData: InfoItem[] = [
  {
    id: 'presensi',
    title: 'Presensi',
    desc: 'Isi daftar hadir kegiatan setiap harinya',
    icon: '/assets/icons/presensi.svg',
    urgent: true,
    subItems: [
      { label: 'Pra-PKKMB – Awal', link: 'https://forms.gle/WUk9ngfev3vmJMpQ8' },
      { label: 'Pra-PKKMB – Akhir', link: 'https://forms.gle/E76PkGAR5HHDxboF7' },
      { label: 'PKKMB – Awal', link: 'https://forms.gle/Wyb2v8qrXtq9HXJn8' },
      { label: 'PKKMB – Akhir', link: 'https://forms.gle/PqSy3hyNz24gyMiV9' }
    ]
  },
  {
    id: 'penugasan',
    title: 'Penugasan',
    desc: 'Lihat dan kumpulkan tugas Garda 2026',
    icon: '/assets/icons/penugasan.svg',
    urgent: true,
    subItems: [
      { label: 'Essay', link: 'https://unesa.me/essaygardaunesa2026' },
      { label: 'Resume Pra-PKKMB', link: 'https://unesa.me/resumeprapkkmbgardaunesa2026' },
      { label: 'Resume PKKMB', link: 'https://unesa.me/resumepkkmbgardaunesa2026' }
    ]
  },
  {
    id: 'pendataan',
    title: 'Pendataan',
    desc: 'Isi form pendataan mahasiswa baru',
    icon: '/assets/icons/pendataan.svg',
    urgent: true,
    subItems: [
      { label: 'Kesehatan Mental', link: 'https://bit.ly/SurveiKondisiKesehatanMental_MahasiswaUNESA' }
    ]
  },
  {
    id: 'perizinan',
    title: 'Perizinan',
    desc: 'Form perizinan jika berhalangan hadir',
    icon: '/assets/icons/perizinan.svg',
    subItems: [
      { label: 'Form Perizinan', link: '/#info-garda' },
      { label: 'Panduan Perizinan', link: '/#info-garda' }
    ]
  }
];
