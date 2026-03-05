import React from 'react';

export default function GizlilikPolitikasiPage() {
  return (
    <main className="min-h-screen pt-32 pb-16 bg-white text-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
          Gizlilik Politikası
        </h1>

        <div className="space-y-8 text-lg leading-relaxed">
          {/* Veri Toplama */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">1. Toplanan Veriler</h2>
            <p className="mb-4">
              Ucuz Bez Çanta (ucuzbezcanta.com) olarak, ziyaretçilerimizin gizliliğine önem veriyoruz. Sitemizdeki iletişim formu aracılığıyla bize ilettiğiniz şu bilgileri topluyoruz:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Adınız ve Soyadınız</li>
              <li>E-posta Adresiniz</li>
              <li>Mesaj içeriğinde paylaştığınız diğer iletişim detayları</li>
            </ul>
          </section>

          {/* Veri Kullanımı */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">2. Verilerin Kullanım Amacı</h2>
            <p className="mb-4">
              Topladığımız kişisel veriler, yalnızca aşağıdaki amaçlar doğrultusunda kullanılır:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Talep ettiğiniz ürünler için fiyat teklifi hazırlamak.</li>
              <li>Sipariş ve üretim süreçleri hakkında bilgilendirme yapmak.</li>
              <li>Sorularınıza yanıt vermek ve müşteri desteği sağlamak.</li>
            </ul>
            <p className="mt-4 font-medium text-gray-900">
              Verileriniz, açık rızanız olmadan asla üçüncü şahıslarla veya reklam platformlarıyla paylaşılmaz.
            </p>
          </section>

          {/* Çerezler */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">3. Çerezler (Cookies)</h2>
            <p>
              Sitemiz, kullanıcı deneyimini iyileştirmek ve site trafiğini analiz etmek (Google Analytics gibi araçlar vasıtasıyla) amacıyla temel çerezler kullanabilir. Tarayıcı ayarlarınızdan çerezleri yönetebilir veya reddedebilirsiniz.
            </p>
          </section>

          {/* Veri Güvenliği */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">4. Veri Güvenliği</h2>
            <p>
              Paylaştığınız bilgiler, güvenli sunucularımızda ve Supabase altyapısında şifrelenmiş olarak saklanmaktadır. Yetkisiz erişimi engellemek için teknik ve idari tedbirler tarafımızca alınmaktadır.
            </p>
          </section>

          {/* İletişim */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">5. Haklarınız ve İletişim</h2>
            <p>
              KVKK kapsamında, verilerinizin silinmesini talep etme veya hangi verilerinizin saklandığını öğrenme hakkına sahipsiniz. Bu talepleriniz için bize <strong>info@ucuzbezcanta.com</strong> adresinden ulaşabilirsiniz.
            </p>
          </section>

          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mt-12">
            <p className="text-sm text-indigo-700">
              * Bu politika en son <strong>Mart 2026</strong> tarihinde güncellenmiştir. Ucuz Bez Çanta, gizlilik şartlarını değiştirme hakkını saklı tutar.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}