import React from "react";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Hakkımızda | Ucuz Bez Çanta', // Sayfanın içeriğine özel başlık
    description: 'Ucuz Bez Çanta hakkında bilgi edinin. Misyonumuz, vizyonumuz ve toptan bez çanta üretimindeki uzmanlığımız hakkında detaylı bilgi.', // Sayfanın içeriğine özel açıklama
    keywords: ['ucuz bez çanta hakkında', 'bez çanta misyonu', 'bez çanta vizyonu', 'şirket bilgileri'], // Sayfaya özel anahtar kelimeler
    openGraph: {
      title: 'Hakkımızda | Ucuz Bez Çanta',
      description: 'Ucuz Bez Çanta hakkında bilgi edinin. Misyonumuz, vizyonumuz ve toptan bez çanta üretimindeki uzmanlığımız hakkında detaylı bilgi.',
      url: 'https://www.ucuzbezcanta.com/hakkimizda', // Bu sayfanın URL'si
      siteName: 'Ucuz Bez Çanta',
      images: [
        {
          url: 'https://ucuzbezcanta.com/logo.svg',
          width: 1200,
          height: 630,
          alt: 'Ucuz bez çanta Logo Ana Görsel',
        },
      ],
      locale: 'tr_TR',
      type: 'article',
    },
};

const AboutPage:React.FC = () => {
    return(
        
    <div className="container mx-auto px-4 py-12 md:py-25">
      {/* Hikayemiz Bölümü */}
      <h2 className="py-30 md:py-10 mb-4 text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Hakkımızda</h2>
      <section className="flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24">
        {/* Metin İçerik */}
        <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Hikayemiz
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Ucuzbezçanta olarak Tek Tanıtım Şirketleri Grubu bünyesinde 10 yıldır çanta üretimi yapmaktayız. Firmamız 1800 m2 kapalı alana sahip 6 katlı bir tesis olup A’dan Z’ye tüm üretim süreci kendi bünyemizde gerçekleşmektedir.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Profesyonel ekibimiz ile iletişime geçerek her türlü desteği alabilirsiniz.
          </p>
        </div>

        {/* Görsel */}
        <div className="md:w-1/2 relative flex justify-center items-center">
          <div className="relative w-full max-w-lg min-h-[16rem] sm:min-h-[20rem] md:min-h-[24rem]">
            <Image
                src="/images/about_1.png"
                alt="Hikayemiz"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
            <div className="absolute inset-0 border-2 border-white transform translate-x-4 translate-y-4 -z-10 rounded-lg"></div>
            </div>
        </div>
      </section>

      {/* Misyonumuz Bölümü */}
      <section className="flex flex-col md:flex-row-reverse items-center justify-between mb-24 md:mb-24">
        {/* Metin İçerik */}
        <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Misyonumuz
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Misyonumuz, öncelikle müşteri memnuniyeti olmakla beraber, çevreye duyarlı ürünler üretmektir. Bize güvenen ve sipariş veren tüm müşterilerimiz aslında müşteri gözüyle değil ile ortağı mantığı ile yaklaşmaktayız ve bu yapılan tüm işlerin en iyi şekilde çıkmasını sağlamaktadır.
          </p>
        </div>

        {/* Görsel */}
        <div className="md:w-1/2 relative flex justify-center items-center mb-15 md:mb-2">
          <div className="relative w-full max-w-lg min-h-64 h-64 sm:h-80 md:h-96"> {/* Maksimum genişlik ve yükseklik ayarı */}
            <Image
              src="/images/about_2.jpg"
            alt="Hikayemiz"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
            {/* Beyaz kenarlık için div, ekran görüntüsündeki gibi */}
            <div className="absolute inset-0 border-2 border-white transform -translate-x-4 -translate-y-4 -z-10 rounded-lg"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;