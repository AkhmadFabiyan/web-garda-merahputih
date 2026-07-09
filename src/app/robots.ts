import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Jangan biarkan bot meng-index halaman admin
    },
    sitemap: 'https://garda.unesa.ac.id/sitemap.xml',
  };
}
