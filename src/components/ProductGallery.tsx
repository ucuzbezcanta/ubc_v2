"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Yeni prop yapısına uygun arayüz
interface ProductGalleryProps {
  mainImageUrl: string | null;
  // Supabase'den gelebilecek undefined/null değerleri kontrol etmek için
  galleryImageUrls: (string | null | undefined)[]; 
  productName: string; 
}

export default function ProductGallery({
  mainImageUrl,
  galleryImageUrls,
  productName,
}: ProductGalleryProps) {
  
  // 1. Tüm geçerli URL'leri Tek Bir Diziye Birleştirme
  const allUrls: string[] = [];
  
  // Ana görseli ekle (Sadece geçerli bir URL ise)
  if (mainImageUrl && typeof mainImageUrl === 'string' && mainImageUrl.startsWith("http")) {
    allUrls.push(mainImageUrl);
  }

  // Galeri görsellerini ekle ve boş olanları atla
  galleryImageUrls.forEach(url => {
      // Sadece string olan ve http ile başlayan geçerli URL'leri al
      if (typeof url === 'string' && url.startsWith("http")) {
          allUrls.push(url);
      }
  });

  // Eğer hiç görsel yoksa, placeholder kullan
  const finalUrls = allUrls.length > 0 ? allUrls : ["/placeholder.jpg"];

  // İlk görseli varsayılan olarak ayarlıyoruz
  const [mainImage, setMainImage] = useState(finalUrls[0]);

  return (
    <div className="md:col-span-3 order-1 md:order-1">
      {/* --------------------------- ANA GÖRSEL ALANI --------------------------- */}
      <div className="relative w-full h-96 sm:h-[500px] bg-gray-100 rounded-lg overflow-hidden mb-4 shadow-lg">
        <Image
          // Ana görsel için state'teki URL kullanılır
          src={mainImage}
          alt={`${productName} - Ana Görsel`}
          fill={true}
          priority={true}
          className="object-contain transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          // Hata durumunda placeholder'a dönme (Çok Önemli Debug/FallBack)
          onError={() => setMainImage("/placeholder.jpg")}
        />
      </div>

      {/* --------------------------- KÜÇÜK GÖRSEL SEÇİMİ (THUMBNAIL) --------------------------- */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {finalUrls.map((url, index) => (
          <motion.div
            key={index}
            className={`relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-200 
              ${url === mainImage
                ? "border-indigo-500 ring-2 ring-indigo-500"
                : "border-gray-200 hover:border-indigo-300"
              }`
            }
            // Tıklanınca ana görseli bu URL ile değiştir
            onClick={() => setMainImage(url)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              // Thumbnail için döngüdeki URL kullanılır
              src={url} 
              alt={`${productName} - Thumbnail ${index + 1}`}
              fill={true}
              sizes="80px"
              className="object-cover"
              // Küçük resimde hata olursa onu gösterme
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
