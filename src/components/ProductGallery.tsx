// src/components/ProductGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Yeni prop yapısına uygun arayüz
interface ProductGalleryProps {
  mainImageUrl: string | null;
  galleryImageUrls: string[];
  productName: string; // Opsiyonel, Image alt tag için kullanışlı
}

export default function ProductGallery({
  mainImageUrl,
  galleryImageUrls,
  productName,
}: ProductGalleryProps) {
  // 1. Tüm URL'leri Tek Bir Diziye Birleştirme
  const allUrls = [];
  if (mainImageUrl && mainImageUrl.startsWith("http")) {
    allUrls.push(mainImageUrl);
  }
  // Galeri görsellerini ana görselin arkasına ekle
  allUrls.push(...galleryImageUrls);

  // Eğer hiç görsel yoksa, placeholder kullan
  const finalUrls = allUrls.length > 0 ? allUrls : ["/placeholder.jpg"];

  // İlk görseli varsayılan olarak ayarlıyoruz
  // Eğer finalUrls boşsa bu kod çalışmazdı, ama artık boş olma ihtimali yok.
  const [mainImage, setMainImage] = useState(finalUrls[0]);

  // Dikkat: Eğer ana görselin gelip gelmediğinden emin değilseniz
  // (mainImageUrl null gelirse diye) ilk görsel placeholder olur.

  return (
    <div className="md:col-span-3 order-1 md:order-1">
      {/* Ana Görsel Alanı */}
      <div className="relative w-full h-96 sm:h-[500px] bg-gray-100 rounded-lg overflow-hidden mb-4 shadow-lg">
        <Image
          // mainImage URL'si Supabase URL'si veya /placeholder.jpg olacaktır
          src={mainImage}
          alt={`${productName} - Ana Görsel`}
          fill={true}
          priority={true}
          className="object-contain transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Küçük Görsel Seçimi (Thumbnail) */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {finalUrls.map((url, index) => (
          <motion.div
            // Key olarak URL yerine index kullanıyoruz (URL'ler değişebilir)
            key={index}
            className={`relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-200 ${
              url === mainImage
                ? "border-blue-500 ring-2 ring-blue-500"
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => setMainImage(url)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={url}
              alt={`${productName} - Thumbnail ${index + 1}`}
              fill={true}
              sizes="80px"
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
