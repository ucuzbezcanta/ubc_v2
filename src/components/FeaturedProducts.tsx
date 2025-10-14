// src/components/FeaturedProducts.tsx
import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "../../lib/supabaseClient";

// Fiyat formatlama yardımcısı
const formatPrice = (price: number) => {
  return price.toFixed(2).replace(".", ",") + " ₺";
};

export default async function FeaturedProducts() {
  // Sunucuda veri çekme
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Başlık */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Öne Çıkan Ürünler
      </h2>

      {/* Ürün Kartları Kapsayıcısı (Kategorilerle aynı responsive düzen) */}
      <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 md:gap-6 pb-4 md:pb-0">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/urunler/${product.slug}`} // Detay sayfası linki
            className="flex-shrink-0 w-44 md:w-auto group block"
          >
            {/* Ürün Görseli (Kare içinde) */}
            <div className="w-full h-60 md:h-80 relative rounded-xl overflow-hidden shadow-md transition duration-300 group-hover:shadow-xl">
              {/* HATA DÜZELTME BURADA YAPILIYOR */}
              {product.main_image_url ? (
                <Image
                  // src'nin string olduğunu garanti ediyoruz
                  src={product.main_image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 45vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                // Eğer görsel yoksa, bir placeholder (yer tutucu) göster
                <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                  Görsel Yok
                </div>
              )}
            </div>

            {/* Ürün Bilgileri (Görsel Altında) */}
            <div className="mt-3 text-left">
              {/* Ürün Adı */}
              <h3 className="text-md font-semibold text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {product.name}
              </h3>

              {/* Fiyat */}
              <p className="text-lg font-bold text-indigo-600 mt-1">
                {formatPrice(product.price)}
              </p>

              {/* Kategori Adı */}
              <span className="text-xs text-gray-500">
                {product.category_name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
