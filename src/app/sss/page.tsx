import React from "react";
import AccordionItem from "@/components/AccordionItem";

export const revalidate = 3600;

const SSSPage: React.FC = () => {
  // S.S.S. verilerinizi burada tanımlayabilirsiniz veya Supabase'den çekebilirsiniz
  const faqs = [
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

  return (
    <div className="container mx-auto px-4 py-12 md:py-25">
      {/* Grid */}
      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="max-w-xs">
            <h1 className="text-2xl font-bold md:text-4xl md:leading-tight text-gray-800 dark:text-white py-30 md:py-10">
              Sıkça Sorulan<br />Sorular
            </h1>
            <p className="mt-1 hidden md:block text-gray-600 dark:text-neutral-400">
              En çok merak edilen soruların cevapları.
            </p>
          </div>
        </div>
        {/* End Col */}

        <div className="md:col-span-3">
          {/* Accordion */}
          <div className="divide-y divide-gray-200 dark:divide-neutral-700">
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