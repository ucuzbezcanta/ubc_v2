// src/app/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or key is missing from environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ====================================================================
// VERİ TİPLERİ
// ====================================================================

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    cover_image_url: string;
    published_at: string; // Veya Date türü, Supabase'in döndürdüğüne bağlı
}

// Liste görünümü için daha sade bir tip de kullanabiliriz:
export interface BlogPostSummary {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover_image_url: string;
    published_at: string;
}


export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Ürün Listesi/Kategori Sayfası için gerekli minimum veri tipi
export interface ProductForCategory {
  id: string;
  name: string;
  slug: string;
  price: number;
  // main_image_url veritabanında null olabilir
  main_image_url: string | null; 
}

// ÖNE ÇIKAN ÜRÜNLER İÇİN GENİŞLETİLMİŞ TİP
export interface ProductWithCategory extends ProductForCategory {
  category_name: string;
  category_slug: string;
}

// ====================================================================
// VERİ ÇEKME FONKSİYONLARI
// ====================================================================

/**
 * Tüm Kategorileri çeker.
 * @returns Category[] | null
 */
export async function fetchCategories(): Promise<Category[] | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true }); //isim sırasına göre sırala

  if (error) {
    console.error("Kategori çekme hatası:", error);
    return null;
  }
  return data as Category[];
}

/**
 * Belirli bir kategoriye göre ürünleri çeker.
 * @param categorySlug Kategori slug'ı
 * @returns ProductForCategory[] | null
 */
export async function fetchProductsByCategorySlug(
  categorySlug: string,
): Promise<ProductForCategory[] | null> {
  // 1. Önce slug ile kategori ID'sini bulmalıyız
  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (categoryError || !categoryData) {
    return null;
  }

  const categoryId = categoryData.id;

  // 2. Kategori ID'si ile ürünleri çek
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    // ProductCard için gerekli kolonları çekiyoruz
    .select("id, name, slug, price, main_image_url")
    .eq("category_id", categoryId)
    .order("name", { ascending: true });

  if (productsError) {
    console.error("Ürün çekme hatası:", productsError);
    return null;
  }

  return productsData as ProductForCategory[];
}


/**
 * Aynı kategorideki diğer ürünleri çeker (Mevcut ürünü hariç tutar).
 */
export async function fetchRelatedProducts(categoryId: string, currentProductId: string): Promise<ProductForCategory[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, main_image_url")
    .eq("category_id", categoryId)
    .neq("id", currentProductId) // Mevcut ürünü listeden çıkar
    .limit(4);

  if (error) {
    console.error("Benzer ürünler çekme hatası:", error);
    return [];
  }

  return data as ProductForCategory[];
}

/**
 * is_featured = TRUE olan öne çıkan ürünleri ve ilgili kategori bilgilerini çeker.
 * @returns ProductWithCategory[]
 */
export async function getFeaturedProducts(): Promise<ProductWithCategory[]> {

  try {
    // is_featured = TRUE olan ürünleri çek, kategoriler tablosuyla JOIN yap
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        main_image_url,
        category_id,
        categories (
          name,
          slug
        )
      `)
      .eq('is_featured', true)
      .limit(8); 

      // HATA GİDERİLDİ: categories alanı, Supabase JOIN sonucu olduğu için DİZİ olarak tanımlandı.
      interface RawProduct {
        id: string;
        name: string;
        slug: string;
        price: number;
        main_image_url: string | null; // Nullable olabilir
        category_id: string;
        categories: {
            name: string;
            slug: string;
        }[]; // DİZİ OLARAK TANIMLANDI
    }


    if (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }

    // Gelen veriyi kartlar için düz bir yapıya dönüştürürken RawProduct tipini kullanıyoruz
    return (data as RawProduct[]).map((product) => ({ // data'yı RawProduct[] olarak cast ettik
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      main_image_url: product.main_image_url,
      category_id: product.category_id,
      // HATA GİDERİLDİ: Dizinin ilk elemanını alıyoruz ve yoksa varsayılan değer atıyoruz.
      category_name: product.categories[0]?.name || 'Bilinmiyor', 
      category_slug: product.categories[0]?.slug || 'bilinmiyor',  
    })) as ProductWithCategory[];
    
  } catch (err) {
    console.error("Unexpected error in getFeaturedProducts:", err);
    return [];
  }
}

/**
* Ürünler üzerinde tam metin araması yapar (Full-Text Search).
 * @param query Aranacak kelime veya kelimeler.
 * @returns ProductForCategory[] | null
 */
export async function searchProducts(query: string): Promise<ProductForCategory[] | null> {
    if (!query) {
        return [];
    }


    
    const { data, error } = await supabase
        .from('products')
        // Hem isme hem de açıklamaya bakıyoruz.
        // 'ilike' operatörü % işareti ile birlikte kullanılır.
        .select('id, name, slug, price, main_image_url')
        .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
        .order('name', { ascending: true })
        .limit(50); // Maksimum 50 sonuç

    if (error) {
        console.error("Arama hatası:", error);
        return null;
    }

    return data as ProductForCategory[];
}

/**
 * Tüm yayınlanmış blog yazılarını özet halinde çeker.
 */
export async function fetchBlogPostsSummary(): Promise<BlogPostSummary[] | null> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, description, cover_image_url, published_at')
        .order('published_at', { ascending: false }); // En yeni yazıyı en üste koy

    if (error) {
        console.error("Blog yazılarını çekme hatası:", error);
        return null;
    }

    return data as BlogPostSummary[];
}

/**
 * Belirli bir slug'a ait tek bir blog yazısını (detay içeriği dahil) çeker.
 * @param slug Blog yazısının slug'ı
 */
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*') // Tüm sütunları çekiyoruz (content dahil)
        .eq('slug', slug)
        .single(); // Tek bir kayıt bekliyoruz

    if (error) {
        // Eğer kayıt bulunamazsa (single() hatası), Supabase hata verir.
        // Hata türüne bakarak null döndürmek en iyisi.
        if (error.code === 'PGRST116') { // Single row expected but zero rows returned (Supabase standardı)
            return null;
        }
        console.error(`Blog yazısı çekme hatası (Slug: ${slug}):`, error);
        return null;
    }
    
    // Veri tekil bir obje olarak gelir
    return data as BlogPost;
}

/**
 * İletişim formundan gelen mesajı Supabase'deki 'contact_messages' tablosuna kaydeder.
 * @param name Kullanıcının adı.
 * @param email Kullanıcının e-posta adresi.
 * @param subject Mesajın konusu.
 * @param message Mesajın içeriği.
 * @returns { success: boolean, error?: string }
 */
export async function saveContactMessage(name: string, email: string, message: string): Promise<{ success: boolean, error?: string }> {
    
    // NOT: Tablonun adını 'contact_messages' olarak varsaydık. Lütfen doğru tablo adını kullanın.
    const { error } = await supabase
        .from('contact_messages') 
        .insert([
            {
                name: name,
                email: email,
                message: message,
            },
        ]);

    if (error) {
        console.error("Supabase mesaj kaydetme hatası:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

