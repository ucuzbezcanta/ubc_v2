"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SafeImage from "./SafeImage";

interface ProductGalleryProps {
  mainImageUrl: string | null;
  galleryImageUrls: (string | null | undefined)[];
  productName: string;
}

export default function ProductGallery({
  mainImageUrl,
  galleryImageUrls,
  productName,
}: ProductGalleryProps) {
  const finalUrls = useMemo(() => {
    const allUrls = [mainImageUrl, ...(galleryImageUrls || [])].filter(
      (url): url is string => typeof url === "string" && url.startsWith("http")
    );

    return allUrls.length > 0 ? allUrls : ["/images/placeholder.jpg"];
  }, [mainImageUrl, galleryImageUrls]);

  const [mainImage, setMainImage] = useState(finalUrls[0]);

  useEffect(() => {
    if (mainImageUrl) {
      setMainImage(mainImageUrl);
    } else {
      setMainImage(finalUrls[0]);
    }
  }, [mainImageUrl, finalUrls]);

  return (
    <div className="w-full">
      {/* ANA GÖRSEL KONTEYNERI */}
      <div className="relative aspect-square w-full bg-white rounded-3xl overflow-hidden mb-6 shadow-xl shadow-gray-100 border border-gray-100 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={mainImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <SafeImage
              src={mainImage}
              alt={`${productName} - Toptan Baskılı Bez Çanta Modelleri`}
              fill
              priority
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-3xl z-20" />
      </div>

      {/* KÜÇÜK GÖRSELLER (THUMBNAILS) */}
      <div className="flex gap-4 overflow-x-auto py-2 px-1 scrollbar-hide select-none">
        {finalUrls.map((url, index) => (
          <motion.button
            key={index}
            type="button"
            onClick={() => setMainImage(url)}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300
              ${
                url === mainImage
                  ? "border-indigo-600 shadow-lg shadow-indigo-100 scale-105"
                  : "border-transparent hover:border-gray-300 shadow-sm"
              }`}
          >
            <SafeImage
              src={url}
              alt={`${productName} detaylı görünüm ${index} - Ucuz Bez Çanta`}
              fill
              sizes="80px"
              className={`object-cover ${
                url === mainImage ? "opacity-100" : "opacity-70 hover:opacity-100"
              }`}
            />
          </motion.button>
        ))}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}