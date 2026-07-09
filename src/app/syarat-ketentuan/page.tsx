import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Syarat & Ketentuan | GARDA UNESA 2026',
  description: 'Syarat dan Ketentuan serta Kebijakan Privasi penggunaan website resmi PKKMB GARDA UNESA 2026.',
};

export default function SyaratKetentuan() {
  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Syarat & Ketentuan</h1>
          <p className={styles.lastUpdate}>Pembaruan Terakhir: 16 Juni 2026</p>

          <div className={styles.content}>
            <h2>1. Penerimaan Syarat</h2>
            <p>
              Dengan mengakses dan menggunakan situs web resmi GARDA UNESA 2026, Anda secara tegas menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui bagian mana pun, Anda tidak diperkenankan menggunakan layanan di situs ini.
            </p>

            <h2>2. Penggunaan Layanan</h2>
            <p>
              Situs ini dikelola oleh Panitia GARDA UNESA 2026 sebagai pusat informasi resmi Pengenalan Kehidupan Kampus bagi Mahasiswa Baru (PKKMB). Anda setuju untuk menggunakan situs ini hanya untuk tujuan yang sah, dan dengan cara yang tidak melanggar hak-hak, membatasi, atau menghalangi penggunaan situs oleh pihak lain.
            </p>

            <h2>3. Kebijakan Privasi (Data Mahasiswa)</h2>
            <p>
              Perlindungan data Anda adalah prioritas kami. Terkait fitur Presensi, Penugasan, dan Pendataan:
            </p>
            <ul>
              <li>Informasi identitas (seperti Nama, NIM, Fakultas) yang dikumpulkan semata-mata digunakan untuk keperluan administratif PKKMB UNESA 2026.</li>
              <li>Data Anda disimpan dengan tingkat keamanan yang memadai dan tidak akan pernah dijual atau disebarkan ke pihak ketiga tanpa izin eksplisit Anda.</li>
              <li>Dengan mengisi formulir yang ada di situs ini, Anda memberikan persetujuan kepada panitia untuk mengolah data Anda.</li>
            </ul>

            <h2>4. Disclaimer AI Gara (Asisten Virtual)</h2>
            <p>
              Situs ini dilengkapi dengan fitur Asisten AI bernama <strong>Gara</strong>. Terkait penggunaan AI:
            </p>
            <ul>
              <li>Gara dirancang untuk memberikan jawaban prediktif berdasarkan pangkalan data yang telah kami latih. Namun, kecerdasan buatan dapat mengalami halusinasi atau ketidakakuratan.</li>
              <li>Jawaban Gara <strong>bukanlah keputusan final atau aturan baku</strong>. Referensi mutlak dan resmi tetap mengacu pada buku panduan PKKMB dan arahan langsung dari Panitia GARDA UNESA 2026.</li>
              <li>Panitia tidak bertanggung jawab atas kerugian atau kesalahan tindakan mahasiswa baru yang disebabkan oleh misinformasi dari percakapan dengan AI Gara. Jika ragu, silakan hubungi Narahubung (Contact Person) Fakultas Anda.</li>
            </ul>

            <h2>5. Kekayaan Intelektual</h2>
            <p>
              Seluruh desain antarmuka, logo, ilustrasi, aset visual, dan kode sumber pada situs ini (Kecuali yang dinyatakan sebagai milik pihak ketiga) adalah hak milik eksklusif GARDA UNESA 2026. Dilarang keras mereproduksi, menyalin, atau mendistribusikan elemen-elemen tersebut tanpa izin tertulis dari pihak panitia.
            </p>

            <h2>6. Perubahan Syarat & Ketentuan</h2>
            <p>
              Panitia GARDA UNESA 2026 berhak penuh untuk merevisi Syarat dan Ketentuan ini kapan saja tanpa pemberitahuan sebelumnya. Penggunaan situs yang berkelanjutan setelah perubahan dianggap sebagai persetujuan Anda terhadap perubahan tersebut.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
