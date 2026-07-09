import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://garda.unesa.ac.id';

  // Rute utama yang selalu ada
  const routes = [
    '',
    '/jadwal',
    '/faq',
    '/kontak',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Jika suatu saat ada data artikel dinamis dari database, 
  // Anda tinggal memanggil database/API di sini dan menambahkannya ke array routes.
  // Contoh:
  // const dynamicRoutes = articles.map(article => ({ url: \`\${baseUrl}/berita/\${article.slug}\`, ... }));
  // return [...routes, ...dynamicRoutes];

  return routes;
}
