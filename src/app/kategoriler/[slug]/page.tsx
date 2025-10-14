// src/app/kategoriler/[slug]/page.tsx
import {
  fetchCategories,
  fetchProductsByCategorySlug,
} from "../../../../lib/supabaseClient";
import { notFound } from "next/navigation";
import ProductListWithMotion from "@/components/ProductListWithMotion";

export const revalidate = 600;

export async function generateStaticParams() {
  const categories = await fetchCategories();
  if (!categories) return [];

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const categoryName = slug.replace(/-/g, " ").toUpperCase();

  return {
    title: `${categoryName} Ürünleri | Promozone`,
    description: `${categoryName} kategorisindeki en yeni ve popüler ürünleri inceleyin.`,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const products = await fetchProductsByCategorySlug(slug);

  if (!products) {
    notFound();
  }

  const displayCategoryName = slug
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="container mx-auto px-4 pt-24 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-3 mb-8">
        {displayCategoryName} Ürünleri ({products.length})
      </h1>

      <ProductListWithMotion products={products} />
    </div>
  );
}
