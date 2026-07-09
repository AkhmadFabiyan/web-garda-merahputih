import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SplashScreen } from '../components/ui/SplashScreen';
import { DelayedMount } from '../components/ui/DelayedMount';
import packageJson from '../../package.json';
import dynamic from 'next/dynamic';

const BackToTop = dynamic(() => import('../components/ui/BackToTop').then(mod => mod.BackToTop));
const GardaWidget = dynamic(() => import('../components/features/garda/GardaWidget').then(mod => mod.GardaWidget));
const A11yWidget = dynamic(() => import('../components/ui/A11yWidget').then(mod => mod.A11yWidget));
const DeveloperChamber = dynamic(() => import('../components/ui/DeveloperChamber').then(mod => mod.DeveloperChamber));
const OfflineBanner = dynamic(() => import('../components/ui/OfflineBanner').then(mod => mod.OfflineBanner));

const inter = Inter({ subsets: ["latin"], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ["latin"],
  variable: '--font-poppins',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL("https://garda.unesa.ac.id"),
  title: "GARDA UNESA 2026 | Jayantara Nuswantara",
  description: "Official PKKMB website for Universitas Negeri Surabaya. Pelopor Pendidikan, Pilar Kemajuan Bangsa.",
  keywords: ["PKKMB UNESA 2026", "GARDA UNESA", "Universitas Negeri Surabaya", "Mahasiswa Baru", "Jayantara Nuswantara", "Info PKKMB UNESA", "Gara AI"],
  authors: [{ name: "AkhmadFabiyan", url: "https://www.linkedin.com/in/akhmadfabiyan/" }],
  creator: "AkhmadFabiyan",
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://garda.unesa.ac.id",
    title: "GARDA UNESA 2026 | Jayantara Nuswantara",
    description: "Official PKKMB website for Universitas Negeri Surabaya. Pelopor Pendidikan, Pilar Kemajuan Bangsa.",
    siteName: "Garda UNESA 2026",
    images: [
      {
        url: "/assets/icon.png",
        width: 512,
        height: 512,
        alt: "GARDA UNESA 2026 Preview",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GARDA UNESA 2026 | Jayantara Nuswantara",
    description: "Official PKKMB website for Universitas Negeri Surabaya. Pelopor Pendidikan, Pilar Kemajuan Bangsa.",
    images: ["/assets/icon.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GARDA UNESA",
  },
  icons: {
    icon: "/assets/icon.png",
    apple: "/assets/icon.png",
  },
  other: {
    "author": "AkhmadFabiyan",
    "creator": "AkhmadFabiyan",
    "build-signature": "AFAM-GARDA26"
  }
};

export const viewport = {
  themeColor: "#0A0616",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Font preconnect — reduces render-blocking */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload LCP image so browser discovers it early */}
        <link rel="preload" as="image" href="/assets/hero-emblem.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "GARDA UNESA 2026",
              "url": "https://garda.unesa.ac.id",
              "publisher": {
                "@type": "Organization",
                "name": "GARDA UNESA"
              }
            })
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                const originalError = console.error;
                console.error = function(...args) {
                  const msg = args[0] || '';
                  if (typeof msg === 'string' && (
                    msg.includes('Hydration failed') ||
                    msg.includes('A tree hydrated but some attributes of the server') ||
                    msg.includes('bis_skin_checked')
                  )) {
                    return; // Suppress extension-caused hydration errors
                  }
                  originalError.apply(console, args);
                };
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log("%c🏆 GARDA UNESA 2026", "color: #F4C542; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px rgba(244,197,66,0.5); background: #0a0616; padding: 8px 16px; border-radius: 6px;");
              console.log("%cEngineered by:\\nAkhmadFabiyan -> https://www.linkedin.com/in/akhmadfabiyan/", "color: #D8B4E2; font-size: 14px; font-family: monospace; padding-left: 10px; margin-top: 5px;");
              console.log("%cBuild:\\nAFAM-GARDA26 (v${packageJson.version})", "color: #A0AEC0; font-size: 12px; font-family: monospace; padding-left: 10px; margin-top: 5px;");
            `,
          }}
        />
        <OfflineBanner />
        <SplashScreen />
        {children}
        <DelayedMount>
          <DeveloperChamber />
          <BackToTop />
          <A11yWidget />
          <GardaWidget />
        </DelayedMount>
      </body>
    </html>
  );
}
