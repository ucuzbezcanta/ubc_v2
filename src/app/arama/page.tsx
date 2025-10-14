import { searchProducts, ProductForCategory } from "../../../lib/supabaseClient";
import ProductListWithMotion from "@/components/ProductListWithMotion";
import { Search } from "lucide-react";

interface SearchParams {
  q?: string;
  [key: string]: string | string[] | undefined;
}


interface SearchPageProps {
  searchParams: Promise<SearchParams>;
}


// METADATA

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "Tüm";

  return {
    title: `"${query}" Arama Sonuçları | UcuzBezCanta`,
    description: `"${query}" kelimesi ile UcuzBezCanta ürünlerinde yapılan arama sonuçları.`,
  };
}


// SAYFA BİLEŞENİ

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";

  let products: ProductForCategory[] = [];

  if (query.trim()) {
    const fetchedProducts = await searchProducts(query.trim());
    if (fetchedProducts) {
      products = fetchedProducts;
    }
  }

  const displayQuery = query.trim();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pt-24 min-h-screen">
      <div className="flex items-center space-x-3 mb-8 border-b pb-4">
        <Search className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-extrabold text-gray-900">
          Arama Sonuçları
        </h1>
      </div>

      {!displayQuery ? (
        <div className="text-center py-16 text-gray-500">
          Lütfen arama yapmak için bir anahtar kelime girin.
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          Üzgünüz, <strong>{displayQuery}</strong> ile eşleşen hiçbir ürün bulunamadı.{" "}
          Lütfen farklı kelimelerle tekrar deneyin.
        </div>
      ) : (
        <div className="space-y-8">
          <p className="text-lg text-gray-600 font-medium">
            <strong>{displayQuery}</strong> kelimesi ile{" "}
            <strong>{products.length}</strong> ürün bulundu.
          </p>

          <ProductListWithMotion products={products} />
        </div>
      )}
    </div>
  );
}
