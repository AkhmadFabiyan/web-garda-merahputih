# Log /rapikan

| Tanggal | Area | Status | Sisa usulan |
|---|---|---|---|
| 2026-11-26 | Inventaris + bersih-bersih repo | selesai | lihat `docs/rapikan-inventaris.md` |
| 2026-11-26 | `src/app/api/click` + dependency | selesai | `next-pwa` masih bawa 5 celah (build-time, perlu ganti/upgrade plugin); `/faq` tidak melacak klik; `x-forwarded-for` bisa dipalsukan untuk lolos rate limit (juga di `/api/garda`) |
| 2026-11-26 | Seluruh CSS: `UI_UX_RULES.md` (tanpa px, token tipe/spasi, responsif) | sebagian | Breakpoint belum mobile-first 5 titik; container query belum dipakai; warna hex mentah belum jadi token. Lihat `UI_UX_RULES.md` Lampiran A |
| 2026-11-26 | Perbaikan tata letak pasca-konversi + arah visual Prasasti Nuswantara | selesai | Galeri "Ikuti Kami" masih rusak (gambar unesa.ac.id 403); kartu jadwal berstatus selesai masih bernuansa hijau penuh; foto kegiatan asli belum ada |
| 2026-11-26 | Arah "Garda Bergerak": palet & hero asli, Fraunces + Plus Jakarta Sans, sistem gerak (reveal, hero, ✦), Peta Perjalanan baru | selesai | Prasasti dibatalkan atas permintaan pengguna. Galeri "Ikuti Kami" masih rusak (gambar unesa.ac.id 403) |

Self-check `/api/click`: `scripts/check-click-api.mjs` (cara pakai di kepala file).
Sweep responsif: `scripts/responsive-sweep.js` (tempel di console browser, lihat `UI_UX_RULES.md` 2.6).
