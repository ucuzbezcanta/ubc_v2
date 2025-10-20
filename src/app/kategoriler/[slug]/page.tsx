import type { Metadata } from "next";
// fetchCategories ve fetchProductsByCategorySlug fonksiyonlarının lib/supabaseClient dosyasından geldiği varsayılmıştır.
import {
  fetchCategories,
  fetchProductsByCategorySlug,
} from "../../../../lib/supabaseClient";
import { notFound } from "next/navigation";
import ProductListWithMotion from "@/components/ProductListWithMotion";

export const revalidate = 600; // Sayfayı 10 dakikada bir yeniden doğrulayın

// ------------------ YENİ ÜRÜN TİPİ TANIMI ------------------
// fetchProductsByCategorySlug fonksiyonunun döndürdüğü ürün listesi için tip.
// categoryName alanı, sayfa bileşeni içinde kullanıldığı için eklenmelidir.
interface ProductWithCategoryName {
    id: string;
    name: string;
    slug: string;
    
    // ZORUNLU EKLENEN ALANLAR (Hata giderme için)
    price: number; // ProductForCategory'de olduğu varsayılan alan
    main_image_url: string; // ProductForCategory'de olduğu varsayılan alan (snake_case)
    
    // Kullanıcının hali hazırda kullandığı alan (Eğer fetch fonksiyonu camelCase döndürüyorsa)
    mainImageUrl: string; 

    // ... Diğer ürün özellikleri (stock, description vb. de burada olmalı)
    categoryName?: string; // Kategori adı
}

// fetchProductsByCategorySlug fonksiyonunun bu yeni tipi döndürdüğü varsayılmıştır.
// Eğer fonksiyonda bu tipin dönüşü tanımlı değilse, o dosyada da güncelleme yapılması gerekir.

// ------------------ STATIC PARAMS (OPSİYONEL AMA İYİ) ------------------
// Build zamanında kategorileri statik olarak üretmek için kullanılır
export async function generateStaticParams() {
  // ÖNEMLİ: Bu fonksiyonun çalışması için fetchCategories fonksiyonunun mevcut olması gerekir.
  // Bu fonksiyonun, kategori adını ve slug'ını içeren bir dizi döndürdüğü varsayılmıştır.
  const categories = await fetchCategories();
  if (!categories) return [];

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// ------------------ DİNAMİK METADATA OLUŞTURUCU (SEO) ------------------

// Next.js tip formatını kullanıyoruz
type CategoryPageParams = { slug: string }; 

export async function generateMetadata({
  params,
}: {
  params: CategoryPageParams; // DÜZELTME: Promise kaldırıldı
}): Promise<Metadata> {
  const { slug } = params;
  
  // 1. Ürünleri çekerek kategori adını bulmaya çalışalım
  // products tipinin ProductWithCategoryName[] olduğu varsayılmıştır.
  const products = (await fetchProductsByCategorySlug(slug)) as ProductWithCategoryName[] | null;
  
  let categoryName = slug
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Eğer ürünler varsa, ilk ürünün kategori adını kullanarak daha kesin bir isim buluruz
  if (products && products.length > 0 && products[0].categoryName) {
    categoryName = products[0].categoryName;
  }
  
  const title = `${categoryName} Toptan Bez Çanta Modelleri | Ucuz Bez Çanta`;
  const description = `${categoryName} kategorisindeki en ucuz, en kaliteli ve baskıya uygun toptan bez çanta modellerini hemen keşfedin. Hızlı teslimat ve uygun fiyat garantisi.`;
  
  return {
    title: title,
    description: description,
    
    alternates: {
        canonical: `/kategoriler/${slug}`,
    },
    
    openGraph: {
        title: title,
        description: description,
        url: `/kategoriler/${slug}`,
        type: 'website',
    }
  };
}


// ------------------ SAYFA KOMPONENTİ ------------------
export default async function CategoryDetailPage({
  params,
}: {
  params: CategoryPageParams; // DÜZELTME: Promise kaldırıldı
}) {
  const { slug } = params;

  // Ürünleri çekerken, eğer veri çekilemezse notFound() çağırarak 404 sayfasına yönlendirilir
  const products = (await fetchProductsByCategorySlug(slug)) as ProductWithCategoryName[] | null;

  if (!products || products.length === 0) {
    // Kategori bulunamazsa veya boşsa notFound çağrılabilir
    notFound(); 
  }

  // Görüntülenecek kategori adını bulma mantığı
  let displayCategoryName = slug
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  
  // HATA DÜZELTİLDİ: products[0].categoryName tip kontrolü eklendi
  if (products[0]?.categoryName) {
      displayCategoryName = products[0].categoryName;
  }

  return (
    <div className="container mx-auto px-4 pt-24 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-3 mb-8">
        {displayCategoryName} Ürünleri ({products.length} Adet)
      </h1>
      
      {/* ProductListWithMotion component'inin products prop'u artık categoryName içeriyor */}
      <ProductListWithMotion products={products} />
    </div>
  );
}
