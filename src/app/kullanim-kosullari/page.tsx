import React from 'react';

export default function KullanimKosullariPage() {
  return (
    <main className="min-h-screen pt-32 pb-16 bg-white text-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
          Kullanım Koşulları
        </h1>

        <div className="space-y-8 text-lg leading-relaxed">
          {/* Kabul */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">1. Hizmet Şartlarının Kabulü</h2>
            <p>
              ucuzbezcanta.com web sitesine erişerek ve kullanarak, bu kullanım koşullarının tamamını okuduğunuzu, anladığınızı ve bu şartlara bağlı kalmayı kabul ettiğinizi beyan etmiş olursunuz. Şartları kabul etmiyorsanız, lütfen sitemizi kullanmayınız.
            </p>
          </section>

          {/* Telif Hakları */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">2. Fikri Mülkiyet ve Telif Hakları</h2>
            <p className="mb-4">
              Sitede yer alan tüm içerikler (tasarımlar, ürün fotoğrafları, logolar, metinler ve grafikler) <strong>TEK TANITIM REKLAMCILIK TEKSTİL DIŞ TİC SAN VE TİC LTD ŞTİ</strong> markasına ve iştiraklerine aittir.
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Ürün görsellerinin izinsiz kopyalanması ve ticari amaçla başka mecralarda kullanılması yasaktır.</li>
              <li>Sitedeki içeriklerin paylaşılması durumunda kaynak gösterilmesi zorunludur.</li>
            </ul>
          </section>

          {/* Teklif ve Fiyatlandırma */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">3. Teklif ve Bilgilendirme</h2>
            <p className="mb-4">
              Sitemiz bir doğrudan e-ticaret satış platformu değil, bir ürün sergileme ve teklif toplama portalıdır.
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Ürün sayfalarında belirtilen özellikler ve görsel temsiller genel bilgilendirme amaçlıdır.</li>
              <li>Sunulan fiyat teklifleri; ham madde maliyetleri ve döviz kurlarındaki değişiklikler nedeniyle belirli bir geçerlilik süresine sahiptir.</li>
              <li>Yazım hataları veya teknik aksaklıklar nedeniyle oluşan yanlış bilgilendirmelerden firmamız sorumlu tutulamaz.</li>
            </ul>
          </section>

          {/* Kullanıcı Sorumluluğu */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">4. Kullanıcı Yükümlülükleri</h2>
            <p>
              İletişim formlarını doldururken verdiğiniz bilgilerin doğruluğundan kullanıcı sorumludur. Sitenin güvenliğini tehlikeye atacak, veri madenciliği veya bot kullanımı gibi aktiviteler kesinlikle yasaktır.
            </p>
          </section>

          {/* Değişiklik Hakları */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">5. Koşulların Değiştirilmesi</h2>
            <p>
              Ucuz Bez Çanta, işbu kullanım koşullarını dilediği zaman önceden haber vermeksizin güncelleme hakkını saklı tutar. Güncel koşullar site üzerinde yayınlandığı andan itibaren geçerlilik kazanır.
            </p>
          </section>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-12">
            <p className="text-sm text-gray-500">
              Sorularınız ve önerileriniz için <strong>info@ucuzbezcanta.com</strong> üzerinden bizimle iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}