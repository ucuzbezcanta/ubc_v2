'use server';

import { createClient} from '../utils/supabase/server';
import { uploadToR2 } from './r2-upload';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  let success = false;

  try {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string) || 0;
    const category_id = formData.get('category_id') as string;
    const description = formData.get('description') as string;
    
    //Dosyaları alalım
    const mainImageFile = formData.get('main_image') as File;
    const galleryFiles = formData.getAll('gallery_images') as File[];

    //Kategori isimlerini bul
    const { data: catData } = await supabase
      .from('categories')
      .select('slug')
      .eq('id', category_id)
      .single();

    const folderName = catData?.slug || 'general';

    // Ana görseli yükle
    let main_image_url = '';
    if (mainImageFile && mainImageFile.size > 0) {
      main_image_url = await uploadToR2(mainImageFile, `products/${folderName}`);
    }

    // Galeri görsellerini yükle (isteğe bağlı)
    const galleryUrls: string[] = [];
    for (const file of galleryFiles) {  
      if (file && file.size > 0) {
        const url = await uploadToR2(file, `products/${folderName}/gallery`);
        galleryUrls.push(url);
      }
    }

    
    //Supabase e kaydet
    const { error } = await supabase
      .from('products')
      .insert([
        {
          name,
          slug,
          price,
          stock,
          category_id,
          description,
          main_image_url,
          gallery_image_urls: galleryUrls,
          
        },
      ]);

    if (error) throw error;
    success = true;

    revalidatePath('/products');
  } catch (error) {
    console.error("KRİTİK HATA:", error);
    return { success: false, error: "Kayıt sırasında bir hata oluştu." };
  }

  if (success) {
    redirect('/admin/products?status=success');
  }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

      if (error) {
      console.error("SUPABASE SİLME HATASI:", error.message);
      throw error;
    }

      revalidatePath('/admin/products');
      return { success: true };
  } catch (error) {
    console.error("Silme hatası:", error);
    return {success: false};
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  try {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string) || 0;
    const category_id = formData.get('category_id') as string;
    const description = formData.get('description') as string;
    
    // 1. Ana Görsel Yönetimi
    let main_image_url = formData.get('current_main_image') as string;
    const newMainImage = formData.get('main_image') as File;
    
    if (newMainImage && newMainImage.size > 0) {
      const { data: cat } = await supabase.from('categories').select('slug').eq('id', category_id).single();
      main_image_url = await uploadToR2(newMainImage, `products/${cat?.slug || 'general'}`);
    }

    // MEVCUT GALERİYİ AL VE TEMİZLE
    const currentGalleryJson = formData.get('current_gallery_urls') as string;
    let gallery_image_urls: string[] = [];
    
    try {
      const parsed = JSON.parse(currentGalleryJson || "[]");
      // url: string diyerek 'any' hatasını, catch bloğunu boş bırakmayarak 'e' hatasını çözüyoruz
      if (Array.isArray(parsed)) {
        gallery_image_urls = parsed.filter((url: string) => 
          typeof url === 'string' && url.startsWith('http')
        );
      }
    } catch {
      // 'e' harfini sildik, böylece "tanımlı ama kullanılmıyor" hatası gitti
      gallery_image_urls = [];
    }

    const newGalleryFiles = formData.getAll('gallery_images') as File[];
    
    // YENİ DOSYALARI YÜKLE
    if (newGalleryFiles.length > 0 && newGalleryFiles[0].size > 0) {
      const { data: cat } = await supabase.from('categories').select('slug').eq('id', category_id).single();
      const newUrls = await Promise.all(
        newGalleryFiles.map(file => uploadToR2(file, `products/${cat?.slug || 'general'}/gallery`))
      );
      gallery_image_urls = [...gallery_image_urls, ...newUrls];
    }

    // VERİTABANINA GÖNDERİRKEN DİZİYİ KONTROL ET
    const { error } = await supabase
      .from('products')
      .update({
        name,
        slug,
        price,
        stock,
        category_id,
        description,
        main_image_url,
        gallery_image_urls: gallery_image_urls
      })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/products');
    revalidatePath(`/products/${slug}`);
    return { success: true };
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return { success: false };
  }
}