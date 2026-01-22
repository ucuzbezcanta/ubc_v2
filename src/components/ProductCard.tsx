// src/components/ProductCard.tsx
"use client"; // BU ÇOK ÖNEMLİ! Bu dosyayı Client Component yapar.

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// Ürün veri tipi
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  main_image_url: string | null;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group cursor-pointer"
    >
      <Link href={`/urunler/${product.slug}`}>
      {/* Görsel Alanı - Dikey Oran (Aspect Ratio) */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#F9F9F9]">
          <Image
            src={product.main_image_url || "/placeholder.jpg"}
            alt={product.name}
            fill={true}
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
             <span className="text-[14px] tracking-widest uppercase font-semibold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
               İncele
             </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-start space-y-1 px-1">
          <h2 className="text-[13px] md:text-sm font-medium text-gray-800 uppercase tracking-tight group-hover:text-gray-500 transition-colors">{product.name}</h2>
        </div>
        <div className="h-[1px] w-0 bg-black transition-all duration-300 group-hover:w-full"></div>
        
      </Link>
    </motion.div>
  );
}
