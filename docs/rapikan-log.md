# Log /rapikan

| Tanggal | Area | Status | Sisa usulan |
|---|---|---|---|
| 2026-11-26 | Inventaris + bersih-bersih repo | selesai | lihat `docs/rapikan-inventaris.md` |
| 2026-11-26 | `src/app/api/click` + dependency | selesai | `next-pwa` masih bawa 5 celah (build-time, perlu ganti/upgrade plugin); `/faq` tidak melacak klik; `x-forwarded-for` bisa dipalsukan untuk lolos rate limit (juga di `/api/garda`) |

Self-check `/api/click`: `scripts/check-click-api.mjs` (cara pakai di kepala file).
