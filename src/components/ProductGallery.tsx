"use client";

import { useState, useEffect } from "react";
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
  
  // Tüm URL'leri birleştir
  const allUrls = [
    mainImageUrl,
    ...(galleryImageUrls || [])
  ].filter((url): url is string => typeof url === 'string' && url.startsWith("http"));

const finalUrls = allUrls.length > 0 ? allUrls : ["/images/placeholder.jpg"];

  // State'i ilk görselle başlatıyoruz
  const [mainImage, setMainImage] = useState(finalUrls[0]);

  // Ürün değişirse veya görseller yüklenirse state'i güncelle
  useEffect(() => {
    // Dışarıdan gelen görseller değiştiğinde (ürün değişince)
    // ilk görseli ana görsel yap.
    if (mainImageUrl) {
      setMainImage(mainImageUrl);
    } else if (finalUrls[0]) {
      setMainImage(finalUrls[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainImageUrl, galleryImageUrls]); // finalUrls yerine ana prop'ları eklemek daha güvenlidir.

  return (
    <div className="md:col-span-3">
      {/* ANA GÖRSEL */}
      <div className="relative w-full h-96 sm:h-[500px] bg-gray-50 rounded-xl overflow-hidden mb-4 shadow-sm border border-gray-100">
        <Image
          src={mainImage}
          alt={productName}
          fill
          priority
          className="object-contain p-4"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* KÜÇÜK GÖRSELLER */}
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {finalUrls.map((url, index) => (
          <motion.div
            key={index}
            className={`relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all 
              ${url === mainImage ? "border-indigo-600 ring-2 ring-indigo-100" : "border-gray-200"}`}
            onClick={() => setMainImage(url)}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={url} 
              alt={`${productName} ${index}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
