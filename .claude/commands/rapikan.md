---
description: Rapikan satu area kode — keamanan, bug, efisiensi database (N+1, eager loading, index), hardcode, duplikasi, kelas besar, responsif, cek semua klik di browser — dengan bukti tes, pakai ulang file yang ada, hemat token.
argument-hint: <kosong = inventaris | area, mis. Invoices | path, mis. app/Filament/Resources/Invoices/InvoiceResource.php>
---

Rapikan area: **$ARGUMENTS**

Versi kit: **1.11.0** (2026-11-26).

Satu run = satu area. Aturan di `CLAUDE.md`, `CODING_RULES.md`, `ARCHITECTURE_RULES.md`, `STACK_RULES.md`, `DATABASE_RULES.md`, dan `UI_UX_RULES.md` tetap berlaku penuh; perintah ini menambah urutan kerja, apa yang dicari, dan skill yang dipakai.

## Skill otomatis

Panggil skill ini sendiri di langkah yang disebut, tanpa menunggu pengguna. Sebut skill yang dipakai di laporan; skill yang tidak ada di sesi dicatat lalu lanjut dengan tool biasa.

| Langkah | Skill |
|---|---|
| 0 Inventaris | `ponytail:ponytail-audit` |
| 2 Audit keamanan | `insecure-defaults:audit`, `sharp-edges:sharp-edges` |
| 2 Audit kode | `simplify` (temuan saja), `mattpocock-skills:codebase-design` untuk merancang pecahan kelas besar |
| 3 Bug, celah, N+1 | `mattpocock-skills:tdd`; `mattpocock-skills:diagnosing-bugs` bila penyebab belum jelas |
| 4 Cek klik dan responsif | `browser-automation` |
| 5 Review | `differential-review:differential-review`, lalu `security-review` bila ada perubahan keamanan |

## Hemat token

- `Grep`/`Glob` dulu untuk menemukan lokasi, lalu `Read` hanya rentang baris yang relevan.
- Audit area yang lebih dari ~15 file dikirim ke subagent `Explore`; yang kembali hanya daftar temuan berformat file:baris.
- Selama bekerja, jalankan tes yang difilter ke area; suite penuh hanya sekali di langkah regresi.
- File yang baru diedit tidak dibaca ulang; output panjang dipotong (`| tail`, `--compact`).
- Di browser, pakai `read_page`/`get_page_text`/`read_network_requests`; screenshot hanya untuk bukti akhir atau masalah tampilan.
- Laporan berupa tabel ringkas, tanpa menyalin kode yang tidak berubah.

## Pakai ulang, bukan buat baru

- Sebelum membuat file, kelas, method, komponen, enum, atau config baru: `Grep` nama dan tanggung jawabnya di `app/`, `config/`, `resources/views/components/`, `resources/js/`. Kalau sudah ada pemiliknya, tambahkan di sana.
- File baru hanya untuk tanggung jawab yang belum punya pemilik, termasuk hasil memecah god class.
- Dua kelas/helper/komponen dengan tanggung jawab sama → **eliminasi**: pilih satu yang bertahan (yang paling banyak dipakai dan paling sesuai layer), pindahkan semua pemanggil, hapus sisanya setelah `Grep` memastikan tidak ada pemanggil tersisa.
- Laporan mencantumkan neraca file: dibuat, dihapus, digabung.

## 0. Tentukan area

Catat `git status` di awal (bila proyek memakai git). File yang sudah berubah tapi belum di-commit adalah kerja sesi lain: jangan diubah tanpa konfirmasi pengguna.

Jika `$ARGUMENTS` kosong: susun **inventaris** dan berhenti. Baca `docs/rapikan-log.md` (kalau ada) untuk melewati area yang sudah selesai. Inventaris = tabel area di `app/`, `routes/`, `resources/views/` (kecuali `resources/views/vendor/`), `resources/js/`, diurutkan dari yang paling berisiko: celah keamanan, N+1, duplikasi, jumlah tanggung jawab, jumlah baris, hardcode. Jalankan juga `composer audit` dan `npm audit --omit=dev` dan masukkan hasilnya. Usulkan urutan area, lalu tunggu pilihan pengguna.

Jika terisi: area = seluruh file yang melayani fitur itu, mengikuti layer proyek (lihat `ARCHITECTURE_RULES.md`): Action, Resource/Page Filament beserta `Schemas/` dan `Tables/`, Livewire, controller, Form Request, route, policy, model, enum, migration, notification, job, view, dan komponen JS. Selesai ketika daftar file area tertulis.

## 1. Baseline

Jalankan tes area dan catat passed/failed serta nama tes yang gagal. Selesai ketika angka baseline tercatat.

## 2. Audit

Baca setiap file area beserta pemanggilnya. Tiap temuan punya file:baris, kategori, dan bukti. Dugaan tanpa bukti ditandai "perlu dicek".

**Keamanan:**
- Otorisasi: setiap entry point (halaman Filament, action, bulk action, route publik, link email, method Livewire, download file) memeriksa permission lewat satu policy yang sama. Cari IDOR: ID dari request dipakai tanpa memastikan record boleh diakses user itu.
- Livewire: property publik berisi ID, harga, atau status dikunci (`#[Locked]`) atau divalidasi ulang di server; setiap method publik memeriksa otorisasi.
- Input: validasi di setiap batas masuk; `#[Fillable([...])]` eksplisit pada model yang menerima input user (tanpa `unguard()`, `#[Unguarded]`, `$guarded = []`).
- Injection: `DB::raw`, `whereRaw`, `orderByRaw`, `selectRaw` dengan input user → binding parameter atau whitelist kolom.
- XSS: `{!! !!}`, `HtmlString`, `->html()`, `dangerouslySetInnerHTML` dengan data user → escape atau sanitize.
- File: upload dibatasi MIME dan ukuran, disimpan di disk privat, nama file dibuat server, path traversal dicegah; download lewat otorisasi.
- Route publik dan link bertanda tangan: middleware `signed`, masa berlaku, `throttle` untuk form publik, login, dan endpoint yang mengirim email.
- Data sensitif: tidak muncul di log, pesan error, response JSON, atau HTML tersembunyi; secret hanya lewat `env()` di `config/`.

**Database dan eager loading** (aturan lengkap di `DATABASE_RULES.md`):
- N+1: akses relasi di loop, accessor, kolom tabel Filament, atau Blade `@foreach` tanpa `with()`; `count()`/`sum()` per baris tanpa `withCount()`/`withSum()`/`withExists()`. Deteksi cepat: pastikan `Model::shouldBeStrict(! app()->isProduction())` aktif di `AppServiceProvider`, jalankan tes area, catat setiap `LazyLoadingViolationException`. Bila belum aktif di proyek, aktifkan sementara lalu kembalikan file itu persis seperti semula, dan usulkan agar dipasang permanen.
- Query berulang dalam satu request → ambil sekali dan teruskan.
- Kerja di PHP yang seharusnya di database: `->get()` lalu `filter`/`sum`/`count` → `where`/`sum()`/`count()`/`exists()` di query.
- `select` hanya kolom yang dipakai pada daftar besar dan relasi eager load.
- Data besar: `chunkById`/`lazyById`, paginasi, operasi massal (`update`, `upsert`, `insert`) sebagai pengganti save per baris.
- Index untuk kolom `where`, `orderBy`, `join`, dan foreign key; ditulis sebagai migration baru.
- Operasi multi-tabel yang menyangkut uang atau status dibungkus `DB::transaction`, dengan `lockForUpdate` bila ada race (nomor urut, saldo, pembayaran ganda).
- Pekerjaan lambat dalam request (kirim email, notifikasi, PDF, upload ke penyimpanan luar) berjalan di queue (`ShouldQueue`).

**Kode:**
- **Bug**: perilaku salah yang bisa dibuktikan dengan tes merah. Perhatikan uang dengan `float`, pembulatan, tanggal/zona waktu, null yang tidak ditangani, exception yang ditelan diam-diam.
- **Hardcode**: status, role, permission, nominal, persentase, tarif, URL, email, path, atau label yang dipakai di lebih dari satu tempat. Rumahnya enum di `app/Enums`, `config/*.php`, Settings, atau tabel master yang sudah ada.
- **Duplikasi**: logika, kelas, atau komponen yang sama di dua tempat atau lebih, termasuk yang sudah punya helper atau komponen bersama di proyek.
- **God class**: file atau method yang memegang lebih dari satu tanggung jawab, atau melewati patokan ukuran di `ARCHITECTURE_RULES.md`.
- **Arah dependency**: lapisan bawah tidak mengenal lapisan atas (aturan di `ARCHITECTURE_RULES.md`). Cek cepat, hasil harus kosong: `grep -rnE 'use App[\\](Actions|Http|Livewire|Filament)[\\]' app/Models app/Services`.
- **Logika di view dan CSS komponen** (`ARCHITECTURE_RULES.md` bagian 8): query, `@php` berisi logika, atau olah data di Blade; `<style>` di komponen Livewire tanpa komentar alasan. Cek cepat, setiap hit adalah temuan kecuali `@php` yang hanya variabel tampilan: `grep -rnE '::(query|where|all|find|first|count)\(|DB::|@php' resources/views --exclude-dir=vendor` dan `grep -rln '<style' resources/views/components resources/views/pages`.
- **Kode mati dan kerja sia-sia**: method, import, kolom, view, atau kalkulasi yang tidak dipakai; komputasi berat yang diulang.

**API usang** (daftar lengkap "pakai X, bukan Y" di `STACK_RULES.md`). Jalankan di area, setiap hit adalah temuan kecuali tercatat sengaja:
```bash
# Filament v3
grep -rnE 'Filament[\\](Forms[\\](Form|Get|Set)\b|Infolists[\\]Infolist\b|Tables[\\]Actions[\\]|Forms[\\]Components[\\](Section|Grid|Tabs|Wizard|Fieldset|Placeholder|MultiSelect)\b|Tables[\\]Columns[\\](BadgeColumn|BooleanColumn)\b)|->bulkActions\(' app
# Livewire v2/v3
grep -rnE '\b(emit|emitTo|dispatchBrowserEvent)\(|protected \$(listeners|queryString)\b|wire:model\.defer|wire:click\.prefetch|livewire:load|wire:transition\.|Volt::' app resources/views
# wire:model.blur tanpa .live tidak mengirim request: bila dipakai untuk validasi saat blur, ganti ke wire:model.blur.live
grep -rnE 'wire:model\.blur=' resources/views
# Tailwind v3 (hasil shadow/rounded/outline-none diperiksa manual, bisa sengaja)
grep -rnE '\b(bg|text|border|divide|ring|placeholder)-opacity-|\bflex-(shrink|grow)\b|\bflex-(shrink|grow)-|overflow-ellipsis|\bdecoration-(slice|clone)\b|bg-gradient-to-|outline-none|\bshadow\b[^-]|\brounded\b[^-]|(^|[ "])(start|end)-[0-9]' resources/views app
```

**Tampilan** (aturan lengkap di `UI_UX_RULES.md`):
- Lebar tetap dalam px, `100vh`, scroll horizontal di level halaman, target sentuh < 44 px, hover tanpa padanan tap.
- Gambar tanpa `width`/`height`, tanpa lazy, atau format lama; library berat di bundle global.
- Animasi yang menyentuh properti selain `transform`/`opacity`, loop tanpa henti, reduced motion tidak ditangani.
- State loading, kosong, error, atau forbidden yang tidak ada.

Selesai ketika setiap file area sudah masuk daftar (temuan atau "bersih"). Tampilkan daftar ke pengguna sebelum mengubah kode jika ada temuan yang mengubah perilaku, skema, permission, atau uang.

## 3. Perbaiki, berurutan

Satu batch per kategori, tes hijau sebelum lanjut:

1. **Keamanan**: tes yang membuktikan akses ditolak atau input berbahaya diblok, lalu perbaikan.
2. **Bug**: tes merah dulu, lalu perbaikan di akar masalah (cek semua pemanggil).
3. **Database**: tes jumlah query yang tetap konstan saat data bertambah (buat data 1 dan N, bandingkan `DB::getQueryLog()` atau hitung lewat `DB::listen`), lalu eager load, agregat di query, index, transaksi, queue.
4. **Hardcode**: pindahkan ke satu sumber; semua pemakai membaca dari sumber itu.
5. **Duplikasi dan kode mati**: eliminasi sesuai bagian "Pakai ulang".
6. **God class**: pecah per tanggung jawab mengikuti layer di `ARCHITECTURE_RULES.md`. Kelas lama menjadi tipis dan memanggil kelas baru. Pemecahan murni struktural: perilaku, nama route, dan output tetap sama.
7. **Tampilan**: perbaiki responsif, performa halaman, dan animasi sesuai `UI_UX_RULES.md`.

Perilaku yang terlihat pengguna hanya berubah untuk bug atau celah keamanan yang terbukti. Perubahan lain yang mengubah perilaku dicatat sebagai usulan. Berhenti dan lapor bila sebuah perubahan berisiko besar atau tidak bisa dites.

## 4. Regresi, cek klik, dan responsif

**Tes:** tes area plus tes setiap file bersama yang tersentuh, lalu suite penuh sekali. Selesai ketika set gagal sama dengan atau lebih kecil dari baseline. `vendor/bin/pint` pada file PHP yang berubah; `npm run build` bila Blade/CSS/JS berubah.

**Cek klik di browser** (`browser-automation`, server dari `.claude/launch.json`, hanya di localhost):
- Login dengan akun demo dari seeder proyek (misalnya `database/seeders/*DemoUser*Seeder.php`), satu akun per role yang memakai area itu. Kredensial dibaca dari seeder dan tidak ditulis di chat.
- Klik setiap elemen interaktif di halaman area: menu, tab, filter, pencarian, sort, paginasi, header action, row action, bulk action, tombol form (simpan, batal, submit), modal, link, download, upload.
- Setiap klik lolos bila: tidak ada error di console, tidak ada response 4xx/5xx di network (kecuali 403 yang memang diharapkan), notifikasi/hasil yang benar muncul, dan data berubah sesuai harapan.
- Untuk role tanpa izin: tombolnya tidak tampil, dan membuka URL-nya langsung menghasilkan 403.
- Klik yang mengubah atau menghapus data hanya pada data demo.

**Cek responsif:** halaman utama area diuji di lebar dan kondisi pada `UI_UX_RULES.md` bagian 2.6. Tidak boleh ada teks terpotong, elemen bertumpuk, atau scroll horizontal di level halaman.

Selesai ketika tabel klik (halaman, elemen, role, hasil) dan tabel responsif (halaman, lebar, hasil) lengkap untuk setiap halaman area. Yang gagal masuk ke langkah 3 sebagai bug.

## 5. Dokumentasi dan review

- Migration baru → update `docs/database/`. Keputusan perilaku/skema/permission → nomor berikutnya di decision register proyek (`docs/15-decision-register.md` atau yang dipakai proyek). Perubahan menu/navigasi → `docs/03-role-permission.md` dan `docs/ui/` terkait. Setiap file docs baru → `docs/CATALOG.md`.
- Tambah satu baris di `docs/rapikan-log.md` (buat bila belum ada, catat di CATALOG): tanggal, area, status (selesai / sebagian), sisa usulan.
- Review diff sendiri dengan skill review di tabel atas.

## 6. Laporan

- Tabel temuan per kategori: diperbaiki / diusulkan / perlu dicek, dengan file:baris.
- Angka tes sebelum dan sesudah, nama tes gagal yang sudah ada sejak baseline.
- Jumlah query sebelum dan sesudah untuk halaman yang dioptimasi.
- Tabel klik: jumlah lolos / gagal per role. Tabel responsif: lolos / gagal per lebar.
- Neraca file: dibuat, dihapus, digabung.
- Skill yang dipakai. Area berikutnya yang disarankan.
- Tanyakan apakah perubahan area ini mau di-commit; commit hanya file area ini.
