import type { Metadata } from "next"; // Metadata import edildi
import { searchProducts, ProductForCategory } from "../../../lib/supabaseClient";
import ProductListWithMotion from "@/components/ProductListWithMotion";
import { Search } from "lucide-react";

// DÜZELTME: searchParams tipini basitleştiriyoruz. Next.js App Router
// searchParams'ı direkt olarak döndürdüğü için Promise'e gerek yoktur.
interface SearchParams {
  q?: string;
  [key: string]: string | string[] | undefined;
}

interface SearchPageProps {
  // DÜZELTME: Artık Promise değil, direkt obje.
  searchParams: SearchParams; 
}


// ------------------ METADATA ------------------

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  // DÜZELTME: searchParams artık Promise olmadığı için await kaldırıldı.
  const query = searchParams.q || "";
  const displayQuery = query.trim() || "Tüm Ürünler";

  const title = `"${displayQuery}" Arama Sonuçları | UcuzBezCanta`;
  const description = `"${displayQuery}" kelimesi ile UcuzBezCanta ürünlerinde yapılan en güncel arama sonuçları. Aradığınız toptan bez çanta, kanvas çanta ve promosyon ürünlerini hemen bulun.`;

  return {
    title: title,
    description: description,
    
    // ÖNEMLİ: Canonical URL'yi arama sorgusu ile birlikte veriyoruz
    alternates: {
        canonical: `/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
    },
    
    // OpenGraph
    openGraph: {
        title: title,
        description: description,
        url: `/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
        type: 'website',
    }
  };
}


// ------------------ SAYFA BİLEŞENİ ------------------

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // DÜZELTME: searchParams artık Promise olmadığı için await kaldırıldı.
  const query = searchParams.q || "";

  let products: ProductForCategory[] = [];

  if (query.trim()) {
    // searchProducts fonksiyonunun var olduğu ve ProductForCategory[] döndürdüğü varsayılmıştır.
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
