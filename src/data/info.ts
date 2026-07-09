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
      { label: 'Key Of Garda', link: '/#info-garda' },
      { label: 'Penugasan Garda', link: '/#info-garda' },
      { label: 'Pengumpulan Tugas', link: '/#info-garda' },
      { label: 'Panduan Penugasan', link: '/#info-garda' }
    ]
  },
  {
    id: 'pendataan',
    title: 'Pendataan',
    desc: 'Isi form pendataan mahasiswa baru',
    icon: '/assets/icons/pendataan.svg',
    urgent: true,
    subItems: [
      { label: 'Mahasiswa Baru', link: '/#info-garda' },
      { label: 'Kelompok', link: '/#info-garda' },
      { label: 'Fakultas', link: '/#info-garda' }
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
  },
  {
    id: 'twibbon',
    title: 'Twibbon',
    desc: 'Unduh twibbon resmi Garda UNESA 2026',
    icon: '/assets/icons/twibbon.svg',
    subItems: [
      { label: 'Download Twibbon', link: '/#info-garda' },
      { label: 'Panduan Twibbon', link: '/#info-garda' }
    ]
  }
];
