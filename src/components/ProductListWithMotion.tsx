"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { ProductForCategory } from "../../lib/supabaseClient";

// Props'un tipini tanımlıyoruz
interface ProductListProps {
  products: ProductForCategory[];
}

export default function ProductListWithMotion({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="p-10 text-center bg-gray-50 rounded-lg">
        <p className="text-xl text-gray-500">
          Bu kategoride henüz ürün bulunmamaktadır.
        </p>
        <p className="mt-2 text-md text-gray-400">
          Yakında yeni ürünler eklenecektir.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1, // Kartların peş peşe gelmesi
          },
        },
      }}
    >
      {products.map((product) => (
        // ProductCard bileşeninizin de "use client" olduğundan emindik
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  );
}
