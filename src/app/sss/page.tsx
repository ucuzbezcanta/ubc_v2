import React from "react";
import type { Metadata } from "next";
import AccordionItem from "@/components/AccordionItem";

export const revalidate = 3600;

// ------------------ SSS TİP TANIMI ------------------
// Döngüsel bağımlılığı önlemek için açıkça tip tanımlandı
interface FAQItem {
  id: string;
  title: string;
  content: string;
}

// ------------------ SSS Verileri (Metadata ve JSON-LD için kullanılacak) ------------------
const faqs: FAQItem[] = [ // Tipi açıkça tanımladık
  {
    id: 'sss-1',
    title: 'Kumaşlarınız pamuklu mudur?',
    content: 'Evet. Özellikle talep edilmediği sürece hambez, kanvas, gabardin gibi çantalarımızda kullandığımız kumaşlar pamukludur.',
  },
  {
    id: 'sss-2',
    title: 'Ürünlerin teslim süresi ne kadar?',
    content: 'Teslim süreleri verilen sipariş adetine, uygulanacak logo/baskı çalışmasına ve tekniğine göre değişkenlik gösterebilir. Ortalama 1000 li adetlerde teslim süremiz 7-8 iş günüdür.',
  },
  {
    id: 'sss-3',
    title: 'Ödeme yöntemleri nelerdir?',
    content: 'Ödemeler iş başlangıcında %50 ön ödeme, kalan bakiye ürün teslimata hazır olduğunda tahsil edilecek şekilde EFT/Havale usulüdür.',
  },
  {
    id: 'sss-4',
    title: 'Ürünler yıkanabilir mi?',
    content: 'Çantaların yıkama garantisi yoktur. Uygulanacak baskıya göre yıkandıkça baskılarda solmalar/çıkmalar yaşanabilir. Kumaşlar pamuk içerikli olduğu için pamuklanma durumları yaşanabilir.',
  },
  {
    id: 'sss-5',
    title: 'Teslimat nasıl oluyor?',
    content: 'Verilen tekliflerimiz fabrika teslim şeklinde hesaplanmaktadır. Teslimat için ayrıca teklif alırken belirtilirse ekstra teslimat fiyatı da birim maliyetlere eklenebilir.',
  },
  {
    id: 'sss-6',
    title: 'İhracatınız var mıdır?',
    content: 'Evet. Yurtdışı gönderimlerimiz mevcuttur.',
  },
];

// ------------------ METADATA TANIMI ------------------
export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular (SSS)",
  description: "Toptan bez çanta, baskı ve teslimat süreçleri hakkında en çok sorulan soruların cevapları. Sipariş vermeden önce merak ettikleriniz.",
  alternates: {
      canonical: '/sss',
  },
  openGraph: {
      title: "Sıkça Sorulan Sorular | Ucuz Bez Çanta",
      description: "Toptan bez çanta, baskı ve teslimat süreçleri hakkında en çok sorulan soruların cevapları.",
      url: '/sss',
      type: 'website',
  }
};


// ------------------ JSON-LD YAPISAL VERİ OLUŞTURUCU ------------------
// Google'ın SSS şemasını anlaması için gereklidir (Rich Snippet)
const generateFaqSchema = (faqs: FAQItem[]) => { // FAQItem[] tipini kullandık
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq: FAQItem) => ({ // map içinde faq'ın tipini belirttik
      "@type": "Question",
      "name": faq.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.content
      }
    }))
  };
};

const SSSPage: React.FC = () => {
  const faqSchema = generateFaqSchema(faqs);

  return (
    <div className="container mx-auto px-4 py-12 md:py-25 pt-24 min-h-screen">
      
      {/* JSON-LD Scripti: Bu script tarayıcıya görünmez ancak Google tarafından okunur */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Grid */}
      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="max-w-xs">
            <h1 className="text-2xl font-bold md:text-4xl md:leading-tight text-gray-800 py-30 md:py-10">
              Sıkça Sorulan<br />Sorular
            </h1>
            <p className="mt-1 hidden md:block text-gray-600">
              En çok merak edilen soruların cevapları.
            </p>
          </div>
        </div>
        {/* End Col */}

        <div className="md:col-span-3">
          {/* Accordion */}
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                id={faq.id}
                title={faq.title}
                content={faq.content}
                isActive={index === 0} // İlk soruyu başlangıçta açık getirebilirsiniz
              />
            ))}
          </div>
          {/* End Accordion */}
        </div>
        {/* End Col */}
      </div>
      {/* End Grid */}
    </div>
  );
};

export default SSSPage;
