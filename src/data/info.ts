export const infoData = [
  {
    id: 'presensi',
    title: 'Presensi',
    desc: 'Isi daftar hadir kegiatan setiap harinya',
    icon: '/assets/icons/presensi.svg',
    urgent: true,
    subItems: [
      { label: 'Pra PKKMB', link: '/#info-garda' },
      { label: 'PKKMB Pagi', link: '/#info-garda' },
      { label: 'PKKMB Siang', link: '/#info-garda' },
      { 
        label: 'Fakultas', 
        subLinks: [
          { label: 'Fakultas Ilmu Pendidikan (FIP)', link: '/#info-garda' },
          { label: 'Fakultas Bahasa dan Seni (FBS)', link: '/#info-garda' },
          { label: 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)', link: '/#info-garda' },
          { label: 'Fakultas Ilmu Sosial dan Hukum (FISH)', link: '/#info-garda' },
          { label: 'Fakultas Teknik (FT)', link: '/#info-garda' },
          { label: 'Fakultas Ilmu Keolahragaan dan Kesehatan (FIKK)', link: '/#info-garda' },
          { label: 'Fakultas Ekonomika dan Bisnis (FEB)', link: '/#info-garda' },
          { label: 'Fakultas Vokasi', link: '/#info-garda' },
          { label: 'Fakultas Kedokteran (FK)', link: '/#info-garda' }
        ]
      },
      { label: 'Universitas', link: '/#info-garda' }
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
      { label: 'Kesehatan Mental', link: 'https://bit.ly/SurveiKondisiKesehatanMental_MahasiswaUNESA' },
      { label: 'Seleksi Delegasi', link: 'https://unesa.me/SeleksiDelegasiPKKMBUnesa2026' }
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
