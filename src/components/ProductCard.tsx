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
      className=" rounded-lg shadow-xl overflow-hidden bg-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }} // Hover efekti ekleyelim
      whileTap={{ scale: 0.95 }}
    >
      <Link href={`/urunler/${product.slug}`}>
        <div className="relative w-full h-48">
          <Image
            src={product.main_image_url || "/placeholder.jpg"}
            alt={product.name}
            fill={true}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-gray-600 mt-2">{product.price} TL</p>
        </div>
      </Link>
    </motion.div>
  );
}
