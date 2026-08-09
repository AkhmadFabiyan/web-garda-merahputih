/**
 * GARDA UNESA 2026 - MASTER CONFIGURATION
 * 
 * Atur semua Link, Tanggal, dan Deadline di sini.
 * Sistem AI dan Website akan otomatis menyesuaikan diri.
 */

export const GARDA_CONFIG = {
  // ==========================================
  // 🔗 LINK REGISTRY (Pusat Tautan Garda)
  // ==========================================
  LINKS: {
    PRESENSI: '#',

    PANDUAN: 'https://drive.google.com/file/d/1Pcc50cNRgDZlsmsuyzs8sl9njBxYnhs_/view?usp=drivesdk',
    PENUGASAN: '#',
  },

  // ==========================================
  // 📅 TIMELINE & DEADLINE (Format ISO 8601)
  // ==========================================
  DATES: {
    // Registrasi
    REGISTRASI_START: '2026-06-01T00:00:00+07:00',
    REGISTRASI_END: '2026-06-30T23:59:59+07:00',


    // Panduan
    PANDUAN_RELEASE: '2026-07-20T00:00:00+07:00',

    // Rangkaian PKKMB
    PRA_PKKMB_START: '2026-08-14T08:00:00+07:00',
    PRA_PKKMB_END: '2026-08-14T16:30:00+07:00',

    UPACARA_START: '2026-08-17T06:00:00+07:00',
    UPACARA_END: '2026-08-17T16:30:00+07:00',

    PKKMB_UNIV_START: '2026-08-18T07:00:00+07:00',
    PKKMB_UNIV_END: '2026-08-18T16:30:00+07:00',

    PKKMB_FAK_START: '2026-08-18T07:00:00+07:00',
    PKKMB_FAK_END: '2026-08-21T16:30:00+07:00',

    // Penugasan & Presensi Harian (Bisa ditambahkan sesuai hari)
    PRESENSI_HARI_1_START: '2026-08-15T06:00:00+07:00',
    PRESENSI_HARI_1_END: '2026-08-15T09:00:00+07:00',

    PENUGASAN_1_START: '2026-08-15T12:00:00+07:00',
    PENUGASAN_1_END: '2026-08-16T23:59:59+07:00',
  }
};
