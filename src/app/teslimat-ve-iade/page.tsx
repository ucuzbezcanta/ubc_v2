import React from 'react';

export default function TeslimatVeIadePage() {
    return (
    <main className="min-h-screen pt-32 pb-16 bg-white text-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
          Teslimat ve İade Politikası
        </h1>

        <div className="space-y-8 text-lg leading-relaxed">
          {/* Teslimat Bölümü */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">1. Teslimat Koşulları</h2>
            <p className="mb-4">
              Ucuz Bez Çanta üzerinden verilen siparişler ve onaylanan teklifler, ürünün stok durumuna ve baskı/kişiselleştirme detaylarına göre işleme alınır.
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li><strong>Üretim Süresi:</strong> Özel baskılı ürünlerde üretim süresi, grafik onayının ardından ortalama 7-10 iş günüdür. Stoklu ham bez çantalarda bu süre daha kısadır.</li>
              <li><strong>Kargo ve Ambar:</strong> Toptan gönderimlerimizde maliyet avantajı sağlamak adına anlaşmalı kargo firmaları veya ambar servisleri kullanılmaktadır.</li>
              <li><strong>Teslimat Kontrolü:</strong> Ürünleri teslim alırken paketi kontrol etmeniz, hasarlı paket durumunda kargo görevlisine tutanak tutturmanız önemle rica olunur.</li>
            </ul>
          </section>

          {/* İade Bölümü */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">2. İade ve Değişim Şartları</h2>
            <p className="mb-4">
              Firmamız ağırlıklı olarak kurumsal talepler ve özel üretim (baskılı) ürünler üzerine hizmet vermektedir. Bu kapsamda iade süreçlerimiz şu şekildedir:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li><strong>Kişiselleştirilmiş Ürünler:</strong> Müşteriye özel logo, yazı veya tasarım baskısı yapılmış ürünlerin, 6502 sayılı Tüketicinin Korunması Hakkında Kanun gereği cayma hakkı kapsamında iadesi mümkün değildir.</li>
              <li><strong>Ayıplı Ürün:</strong> Üretimden kaynaklı bir hata, baskı kayması veya kumaş kusuru durumunda, hatalı ürünlerin değişimi veya telafisi tarafımızca sorgusuz sualsiz yapılmaktadır.</li>
              <li><strong>İade Süresi:</strong> Ayıplı ürün durumunda teslimat tarihinden itibaren 7 iş günü içerisinde bizimle iletişime geçmeniz gerekmektedir.</li>
            </ul>
          </section>

          {/* İptal Bölümü */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">3. Sipariş İptali</h2>
            <p>
              Ödemesi yapılmış ancak henüz üretimine başlanmamış siparişlerinizi aynı gün içerisinde iptal edebilirsiniz. Baskı aşamasına geçilmiş siparişlerde ham madde ve işçilik maliyetleri nedeniyle iptal işlemi gerçekleştirilememektedir.
            </p>
          </section>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-12">
            <p className="text-sm text-gray-500 italic">
              * Bu politika, Ucuz Bez Çanta ve müşterileri arasındaki ticari güveni sağlamak amacıyla hazırlanmıştır. Her türlü sorunuz için iletişim sayfamızdan bize ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}