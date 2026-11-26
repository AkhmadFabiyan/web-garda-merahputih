# Inventaris /rapikan — 2026-11-26

Hasil langkah 0 `/rapikan` (tanpa argumen). Urutan dari yang paling berisiko.

| # | Area | File utama | Temuan | Risiko |
|---|---|---|---|---|
| 1 | Dependency | `package.json` | `npm audit --omit=dev`: 15 celah (1 critical, 9 high, 5 moderate). `next` 16.2.9 critical, bisa diperbaiki ke 16.4.6. `@ducanh2912/next-pwa` minta downgrade major ke 10.2.6. | Tinggi |
| 2 | API klik | `src/app/api/click/route.ts` | Tanpa rate limit. `id` tidak divalidasi terhadap daftar FAQ/kontak, jadi siapa pun bisa mengisi Redis dengan anggota sembarang dan mengubah urutan FAQ/kontak. | Tinggi |
| 3 | API + chatbot Garda | `src/app/api/garda/route.ts` (376 baris), `src/lib/ai/*` | Ada rate limit dan validasi. Route terbesar di proyek dan memegang banyak tanggung jawab sekaligus. `logger.ts` menulis `garda-questions.log` ke root proyek (berisi pertanyaan pengguna). | Sedang |
| 4 | Widget chat | `GardaChat.tsx` (366), `GardaMessage.tsx` (211) | Komponen besar, perlu dicek apakah ada duplikasi dan state yang bisa dipisah. | Sedang |
| 5 | Layout | `src/app/layout.tsx` | 3× `dangerouslySetInnerHTML` (baris 96, 110, 132). Perlu dicek apakah isinya statis. | Perlu dicek |
| 6 | Hardcode URL | `src/**` | `https://garda.unesa.ac.id` muncul 5×, link LinkedIn 3×, `wa.me/62` 3×. Kandidat untuk dipindah ke `src/config` atau `GARDA_CONFIG`. | Rendah |
| 7 | A11y / UI | `A11yWidget.tsx` (236), `Schedule.tsx` (176), `Navbar.tsx` | Cek responsif dan klik di browser belum dilakukan. | Rendah |
| 8 | Aset | `public/logos/jayantara.jpg` | Isinya PNG 783 KB tapi berekstensi `.jpg`. Logo dengan ukuran 828×828 bisa dibuat jauh lebih kecil. | Rendah |

**Catatan proyek:**
- Belum ada tes (tidak ada script `test`). Baseline langkah 1 cuma `tsc --noEmit` (lulus) dan `npm run build`.
- `npx tsc --noEmit`: bersih.
- Perintah `/rapikan` ditulis untuk Laravel/Filament. Di proyek Next.js ini, `app/`, `resources/` dipetakan ke `src/`, dan cek khusus PHP dilewati.

**Bersih-bersih yang sudah dilakukan:**
- Dipindah ke Recycle Bin: `diff.patch`, `my_backup.patch`, `jayantara.jpg` (di root).
- Masuk `.gitignore` dan dilepas dari git (file lokal tetap ada): `garda-questions.log`, `public/sw.js`, `public/workbox-*.js`, `public/fallback-*.js`, `public/swe-worker-*.js`.

**Usulan urutan:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
