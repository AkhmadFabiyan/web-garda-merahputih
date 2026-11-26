# Aturan UI/UX — web-garda-merput

Versi: **1.0** (2026-11-26). Stack: Next.js 16 + CSS Modules (tanpa Tailwind).

Turunan dari `D:/Coding/_kit/UI_UX_RULES.md` (v1.11.0), disesuaikan untuk proyek ini dengan tiga target yang tidak bisa ditawar:

1. **Responsif di semua ukuran layar tanpa kecuali.** Bukan hanya HP, tablet, dan desktop, tapi juga setiap lebar dan tinggi di antaranya, layar lipat, layar ultrawide, zoom 400%, dan ukuran font sistem 200%.
2. **Tanpa px.** Semua ukuran memakai satuan relatif, supaya tampilan ikut setelan font dan zoom pengguna.
3. **Ukuran yang enak dipandang.** Skala tipografi dan spasi yang terukur, bukan nilai acak.

Hal yang tidak diatur di sini (alur, microcopy, performa, animasi) tetap mengikuti kit. Penyimpangan dari file ini dicatat di `docs/rapikan-log.md` beserta alasannya.

> **Patokan:** 1rem = ukuran font bawaan browser, biasanya 16px. Angka px di dokumen ini hanya keterangan untuk mengisi DevTools, bukan nilai di kode.

---

## 1. Satuan

### 1.1 Satuan yang dipakai

| Kebutuhan | Satuan | Contoh |
|---|---|---|
| Ukuran font | `rem` atau token `--step-*` | `font-size: var(--step-0)` |
| Spasi (padding, margin, gap) | `rem` atau token `--space-*` | `gap: var(--space-4)` |
| Spasi yang menempel ke teks (ikon di tombol, padding badge) | `em` | `padding: 0.25em 0.75em` |
| `letter-spacing` | `em` | `letter-spacing: 0.02em` |
| Lebar blok teks | `ch` | `max-inline-size: 65ch` |
| Lebar layout | `%`, `fr`, `min()`, `clamp()` | `inline-size: min(100% - 2 * var(--gutter), 75rem)` |
| Tinggi layar | `dvh` / `svh` | `min-block-size: 100svh` |
| Ukuran mengikuti wadah | `cqi` (container query) | `font-size: clamp(var(--step-0), 4cqi, var(--step-2))` |
| Breakpoint media query | `em` | `@media (width >= 48em)` |
| Border | keyword `thin` atau `rem` | `border: thin solid var(--color-border)` |
| Radius, bayangan, blur | `rem` / `em` | `box-shadow: 0 0.25rem 1rem …` |
| `line-height` | tanpa satuan | `line-height: 1.6` |

### 1.2 Larangan

- **Dilarang `px`** di `.css`, `.module.css`, dan `style={{ }}` di `.tsx`.
- **Dilarang mengubah `font-size` di `html` / `:root`.** Kalau diubah, `rem` tidak lagi mengikuti setelan pengguna.
- **Dilarang `100vh` dan `100vw`.**
  - `100vh` tertutup bar browser di HP. Gantinya `100dvh` untuk elemen yang ingin selalu pas layar, atau `100svh` untuk hero.
  - `100vw` ikut menghitung lebar scrollbar, sehingga halaman bisa scroll ke samping. Gantinya `100%`.
- **Dilarang inline style untuk ukuran** (`fontSize: '11px'`). Pindahkan ke CSS Module.

### 1.3 Pengecualian yang sah

- `next/image` prop `width`/`height` berupa angka. Ini rasio intrinsik gambar, bukan ukuran tampilan.
- Atribut `sizes` di gambar memakai `vw` dan `rem`, misalnya `sizes="(width >= 48em) 20rem, 100vw"`.
- `console.log` bergaya (seperti di `layout.tsx`). Tidak tampil di UI.
- Prop dinamis yang diteruskan sebagai `style`, misalnya `minHeight` di `RenderOnScroll`. Nilainya tetap `rem`/`svh`, bukan px.

**Cek otomatis.** Hasilnya harus kosong, kecuali baris atribut `sizes=` di gambar:

```powershell
git grep -nE "[0-9.]+px" -- "src/*.css" "src/*.tsx" ":!src/app/layout.tsx"
```

```powershell
git grep -nE "100vh|100vw" -- "src/*.css" "src/*.tsx"
```

---

## 2. Responsif di semua ukuran layar

### 2.1 Rentang yang wajib didukung

Halaman harus benar di **setiap** lebar dalam rentang ini, bukan hanya di titik breakpoint.

| Kelas | Lebar | ≈ px (untuk DevTools) | Catatan |
|---|---|---|---|
| Batas aman tersempit | 17.5–20rem | 280–319 | Preset "Galaxy Fold" di Chrome DevTools, juga HP dengan zoom tampilan besar. Tidak boleh ada yang terpotong |
| HP kecil | 20–22.5rem | 320–359 | Batas reflow WCAG (zoom 400%) |
| HP umum | 22.5–27rem | 360–430 | |
| HP landscape | tinggi 16–28rem | tinggi 256–450 | Tinggi sempit. Header sticky + chat tidak boleh menutup layar |
| HP lipat terbuka / tablet kecil | 37.5–52.5rem | 600–840 | Rasio hampir kotak |
| Tablet | 48–64rem | 768–1024 | Portrait dan landscape |
| Laptop | 64–90rem | 1024–1440 | |
| Desktop lebar | 90–120rem | 1440–1920 | |
| 2K / 4K / ultrawide | 120–240rem | 1920–3840 | Latar tetap penuh, isi tidak melar (2.4) |

### 2.2 Urutan alat (pakai yang paling atas dulu)

1. **Layout intrinsik, tanpa breakpoint.** Kalau bisa selesai di sini, berhenti di sini.
   - Grid kartu: `grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr))`. Jumlah kolom menyesuaikan sendiri dari 280px sampai 4K.
   - Deretan tombol atau chip: `display: flex; flex-wrap: wrap; gap: var(--space-3)`.
   - Dua kolom yang turun jadi satu: `flex-wrap: wrap` dengan `flex: 1 1 20rem` di tiap kolom.
   - Ukuran dan spasi cair: token `--step-*` dan `--space-*` (bagian 3), yang sudah memakai `clamp()`.
2. **Container query** untuk komponen yang dipakai di wadah berbeda lebar, misalnya kartu, widget chat, atau footer kolom. Komponen menyesuaikan wadahnya, bukan layarnya.
   ```css
   .cardWrap { container-type: inline-size; }
   @container (inline-size >= 30em) { .card { grid-template-columns: 8rem 1fr; } }
   ```
3. **Media query `em`, mobile-first**, hanya untuk perubahan tingkat halaman (navbar jadi menu, sidebar muncul). Maksimal lima titik, dan dipakai seragam di semua file:
   | Token | Nilai | ≈ px |
   |---|---|---|
   | sm | `30em` | 480 |
   | md | `48em` | 768 |
   | lg | `64em` | 1024 |
   | xl | `80em` | 1280 |
   | 2xl | `120em` | 1920 |

   Tulis dengan sintaks range: `@media (width >= 48em)`. Gaya dasar untuk layar sempit, lalu ditambah ke atas. `max-width` hanya untuk pengecualian.
4. **Media query tinggi** untuk layar pendek: `@media (height < 30em)` untuk melepas sticky dan memperkecil hero di HP landscape.

### 2.3 Aturan wajib

- **Halaman tidak pernah scroll ke samping** di lebar apa pun. Yang boleh scroll samping hanya wadahnya sendiri (tabel, carousel, chip aksi cepat chat), dengan `overflow-x: auto`.
- **Tinggi tidak dikunci untuk elemen berisi teks.** Pakai `min-block-size`, jangan `height`. Teks harus tetap muat saat font pengguna 200%.
- **Teks panjang tidak boleh mendorong layout.** Email, URL, dan nomor HP memakai `overflow-wrap: anywhere`.
- **Gambar dan video**: `max-inline-size: 100%; block-size: auto`, atau `aspect-ratio` + `object-fit: cover`.
- **Judul**: `text-wrap: balance`. **Paragraf**: `text-wrap: pretty`, yang belum didukung Firefox. Aman dipakai karena browser yang tidak mendukung cukup mengabaikannya.
- **Fitur CSS yang boleh dipakai tanpa fallback** (status *Baseline Widely available*, per November 2026): container query dan satuan `cqi`, `dvh`/`svh`/`lvh`, `clamp()`/`min()`/`max()`, sintaks range media query, `:has()`, subgrid, `text-wrap: balance`, `prefers-reduced-motion`, `prefers-contrast`, dan `forced-colors`.
- **Elemen menempel tepi** (tombol Tanya Gara, Back to top, A11y, navbar) memakai `env(safe-area-inset-*)`, dan viewport diberi `viewport-fit=cover`.
- **Modal dan chat**: `max-block-size: calc(100dvh - 2 * var(--space-4))` dan `inline-size: min(100%, 26.25rem)`. Di layar sempit, modal menjadi hampir layar penuh.
- **Zoom tidak dikunci**: dilarang `user-scalable=no` dan `maximum-scale=1`.
- **Orientasi tidak dikunci**, dan tidak ada pesan "putar HP Anda".

### 2.4 Lebar isi di layar besar

- **Latar section** (hero, footer, banner) selalu penuh sampai tepi layar.
- **Isi** dibungkus wadah dengan lebar `min(100% - 2 * var(--gutter), 75rem)` dan `margin-inline: auto`. Di 2K/4K, wadah boleh melebar ke `90rem` untuk grid kartu dan galeri, supaya kolomnya bertambah, bukan cuma ruang kosongnya.
- **Paragraf** maksimal `65ch`.
- Di layar ≥ 120em, jangan memperbesar elemen sampai janggal. Tambah kolom atau biarkan latar yang mengisi.

### 2.5 Input dan sentuhan

- **Target sentuh** minimal `2.75rem × 2.75rem` (≈ 44px). Ini setara WCAG AAA dan ukuran default kontrol iOS, lebih ketat dari WCAG AA (24px). Tombol utama di HP sebaiknya `3rem` (≈ 48px, rekomendasi Android). Ikon kecil boleh terlihat kecil, asal area kliknya diperbesar dengan padding.
- **Gaya mengikuti kemampuan input, bukan lebar layar.** Hover hanya di `@media (hover: hover)`, dan target diperbesar di `@media (pointer: coarse)`.
- **Teks input** minimal `1rem`, supaya Safari iOS tidak auto-zoom.
- **Setiap gestur ada tombolnya**: carousel punya tombol prev/next, dan chip yang bisa di-swipe tetap bisa diklik.

### 2.6 Wajib diuji

Sebelum halaman dianggap selesai, cek di DevTools pada lebar berikut (dalam px, karena DevTools memakai px):

**280, 320, 360, 390, 430, 600, 768, 1024, 1280, 1440, 1920, 2560, 3840**, plus **HP landscape 740×360** dan **layar pendek 1024×500**.

Kemudian cek:
- Zoom browser **200%** dan **400%** di lebar 1280.
- Ukuran font bawaan browser diubah ke **24px** (Chrome: Settings → Appearance → Font size). Karena semua memakai rem/em, layout harus ikut membesar dengan rapi.
- **Text spacing WCAG 1.4.12**: suntikkan CSS `* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-block-end: 2em !important; }`. Tidak boleh ada teks terpotong.

**Lolos bila**: tidak ada scroll samping di level halaman, teks tidak terpotong atau bertumpuk, semua tombol bisa dijangkau, dan modal chat bisa ditutup.

**Sweep otomatis:** jalankan app, buka halaman mana saja, lalu tempel isi `scripts/responsive-sweep.js` ke console browser. Skrip ini memuat 7 halaman di 13 lebar dan melaporkan scroll samping, elemen penyebabnya, serta teks di bawah 14px. Waktu jalannya sekitar 8 menit.

---

## 3. Ukuran yang enak dipandang

### 3.1 Skala tipografi

Satu skala untuk seluruh situs, diturunkan dari ukuran yang sudah dipakai desain ini (padat, rasio ±1.125). **Teks UI tetap ukurannya**; hanya judul yang membesar halus dari layar 20rem (320px) ke 90rem (1440px).

```css
:root {
  --step--1: 0.875rem;  /* 14  label, meta, badge, chip: teks terkecil */
  --step-0:  1rem;      /* 16  teks isi */
  --step-1:  1.125rem;  /* 18  lead, judul kartu */
  --step-2:  1.25rem;   /* 20 */
  --step-3:  clamp(1.375rem, 1.3393rem + 0.1786vw, 1.5rem);  /* 22→24 */
  --step-4:  clamp(1.625rem, 1.5179rem + 0.5357vw, 2rem);    /* 26→32  judul section */
  --step-5:  clamp(2rem, 1.8571rem + 0.7143vw, 2.5rem);      /* 32→40  judul halaman */
  --step-6:  clamp(2.25rem, 2.0357rem + 1.0714vw, 3rem);     /* 36→48  h1 */
}
```

> Catatan 2026-11-26: versi pertama skala ini memakai rasio 1.2→1.25 dengan teks isi 16→18px. Hasilnya seluruh UI membesar 20–40%, halaman memanjang sampai 31%, dan tata letak yang sudah padat jadi berantakan. **Jangan memperbesar skala tanpa mendesain ulang komponennya.**

Aturannya:
- **Teks isi** `--step-0`. Tidak pernah di bawah `1rem`.
- **Jangan menaikkan `font-size` atau `line-height` global di `body`.** Komponen mengatur sendiri. Kenaikan global ikut membesarkan setiap kartu, tombol, dan navbar.
- **Kalau label 14px tidak muat di kotaknya**, jangan mengecilkan font. Ubah layout-nya, misalnya dengan grid `repeat(auto-fit, minmax(min(100%, …), 1fr))` seperti Quick Access, sehingga jumlah kolom mengikuti lebar.
- **Jangan menulis gap secara langsung di `calc()`** (`calc((100% - 3 * 0.375rem) / 4)`). Pakai token gap yang sama, atau lebih baik pakai CSS grid.
- **Teks terkecil** `--step--1` (14px), hanya untuk keterangan, label, timestamp, dan footer. **Dilarang di bawah `0.875rem`**, termasuk badge dan chip.
- **Maksimal 4 ukuran teks per layar.** Kalau butuh penekanan, pakai ketebalan atau warna, bukan ukuran baru.
- **Hero boleh lebih besar dari `--step-5`** hanya lewat `clamp()` dengan batas atas tidak lebih dari 2.5× batas bawah. Dengan begitu zoom 200% tetap membesarkan teks (WCAG 1.4.4).

### 3.2 Tinggi baris, panjang baris, ketebalan

| Elemen | `line-height` | Panjang baris | Ketebalan |
|---|---|---|---|
| Teks isi | 1.6 | 50–75 karakter (`max-inline-size: 65ch`), tidak lebih dari 80 | 400 |
| Teks kecil (`--step--1`) | 1.5 | | 400–500 |
| Judul `--step-1`–`--step-2` | 1.3 | | 600–700 |
| Judul `--step-3`+ | 1.1–1.2 | maks ±20 karakter per baris di HP | 700–800 |

- Jarak antar paragraf minimal `1em`. Untuk halaman bacaan panjang (syarat & ketentuan, FAQ), pakai `1.5em`.
- Judul memakai `letter-spacing: -0.01em` sampai `-0.02em`. Teks kapital kecil memakai `+0.05em` sampai `+0.1em`.
- Maksimal 2 keluarga font.

### 3.3 Skala spasi

Semua padding, margin, dan gap memakai token `--space-N` yang sudah ada di `globals.css`, dengan N × 0.25rem = nilai dasarnya. Dilarang nilai acak seperti `0.813rem`.

| Token | HP (20rem) → desktop (90rem) | ≈ px | Pemakaian |
|---|---|---|---|
| `--space-1` | 0.25rem | 4 | jarak ikon ke teks |
| `--space-2` | 0.5rem | 8 | label ke input, isi chip |
| `--space-3` | 0.75rem | 12 | gap kecil dalam kartu |
| `--space-4` | 1rem | 16 | jarak antar field, padding tombol |
| `--space-5` | 1.25rem | 20 | |
| `--space-6` | 1.5rem | 24 | padding kartu |
| `--space-8` | 1.5 → 2rem | 24→32 | jarak antar kelompok |
| `--space-10` | 1.875 → 2.5rem | 30→40 | |
| `--space-12` | 2.25 → 3rem | 36→48 | judul section ke isi |
| `--space-16` | 3 → 4rem | 48→64 | |
| `--space-20` | 3.75 → 5rem | 60→80 | |
| `--space-section` | 3.5 → 7.5rem | 56→120 | jarak antar section |
| `--gutter` | 1 → 2.5rem | 16→40 | tepi kiri-kanan halaman |

Token ≥ `--space-8` **cair**: di HP menyempit ke 75% supaya layar 280px tidak habis untuk padding, sedangkan desktop tetap ukuran penuh.

Pakai **hubungan jarak** supaya pengelompokan terlihat: jarak di dalam grup lebih kecil dari jarak antar grup. Contohnya, label ke input `--space-2`, antar field `--space-4`, dan antar section `--space-section`.

### 3.4 Komponen

| Komponen | Ukuran |
|---|---|
| Tombol | Tinggi minimal `2.75rem`, padding `0.75em 1.5em`, font `--step-0` |
| Chip / badge | Font `--step--1`, padding `0.25em 0.75em`. Area sentuh tetap minimal `2.75rem` bila bisa diklik |
| Input | Font minimal `1rem`, tinggi minimal `2.75rem` |
| Ikon di samping teks | `1em` hingga `1.25em`, mengikuti font di sebelahnya |
| Radius | `rem` (0.5rem kecil, 1rem sedang, 1.5rem kartu), `999em` untuk bentuk pil |
| Border | `thin` (garis rambut), `medium` untuk penekanan |
| Kartu | Padding `--space-6`, gap isi `--space-4` |

### 3.5 Warna dan kontras

- Teks isi minimal kontras **4.5:1** terhadap latar. Teks ≥ `1.5rem`, atau ≥ `1.1875rem` tebal, minimal **3:1**.
- Batas komponen (border input, ikon penting, cincin fokus) minimal **3:1**.
- Fokus keyboard memakai `outline` (misalnya `outline: medium solid var(--color-focus); outline-offset: 0.125rem`), bukan hanya `box-shadow`, agar tetap terlihat di mode `forced-colors`.
- Hormati `prefers-reduced-motion` dengan mengurangi, bukan mematikan: lihat sistem gerak di 3.6.

### 3.6 Arah visual: Garda Bergerak (2026-11-26)

Iterasi setelah uji coba "Prasasti Nuswantara" ditolak, karena animasinya dikurangi, warnanya diganti, dan ada logo di hero. Yang dipertahankan dari tema asli: **palet merah–oranye–emas dan ilustrasi hero**. Yang baru: **tipografi yang berkarakter dan sistem gerak yang terukur**.

| Aspek | Aturan | Token |
|---|---|---|
| Warna | Tetap palet asli: crimson, gradasi merah→oranye untuk aksi utama, emas untuk ornamen | `--color-brand-primary` `#C8102E`, `--gradient-primary` `#D90429→#FF6B00`, `--color-gold` `#D4AF37` |
| Font | Fraunces hanya untuk judul (h1–h6, judul section/kartu/tahap, angka hitung mundur, logo teks). Plus Jakarta Sans untuk teks isi dan semua label UI (tombol, navigasi, badge, label kecil berhuruf kapital) | `--font-display`, `--font-heading`, `--font-body` |
| Hero | Ilustrasi `public/assets/hero-emblem.png` sebagai latar. Tanpa logo di atasnya | — |
| Ornamen | Tiga bintang ✦✦✦ yang berkelip bergantian di badge hero dan eyebrow `SectionTitle` | — |
| Peta Perjalanan | Rute berstasiun: horizontal di ≥ 48em, vertikal di HP. Rel terisi gradasi sesuai progres, stasiun berjalan berdenyut, dan detail tahap muncul di satu panel (pola tab, bisa dengan keyboard) | — |

**Sistem gerak**

- **Token:** `--ease-out`, `--ease-spring`, `--dur-fast` (0.2s), `--dur` (0.45s), `--dur-slow` (0.8s).
- **Animasikan hanya `opacity`, `translate`, `scale`, dan `rotate`.** Properti individual ini tidak bentrok dengan `transform` milik efek hover yang sudah ada.
- **Scroll reveal:** tambahkan atribut `data-reveal` pada elemen. Tekniknya CSS scroll-driven (`animation-timeline: view()`), tanpa JavaScript. Browser yang belum mendukung cukup menampilkan elemen tanpa animasi.
- **Leluhur elemen `data-reveal` tidak boleh `overflow: hidden`.** `hidden` membuat scroll container baru, sehingga timeline `view()` terikat ke sana dan animasinya tidak pernah jalan. Pakai `overflow: clip`, yang juga berlaku untuk `html`/`body`.
- **Hero:** elemen masuk bergantian dari 0.5s, mengikuti splash yang memudar di 0.6s.
- **Kurangi gerakan:** di `prefers-reduced-motion: reduce`, token `--motion` bernilai 0. Setiap pergeseran animasi baru ditulis `calc(<jarak> * var(--motion))`, sehingga fade, kelip, dan warna tetap jalan tetapi gerakan geser, skala, dan putar hilang. **Jangan memakai aturan global yang mematikan semua animasi.**
- **Keyframes di CSS Modules di-hash per file.** Definisikan `@keyframes` di modul yang memakainya. Hanya keyframes untuk selector global (`[data-reveal]`) yang boleh tinggal di `globals.css`.

---

## 4. Sumber

Diverifikasi 2026-11-26 dari halaman aslinya. Riset pendukung untuk stack Laravel ada di `D:/Coding/_kit/research/2026-11-ui-ux-setup.md`.

| Topik | Isi yang dipakai | Sumber |
|---|---|---|
| Reflow (WCAG 1.4.10, AA) | Tanpa scroll dua arah di lebar 320 CSS px (= 1280px pada zoom 400%), dan di tinggi 256px untuk konten yang scroll ke samping | https://www.w3.org/WAI/WCAG22/Understanding/reflow.html |
| Resize text (1.4.4, AA) | Teks bisa diperbesar 200% tanpa kehilangan isi atau fungsi | https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html |
| Text spacing (1.4.12, AA) | Tetap terbaca dengan line-height 1.5×, jarak paragraf 2×, letter-spacing 0.12×, word-spacing 0.16× | https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html |
| Target size (2.5.8 AA / 2.5.5 AAA) | 24×24 dan 44×44 CSS px | https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html , https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html |
| Visual presentation (1.4.8, AAA) | Baris ≤ 80 karakter, line-height ≥ 1.5 | https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html |
| Satuan di media query | `em`/`rem` di media query mengikuti ukuran font awal browser, bukan `font-size` yang diset di `html`. Bug lama di Safari sudah diperbaiki | https://www.w3.org/TR/mediaqueries-4/ , https://bugs.webkit.org/show_bug.cgi?id=156684 |
| Keyword `thin` | `thin` = 1px, `medium` = 3px, `thick` = 5px (normatif di spesifikasi) | https://www.w3.org/TR/css-backgrounds-3/ , https://developer.mozilla.org/en-US/docs/Web/CSS/border-width |
| Status Baseline | Tanggal Widely/Limited untuk tiap fitur di 2.3 | https://webstatus.dev (API `api.webstatus.dev/v1/features/<id>`) |
| Galaxy Fold | Layar luar Fold 1 lebarnya 320px. 280px adalah preset DevTools | https://developer.samsung.com/browser/blog/en/2020/01/27/current-web-on-galaxy-fold |
| Target sentuh platform | iOS: 44×44pt default, 28pt minimum. Android: 48×48dp | https://developer.apple.com/design/human-interface-guidelines/accessibility , https://developer.android.com/guide/topics/ui/accessibility/apps |
| Auto-zoom input iOS | Input dengan font < 16px di-zoom saat difokuskan (tidak didokumentasikan Apple) | https://www.stefanjudis.com/notes/mobile-safari-doesnt-zoom-into-form-inputs-with-minimum-16px |
| Skala tipe cair | Interpolasi dua skala (min/max viewport) dengan `clamp()`. Nilai di 3.1 dihitung dengan metode ini (320→1440px, 16→18px, rasio 1.2→1.25) | https://utopia.fyi/blog/designing-with-fluid-type-scales/ , https://utopia.fyi/type/calculator/ |
| Panjang baris | 50–75 karakter (Baymard), 45–90 (Butterick) | https://baymard.com/blog/line-length-readability , https://practicaltypography.com/line-length.html |

---

## Lampiran A — Audit proyek, 2026-11-26

| Temuan | Jumlah | Aturan |
|---|---|---|
| Nilai `px` di CSS dan `style={{ }}` | 128 (51 `border`, 11 `letter-spacing`, sisanya inline style di `GardaChat.tsx`, `page.tsx`, `About.tsx`, `GardaModal.tsx`) | 1.2 |
| `100vh` / `100vw` | 7 (`offline`, `syarat-ketentuan`, `GardaModal`, `Navbar`, `InfoGarda`, `DeveloperChamber`) | 1.2 |
| Nilai `font-size` berbeda | 26, termasuk `0.625rem` (10px) ×5, `0.688rem` (11px) ×14, `0.75rem` ×8 | 3.1 |
| Breakpoint berbeda | 7 (`30, 37.5, 40, 48, 64, 75rem`), semua `max-width` (desktop-first) | 2.2 |
| Container query | 0 | 2.2 |
| `clamp()` | 4 | 3.1, 3.3 |

### Status setelah `/rapikan` 2026-11-26

| Item | Sebelum | Sesudah |
|---|---|---|
| Nilai `px` di CSS dan `.tsx` | 128 | 0 (kecuali `console.log` di `layout.tsx`) |
| `100vh` / `100vw` | 7 | 0 (diganti `dvh`/`svh`/`inset: 0`/`100%`) |
| `font-size` | 26 nilai acak | 8 token `--step-*`, plus 3 ukuran ikon dekoratif (≥ 4rem) dan 2 judul hero `clamp` |
| Padding, margin, gap | 340 nilai mentah | 412 nilai memakai `--space-N`, 3 dibiarkan (di luar skala) |
| Breakpoint | `max-width` dalam `rem` | Sintaks range dalam `em` (nilainya masih sama) |
| Teks < 14px (sweep 7 halaman × 13 lebar) | 2.482 temuan | 0 |
| Scroll samping (sweep yang sama) | 0 | 0 |
| Font Inter/Poppins | Tidak termuat (situs tampil Times New Roman) | Termuat |

Belum dikerjakan:
1. Breakpoint masih 7 titik desktop-first. Penyatuan ke 5 titik mobile-first (2.2) butuh menulis ulang cascade per komponen.
2. Container query belum dipakai.
3. Pewarnaan hex mentah di CSS belum dipindah ke token warna.
