import { GARDA_CONFIG } from './gardaConfig';
import { infoData } from './info';

export interface LinkMatch {
  name: string;
  url: string;
  message: string;
}

// Pertanyaan yang memang meminta link/tempat/cara, bukan "kapan deadline" atau "kalau telat".
const ASKS_FOR_LINK = /\b(link|form|formulir|portal|url|web|website|dimana|di\s+mana|mana|buka|dibuka|kumpul|dikumpul|pengumpulan|submit|upload|unggah)\b/;

function infoLinks(id: string): string {
  const item = infoData.find((i) => i.id === id);
  return item ? item.subItems.filter((s) => s.link).map((s) => `• [${s.label}](${s.link})`).join('\n') : '';
}

export function findLinkByKeyword(message: string): LinkMatch | null {
  const msg = message.toLowerCase();
  const asksLink = ASKS_FOR_LINK.test(msg);

  // Presensi / absen — link form resmi dari info.ts
  if (/presensi|absen|daftar\s+hadir/.test(msg) && (asksLink || /\b(cara|isi|ngisi|mengisi)\b/.test(msg)) && !/telat|terlambat/.test(msg)) {
    return {
      name: 'Info Garda',
      url: '/#info-garda',
      message: `Presensi diisi setiap hari kegiatan. Ada form Awal dan Akhir untuk Pra-PKKMB dan PKKMB 📝\n\n${infoLinks('presensi')}`,
    };
  }

  // Penugasan / tugas — link pengumpulan dari info.ts + folder panduan tugas
  if (/penugasan|tugas|esai|essay|resume/.test(msg) && asksLink && !/deadline|kapan/.test(msg)) {
    return {
      name: 'Folder Penugasan',
      url: GARDA_CONFIG.LINKS.PENUGASAN,
      message: `Ini link pengumpulan tugas Garda 2026 (wajib pakai email UNESA) 📚\n\n${infoLinks('penugasan')}\n\nDetail ketentuan tugas ada di folder penugasan:`,
    };
  }

  // Pendataan / survei kesehatan mental
  if (/pendataan|survei|survey|kesehatan\s+mental/.test(msg)) {
    return {
      name: 'Info Garda',
      url: '/#info-garda',
      message: `Ini form pendataan mahasiswa baru:\n\n${infoLinks('pendataan')}`,
    };
  }

  // Panduan / buku / peraturan
  if (/panduan|guide\s?book|buku\s+panduan|peraturan\s+lengkap/.test(msg)) {
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

  // Perizinan / izin
  if (/(form|link|formulir)\s+(izin|perizinan)|perizinan/.test(msg) && asksLink) {
    return {
      name: 'Form Perizinan',
      url: '/#info-garda',
      message: 'Form dan panduan perizinan ada di bagian Info Garda. Kalau perlu izin saat kegiatan berlangsung, tetap lapor ke fasilitator kelompokmu ya:'
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
  if (/\bfaq\b|pertanyaan\s+umum|pertanyaan\s+yang\s+sering/.test(msg)) {
    return {
      name: 'Halaman FAQ',
      url: '/faq',
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
