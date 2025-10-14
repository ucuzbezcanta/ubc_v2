import { supabase } from "../../../../lib/supabaseClient";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import Link from "next/link";

export const revalidate = 600;

// ------------------ TİPLER ------------------
interface ProcessedProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  mainImageUrl: string;
  galleryImageUrls: string[];
  categoryName: string | null;
  categorySlug: string | null;
}

interface ProductPageParams {
  slug: string;
}

// ------------------ VERİ ÇEKME ------------------
async function getProductDetail(slug: string): Promise<ProcessedProduct | null> {
  const { data: productData, error: productError } = await supabase
    .from("products")
    .select("*, main_image_url, gallery_image_urls, category_id(name, slug)")
    .eq("slug", slug)
    .single();

  if (productError || !productData) return null;

  const categoryInfo = productData.category_id as {
    name: string;
    slug: string;
  } | null;

  const categoryName = categoryInfo?.name || null;
  const categorySlug = categoryInfo?.slug || null;

  let galleryUrls: string[] = [];
  const galleryData = productData.gallery_image_urls;

  if (Array.isArray(galleryData)) {
    galleryUrls = galleryData;
  } else if (typeof galleryData === "string" && galleryData.length > 0) {
    let cleanString = galleryData.trim().replace(/['"{}*]/g, "");
    if (cleanString.startsWith("{") && cleanString.endsWith("}")) {
      cleanString = cleanString.slice(1, -1).trim();
    }
    galleryUrls = cleanString
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.startsWith("http"));
  }

  const defaultPlaceholderImage = "/images/placeholder.jpg";
  const finalMainImageUrl = productData.main_image_url || defaultPlaceholderImage;

  return {
    id: productData.id,
    name: productData.name,
    slug: productData.slug,
    description: productData.description,
    price: productData.price,
    stock: productData.stock,
    mainImageUrl: finalMainImageUrl,
    galleryImageUrls: galleryUrls,
    categoryName,
    categorySlug,
  };
}

// ------------------ METADATA ------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<ProductPageParams>;
}) {
  const { slug } = await params;
  const product = await getProductDetail(slug);

  if (!product) return { title: "Ürün Bulunamadı" };

  const description =
    product.description?.slice(0, 150) || `${product.name} hakkında detaylı bilgi.`;

  return {
    title: `${product.name} | UcuzBezCanta`,
    description,
    openGraph: { images: [product.mainImageUrl] },
  };
}

// ------------------ SAYFA KOMPONENTİ ------------------
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<ProductPageParams>;
}) {
  const { slug } = await params;
  const product = await getProductDetail(slug);

  if (!product) notFound();

  const whatsappPhoneNumber = "905339780835";
  const whatsappMessage = encodeURIComponent(
    `Merhaba, "${product.name}" ürünü hakkında bilgi almak istiyorum.`
  );
  const whatsappLink = `https://wa.me/${whatsappPhoneNumber}?text=${whatsappMessage}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pt-24 min-h-screen">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Anasayfa
            </Link>
          </li>
          {product.categorySlug && product.categoryName && (
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <Link
                href={`/kategoriler/${product.categorySlug}`}
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {product.categoryName}
              </Link>
            </li>
          )}
          <li className="flex items-center text-gray-700">
            <span className="text-gray-400 mx-2">/</span>
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
        <div className="md:col-span-3 lg:sticky lg:top-24 h-fit">
          <ProductGallery
            mainImageUrl={product.mainImageUrl}
            galleryImageUrls={product.galleryImageUrls}
            productName={product.name}
          />
        </div>

        <div className="md:col-span-2 order-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>

          {product.categoryName && (
            <p className="text-gray-600 text-lg mb-4">
              Kategori:{" "}
              <Link
                href={`/kategoriler/${product.categorySlug}`}
                className="text-indigo-600 hover:underline"
              >
                {product.categoryName}
              </Link>
            </p>
          )}

          <p className="text-4xl font-bold text-indigo-700 mb-6">
            {product.price.toFixed(2)} ₺ den başlayan fiyatlar
          </p>
          <p className="text-xl text-gray-700 mb-6">
            Stok Durumu:{" "}
            {product.stock > 0
              ? `Stokta Var (${product.stock} Adet)`
              : "Stokta Yok"}
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Ürün Açıklaması
          </h3>
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-8">
            {product.description ? (
              <p>{product.description}</p>
            ) : (
              <p>Ürün açıklaması bulunmamaktadır.</p>
            )}
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
          >
            WhatsApp ile Bilgi Al
          </a>
        </div>
      </div>
    </div>
  );
}
