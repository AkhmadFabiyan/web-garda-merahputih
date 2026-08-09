import { GARDA_CONFIG } from './gardaConfig';

export interface LinkMatch {
  name: string;
  url: string;
  message: string;
}

export function findLinkByKeyword(message: string): LinkMatch | null {
  const msg = message.toLowerCase();

  // Presensi / absen
  if (/presensi|absen/.test(msg)) {
    return {
      name: 'Portal Presensi Garda',
      url: GARDA_CONFIG.LINKS.PRESENSI,
      message: 'Kamu bisa melakukan presensi melalui portal resmi berikut:'
    };
  }


  // Penugasan / tugas
  if (/penugasan|kumpul.*tugas|submit.*tugas|form.*tugas/.test(msg)) {
    return {
      name: 'Portal Penugasan',
      url: GARDA_CONFIG.LINKS.PENUGASAN,
      message: 'Detail penugasan dan form pengumpulan tugas ada di sini:'
    };
  }

  // Panduan / buku / peraturan
  if (/panduan|buku\s+panduan|peraturan\s+lengkap/.test(msg)) {
    return {
      name: 'Buku Panduan PKKMB',
      url: GARDA_CONFIG.LINKS.PANDUAN,
      message: 'Panduan lengkap PKKMB Garda UNESA 2026 bisa kamu baca di sini:'
    };
  }

  // Jadwal lengkap
  if (/jadwal\s+lengkap|lihat\s+jadwal|semua\s+jadwal/.test(msg)) {
    return {
      name: 'Halaman Jadwal',
      url: '/jadwal',
      message: 'Kamu bisa lihat jadwal lengkap Garda UNESA 2026 di halaman Jadwal:'
    };
  }

  // Pengumuman
  if (/pengumuman\s+terbaru|info\s+terbaru|update\s+terbaru/.test(msg)) {
    return {
      name: 'Halaman Pengumuman',
      url: '/pengumuman',
      message: 'Cek pengumuman terbaru dari panitia di sini:'
    };
  }

  // Perizinan / izin
  if (/form\s+izin|link\s+izin|perizinan/.test(msg)) {
    return {
      name: 'Form Perizinan',
      url: '/info',
      message: 'Untuk mengisi form perizinan, gunakan link resmi berikut:'
    };
  }

  // Syarat dan ketentuan
  if (/syarat\s+ketentuan|s&k|syarat\s+dan\s+ketentuan/.test(msg)) {
    return {
      name: 'Syarat & Ketentuan',
      url: '/syarat-ketentuan',
      message: 'Baca syarat & ketentuan lengkap Garda UNESA 2026 di sini:'
    };
  }

  // FAQ / pertanyaan umum
  if (/faq|pertanyaan\s+umum|pertanyaan\s+yang\s+sering/.test(msg)) {
    return {
      name: 'Halaman Info Garda',
      url: '/#info-garda',
      message: 'Kamu bisa cek pertanyaan umum seputar Garda di halaman ini:'
    };
  }

  // Contact person (redirect ke fitur CP di website)
  if (/daftar\s+cp|semua\s+cp|list\s+cp|cp\s+semua\s+fakultas/.test(msg)) {
    return {
      name: 'Halaman Kontak',
      url: '/kontak',
      message: 'Daftar lengkap Contact Person semua fakultas ada di sini:'
    };
  }

  return null;
}
