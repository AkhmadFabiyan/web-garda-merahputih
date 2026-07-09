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
    PRESENSI: 'https://presensi.garda.unesa.ac.id',
    TWIBBON: 'https://twibbonize.com/gardaunesa2026',
    PANDUAN: 'https://unesa.ac.id/panduan-pkkmb',
    PENUGASAN: 'https://tugas.garda.unesa.ac.id',
  },

  // ==========================================
  // 📅 TIMELINE & DEADLINE (Format ISO 8601)
  // ==========================================
  DATES: {
    // Registrasi
    REGISTRASI_START: '2026-06-01T00:00:00+07:00',
    REGISTRASI_END: '2026-06-30T23:59:59+07:00',

    // Twibbon
    TWIBBON_START: '2026-07-15T00:00:00+07:00',
    TWIBBON_END: '2026-08-10T23:59:59+07:00',

    // Panduan
    PANDUAN_RELEASE: '2026-07-20T00:00:00+07:00',

    // Rangkaian PKKMB
    PRA_PKKMB_START: '2026-08-10T00:00:00+07:00',
    PRA_PKKMB_END: '2026-08-15T23:59:59+07:00',

    UPACARA_START: '2026-08-17T06:00:00+07:00',
    UPACARA_END: '2026-08-17T12:00:00+07:00',

    PKKMB_UNIV_START: '2026-08-18T06:00:00+07:00',
    PKKMB_UNIV_END: '2026-08-20T17:00:00+07:00',

    PKKMB_FAK_START: '2026-08-21T06:00:00+07:00',
    PKKMB_FAK_END: '2026-08-22T17:00:00+07:00',

    // Penugasan & Presensi Harian (Bisa ditambahkan sesuai hari)
    PRESENSI_HARI_1_START: '2026-08-15T06:00:00+07:00',
    PRESENSI_HARI_1_END: '2026-08-15T09:00:00+07:00',

    PENUGASAN_1_START: '2026-08-15T12:00:00+07:00',
    PENUGASAN_1_END: '2026-08-16T23:59:59+07:00',
  }
};
