import type { Metadata } from "next";
import {
  fetchCategories,
  fetchProductsByCategorySlug,
} from "../../../../lib/supabaseClient";
import { notFound } from "next/navigation";
import ProductListWithMotion from "@/components/ProductListWithMotion";

export const revalidate = 600;

interface ProductWithCategoryName {
  id: string;
  name: string;
  slug: string;
  price: number;
  main_image_url: string;
  mainImageUrl: string;
  categoryName?: string;
}

export async function generateStaticParams() {
  const categories = await fetchCategories();
  if (!categories) return [];
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// ✅ Next.js 15 uyumlu tip:
type CategoryPageParams = { slug: string };
type CategoryPageProps = { params: Promise<CategoryPageParams> };

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params; // ✅ Artık Promise olduğu için await ettik

  const products = (await fetchProductsByCategorySlug(slug)) as
    | ProductWithCategoryName[]
    | null;

  let categoryName = slug
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  if (products && products.length > 0 && products[0].categoryName) {
    categoryName = products[0].categoryName;
  }

  const title = `${categoryName} Toptan Bez Çanta Modelleri | Ucuz Bez Çanta`;
  const description = `${categoryName} kategorisindeki en ucuz, en kaliteli ve baskıya uygun toptan bez çanta modellerini hemen keşfedin. Hızlı teslimat ve uygun fiyat garantisi.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/kategoriler/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/kategoriler/${slug}`,
      type: "website",
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params; // ✅ Promise olduğu için await ettik

  const products = (await fetchProductsByCategorySlug(slug)) as
    | ProductWithCategoryName[]
    | null;

  if (!products || products.length === 0) {
    notFound();
  }

  let displayCategoryName = slug
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  if (products[0]?.categoryName) {
    displayCategoryName = products[0].categoryName;
  }

  return (
    <div className="container mx-auto px-4 pt-24 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-3 mb-8">
        {displayCategoryName} Ürünleri ({products.length} Adet)
      </h1>
      <ProductListWithMotion products={products} />
    </div>
  );
}
