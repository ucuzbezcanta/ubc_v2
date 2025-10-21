"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchProducts, ProductForCategory } from "../../../lib/supabaseClient";
import ProductListWithMotion from "@/components/ProductListWithMotion";
import { Search } from "lucide-react";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const [products, setProducts] = useState<ProductForCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (query) {
        setLoading(true);
        const result = await searchProducts(query);
        if (result) setProducts(result);
        setLoading(false);
      }
    };
    fetch();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pt-24 min-h-screen">
      <div className="flex items-center space-x-3 mb-8 border-b pb-4">
        <Search className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-extrabold text-gray-900">Arama Sonuçları</h1>
      </div>

      {!query ? (
        <div className="text-center py-16 text-gray-500">
          Lütfen arama yapmak için bir anahtar kelime girin.
        </div>
      ) : loading ? (
        <div className="text-center py-16 text-gray-500">Yükleniyor...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          Üzgünüz, <strong>{query}</strong> ile eşleşen hiçbir ürün bulunamadı.
        </div>
      ) : (
        <div className="space-y-8">
          <p className="text-lg text-gray-600 font-medium">
            <strong>{query}</strong> kelimesi ile <strong>{products.length}</strong> ürün bulundu.
          </p>
          <ProductListWithMotion products={products} />
        </div>
      )}
    </div>
  );
}
