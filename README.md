# Garda UNESA 2026 🎓✨

Selamat datang di repositori resmi **Garda UNESA 2026** (Pengenalan Kehidupan Kampus Mahasiswa Baru Universitas Negeri Surabaya). Proyek ini merupakan platform informasi dan asisten cerdas yang dirancang khusus untuk mendampingi mahasiswa baru UNESA angkatan 2026 dengan tema *"Jayantara Nuswantara"*.

## 🌟 Fitur Utama

- **🤖 Gara AI Assistant**: Chatbot cerdas terintegrasi yang siap menjawab pertanyaan seputar jadwal, presensi, tugas, dan kontak PKKMB. Dilengkapi dengan arsitektur *Dual-Provider* (OpenRouter & Gemini Direct API) yang anti-*hallucination* dan anti-lemot.
- **📚 FAQ & Panduan**: Direktori interaktif Pertanyaan yang Sering Diajukan, memandu Maba melewati masa orientasi tanpa bingung.
- **📞 Direktori Contact Person (CP)**: Akses cepat ke narahubung/kakak tingkat dari setiap fakultas (FIP, FMIPA, FEB, FBS, FISIPOL, FT).
- **📱 Responsive & Premium UI**: Dibangun dengan *glassmorphism*, mikro-animasi halus, dan tipografi modern yang responsif di segala ukuran layar.

## 🛠️ Tech Stack

Platform ini dibangun menggunakan teknologi web modern:
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS (CSS Modules)
- **AI Integration**: Google Gemini Direct & OpenRouter API

## 🚀 Memulai (Getting Started)

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek secara lokal:

### 1. Kebutuhan Sistem
- Node.js versi 18.17 atau lebih baru
- npm, yarn, pnpm, atau bun

### 2. Instalasi
Clone repositori ini dan instal semua dependensi:
```bash
git clone https://github.com/AkhmadFabiyan/garda2026merahputih.git
cd garda2026merahputih
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env.local` di root direktori dan tambahkan API keys untuk menjalankan AI Assistant (Gara). (Hubungi tim pengembang jika Anda tidak memiliki *key* ini).
```env
# OpenRouter API (Primary Load Balancer)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx

# Google Gemini API (Direct Fallback)
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxx
```

### 4. Jalankan Server Development
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

## 📂 Struktur Proyek Utama

- `src/app/` - Konfigurasi rute (App Router) dan halaman utama.
- `src/components/` - Komponen React yang dapat digunakan ulang (UI button, modal, cards).
- `src/components/features/garda/` - Komponen khusus untuk Gara AI Assistant (Chat, Message, Widget).
- `src/lib/ai/` - Logika *backend* dan perlindungan anti-*hallucination* untuk Gara AI.
- `src/data/` - Data statis (FAQ, daftar Kontak, Jadwal).

## 📝 Catatan Pembaruan (Changelog)
Untuk melihat riwayat pembaruan sistem dan perbaikan UI/UX terbaru (termasuk audit AI dan responsivitas), silakan cek file [CHANGELOG.md](./CHANGELOG.md).
