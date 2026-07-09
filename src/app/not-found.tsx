import { redirect } from 'next/navigation';

export default function NotFound() {
  // Secara otomatis membelokkan pengguna yang tersesat (404) kembali ke Beranda (/)
  redirect('/');
}
