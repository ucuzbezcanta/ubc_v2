import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import HeaderDataFetcher from "@/components/HeaderDataFetcher";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



// -------------- METADATA TANIMI --------------
export const metadata: Metadata = {
  // 1. Ana Site Başlığı
  title: {
    default: "Ucuz Bez Çanta | Toptan ve Baskılı Çanta Üretimi",
    template: "%s | Ucuz Bez Çanta", // Diğer sayfaların başlık sonuna eklenir
  },
  // 2. Ana Açıklama
  description: "Toptan bez çanta, kanvas çanta, ham bez çanta ve promosyon çantaları üretimi. Hızlı teslimat ve uygun fiyat garantisi.",
  
  // 3. Anahtar Kelimeler (Artık çok az etkiye sahip olsa da kullanılabilir)
  keywords: [
    "bez çanta", 
    "toptan bez çanta", 
    "kanvas çanta", 
    "promosyon çanta",
    "baskılı çanta",
    "ucuza çanta"
  ],

  // 4. Site Adresi (canonical URL ve robots)
  metadataBase: new URL('https://www.ucuzbezcanta.com'), // Kendi domaininizi yazın
  openGraph: {
    title: "Ucuz Bez Çanta | Toptan ve Baskılı Çanta Üretimi",
    description: "Toptan bez çanta, kanvas çanta, ham bez çanta ve promosyon çantaları üretimi.",
    url: "https://www.ucuzbezcanta.com",
    siteName: "Ucuz Bez Çanta",
    images: [
      {
        url: "/social-share-image.png", // /public klasöründe bulunmalı
        width: 1200,
        height: 630,
        alt: "Ucuz Bez Çanta Sosyal Medya Görseli",
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  // 5. Twitter Kartları
  twitter: {
    card: 'summary_large_image',
    title: "Ucuz Bez Çanta | Toptan ve Baskılı Çanta Üretimi",
    description: "Toptan bez çanta, kanvas çanta, ham bez çanta ve promosyon çantaları üretimi.",
    images: ['/social-share-image.png'],
    // creator: '@twitter-hesabınız', // Opsiyonel
  },
  
  // 6. Robots Ayarları
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Script
  strategy="afterInteractive"
  src="https://www.googletagmanager.com/gtag/js?id=AW-861400921"
/>

<Script
  id="gtag-init"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-861400921');
    `,
  }}
/>
        <HeaderDataFetcher />
        {children}
        <Footer />
      </body>
    </html>
  );
}
