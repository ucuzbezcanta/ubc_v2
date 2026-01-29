import type { Metadata } from "next";
import { fetchRelatedProducts, supabase } from "../../../../lib/supabaseClient";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageHelper";
import RelatedProducts from "@/components/RelatedProducts";

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
  categoryId: string;
}

// ------------------ VERİ ÇEKME ------------------
async function getProductDetail(slug: string): Promise<ProcessedProduct | null> {
  const { data: productData, error: productError } = await supabase
    .from("products")
    .select("*, category_id!inner(id, name, slug)")
    .eq("slug", slug)
    .single();

  if (productError || !productData) {
    console.error("Ürün çekme hatası:", productError?.message);
    return null;
  }

  const categoryInfo = productData.category_id as {id: string; name: string; slug: string } | null;
  const categoryName = categoryInfo?.name || null;
  const categorySlug = categoryInfo?.slug || null;

  // --- GALERİ MANTIĞINI SADELEŞTİRİYORUZ ---
  let galleryUrls: string[] = [];

  // Eğer veri zaten bir dizi ise doğrudan kullan (Yeni sistem)
  if (Array.isArray(productData.gallery_image_urls)) {
    galleryUrls = productData.gallery_image_urls.map((url: string) => getImageUrl(url));
  }
  // Eğer eski veriler yüzünden string geliyorsa (Fallback)
  else if (typeof productData.gallery_image_urls === "string") {
    try {
      // JSON formatındaysa parse et, değilse temizle
      const parsed = JSON.parse(productData.gallery_image_urls);
      galleryUrls = Array.isArray(parsed) ? parsed.map((url: string) => getImageUrl(url)) : [];
    } catch {
      galleryUrls = productData.gallery_image_urls
        .replace(/[{}"]/g, "")
        .split(",")
        .map((url: string) => url.trim())
        .map((url: string) => getImageUrl(url));
    }
  }

  return {
    id: productData.id,
    name: productData.name,
    slug: productData.slug,
    description: productData.description,
    price: productData.price,
    stock: productData.stock || 0,
    mainImageUrl: getImageUrl(productData.main_image_url),
    galleryImageUrls: galleryUrls,
    categoryName,
    categorySlug,
    categoryId: categoryInfo ? categoryInfo.id : "",
  };
}


// ------------------ DİNAMİK METADATA (SEO) ------------------
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductDetail(slug);

  if (!product) {
    return {
      title: "Ürün Bulunamadı | Ucuz Bez Çanta",
      description:
        "Aradığınız bez çanta modeline ulaşılamadı. Lütfen ürün kataloğumuzu inceleyin.",
    };
  }

  const categoryName = product.categoryName || "Çanta";
  const safeDescription =
    product.description ||
    `Toptan ${product.name} modelimiz. Detaylı bilgi için bize ulaşın.`;

  const title = `${product.name} Toptan Fiyatları | Baskılı ${categoryName}`;
  const description = `${safeDescription.substring(0, 150)}... En uygun toptan fiyatları ve baskı seçeneklerini hemen keşfedin.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/urunler/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/urunler/${slug}`,
      type: "website",
      images: [
        {
          url: product.mainImageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

// ------------------ SAYFA KOMPONENTİ ------------------
export default async function ProductDetailPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params; // artık await gerekiyor
  const product = await getProductDetail(slug);

  if (!product) notFound();

  const relatedProducts = await fetchRelatedProducts(product.categoryId, product.id);


  const whatsappPhoneNumber = "905339780835";
  const whatsappMessage = encodeURIComponent(
    `Merhaba, "${product.name}" ürünü hakkında bilgi almak istiyorum.`
  );
  const whatsappLink = `https://wa.me/${whatsappPhoneNumber}?text=${whatsappMessage}`;

 return (
  <div className="container mx-auto px-4 pt-28 md:pt-32 pb-12 max-w-7xl min-h-screen">
    {/* Breadcrumb - Hafifletilmiş Tasarım */}
    <nav className="text-sm text-gray-400 mb-8 px-1" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:text-indigo-600 transition-colors">Anasayfa</Link>
        </li>
        {product.categorySlug && (
          <>
            <li className="text-gray-300">/</li>
            <li>
              <Link href={`/kategoriler/${product.categorySlug}`} className="hover:text-indigo-600 transition-colors">
                {product.categoryName}
              </Link>
            </li>
          </>
        )}
        <li className="text-gray-300">/</li>
        <li className="text-gray-600 font-medium truncate max-w-[200px]">{product.name}</li>
      </ol>
    </nav>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
      {/* SOL: Ürün Galerisi (7 Kolon) */}
      <div className="lg:col-span-7 w-full">
        <div className="lg:sticky lg:top-28">
          <ProductGallery
            mainImageUrl={product.mainImageUrl}
            galleryImageUrls={product.galleryImageUrls}
            productName={product.name}
          />
        </div>
      </div>

      {/* SAĞ: Ürün Detayları (5 Kolon) */}
      <div className="lg:col-span-5 flex flex-col space-y-8">
        <header>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
              {product.categoryName}
            </span>
            <div className="h-4 w-[1px] bg-gray-200"></div>
            <span className="text-sm font-medium text-green-600 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Stokta Mevcut
            </span>
          </div>
        </header>

        {/* WhatsApp Teklif Kartı */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Toptan Fiyat Talebi</p>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Hızlı Fiyat Teklifi İçin Bizimle İletişime Geçin</h2>
            
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1eb956] text-white font-extrabold py-4 px-8 rounded-xl shadow-xl shadow-green-100 transition-all active:scale-95 group"
            >
              {/* Basit bir WhatsApp İkonu (SVG yoksa bile metin yeterli) */}
              <span className="text-lg">WhatsApp İle Bilgi Al</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="with 14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
            
            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
              <span>✓ Ücretsiz Tasarım</span>
              <span>✓ Hızlı Gönderim</span>
              <span>✓ Baskı Desteği</span>
            </div>
          </div>
        </div>

        {/* Ürün Açıklaması */}
        <section className="border-t pt-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Ürün Detayları</h3>
          <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description || "Ürün teknik detayları için bizimle iletişime geçebilirsiniz."}
          </div>
        </section>

        {/* Bilgilendirme Kutusu */}
        <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-50">
          <p className="text-xs text-indigo-900 leading-relaxed">
            <strong>Not:</strong> Ürünlerimiz toptan üretimdir. Baskılı veya baskısız siparişleriniz için minimum sipariş adetlerini WhatsApp üzerinden öğrenebilirsiniz.
          </p>
        </div>
      </div>
    </div>
    {/* Benzer Ürünler Bölümü */}
    <RelatedProducts products={relatedProducts} />
  </div>
  );
}
