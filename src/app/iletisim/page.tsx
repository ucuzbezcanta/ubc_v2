import React from "react";
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";

const MAIN_PADDING_CLASS = "pt-24 min-h-screen"; 

export const metadata: Metadata = {
    title: 'İletişim | Ucuz Bez Çanta', // DÜZELTİLDİ
    description: 'Ucuz Bez Çanta ile iletişime geçin. İletişim bilgilerimiz, adresimiz ve online iletişim formumuz.', // DÜZELTİLDİ
    keywords: ['ucuz bez çanta iletişim', 'iletişim bilgileri', 'adres', 'online form'], // DÜZELTİLDİ
    openGraph: {
      title: 'İletişim | Ucuz Bez Çanta', // DÜZELTİLDİ
      description: 'Ucuz Bez Çanta ile iletişime geçin. İletişim bilgilerimiz, adresimiz ve online iletişim formumuz.', // DÜZELTİLDİ
      url: 'https://www.ucuzbezcanta.com/iletisim', // DÜZELTİLDİ (Domain varsayımı)
      siteName: 'Ucuz Bez Çanta', // DÜZELTİLDİ
      images: [
        {
          url: 'https://ucuzbezcanta.com/logo.svg', // DÜZELTİLDİ
          width: 1200,
          height: 630,
          alt: 'Ucuz Bez Çanta Logo Ana Görsel', // DÜZELTİLDİ
        },
      ],
      locale: 'tr_TR',
      type: 'website',
    },
};

export default function IletisimPage() {
  return (
    <main className={`flex flex-col space-y-16 ${MAIN_PADDING_CLASS}`}>
      
      {/* Başlık Bölümü */}
      <section className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Bize Ulaşın</h1>
        <p className="mt-4 text-xl text-gray-600">Sorularınız, toplu sipariş talepleriniz ve iş ortaklığı için...</p>
      </section>

      {/* İletişim Bilgileri ve Form Bölümü */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          <ContactInfo />
          <ContactForm />
        </div>
      </section>

      {/* Harita Bölümü - Tam Genişlik */}
      <section className="w-full h-[450px] bg-gray-100">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.05389328461!2d28.954052676307366!3d41.04595051710377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab0056d6fa5ad%3A0x64e792755325c3a3!2sUcuz%20Bez%20%C3%87anta!5e0!3m2!1str!2str!4v1752409927747!5m2!1str!2str"  
          width="100%" 
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ucuz Bez Çanta Konum Haritası"> {/* DÜZELTİLDİ */}
        </iframe>
      </section>
    </main>
  );
}