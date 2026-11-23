'use client';

import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';
import { createProduct, updateProduct } from '@/actions/product-actions';

interface Category {
  id: string;
  name: string;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  meta_description: string | null;
  details_content: string | null;
  price: number;
  stock: number | null;
  category_id: string;
  main_image_url: string | null;
}

interface ProductFormProps {
  categories: Category[];
  initialProduct?: ProductData;
  initialGallery?: string[];
}

export default function ProductForm({
  categories,
  initialProduct,
  initialGallery = [],
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>(initialGallery);

  const isEdit = Boolean(initialProduct);

  const removeGalleryImage = (urlToRemove: string) => {
    setGalleryImages((prev) => prev.filter((url) => url !== urlToRemove));
  };

  // Görseli tarayıcıda sıkıştıran yardımcı fonksiyon
  const compressImage = async (file: File): Promise<File> => {
    // Dosya zaten 800 KB'dan küçükse sıkıştırmaya gerek yok
    if (file.size <= 800 * 1024) return file;

    const options = {
      maxSizeMB: 0.8, // Maksimum 800 KB
      maxWidthOrHeight: 1600, // Maksimum 1600px genişlik/yükseklik
      useWebWorker: true,
      fileType: 'image/webp', // Otomatik WebP dönüşümü
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
      return new File([compressedBlob], newFileName, { type: 'image/webp' });
    } catch (error) {
      console.error('Görsel sıkıştırma hatası, orijinal dosya kullanılıyor:', error);
      return file;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusText('Görseller optimize ediliyor...');

    try {
      const form = e.currentTarget;
      const rawFormData = new FormData(form);
      const cleanFormData = new FormData();

      // Metin alanlarını aktar
      const textFields = [
        'name',
        'slug',
        'price',
        'stock',
        'category_id',
        'description',
        'meta_description',
        'details_content',
        'current_main_image',
      ];
      textFields.forEach((field) => {
        const val = rawFormData.get(field);
        if (val !== null) cleanFormData.append(field, val);
      });

      if (isEdit) {
        cleanFormData.append('current_gallery_urls', JSON.stringify(galleryImages));
      }

      // 1. Ana görseli sıkıştır ve ekle
      const mainFile = rawFormData.get('main_image') as File;
      if (mainFile && mainFile.size > 0) {
        const compressedMain = await compressImage(mainFile);
        cleanFormData.append('main_image', compressedMain);
      }

      // 2. Galeri görsellerini sıkıştır ve ekle
      const galleryFiles = rawFormData.getAll('gallery_images') as File[];
      for (const file of galleryFiles) {
        if (file && file.size > 0) {
          const compressedGallery = await compressImage(file);
          cleanFormData.append('gallery_images', compressedGallery);
        }
      }

      setStatusText('Sunucuya yükleniyor...');

      // Mevcut Server Action'ları çağır
      if (isEdit && initialProduct) {
        const res = await updateProduct(initialProduct.id, cleanFormData);
        if (res?.success) {
          window.location.href = '/admin/products?status=updated';
        } else {
          alert('Güncelleme sırasında hata oluştu.');
        }
      } else {
        const res = await createProduct(cleanFormData);
        // createProduct başarılı olduğunda kendi içinde redirect yapıyor
        if (res && !res.success) {
          alert(res.error || 'Kayıt sırasında hata oluştu.');
        }
      }
    } catch (err) {
      console.error(err);
      alert('İşlem sırasında beklenmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
      setStatusText('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6 text-black"
    >
      {isEdit && (
        <input
          type="hidden"
          name="current_main_image"
          defaultValue={initialProduct?.main_image_url || ''}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Ürün Adı</label>
          <input
            name="name"
            type="text"
            defaultValue={initialProduct?.name || ''}
            placeholder="Örn: Büzgülü Pamuk Çanta"
            required
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">URL Uzantısı (Slug)</label>
          <input
            name="slug"
            type="text"
            defaultValue={initialProduct?.slug || ''}
            placeholder="buzgulu-pamuk-canta"
            required
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Fiyat (TL)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={initialProduct?.price ?? ''}
            placeholder="0.00"
            required
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Stok Adedi</label>
          <input
            name="stock"
            type="number"
            defaultValue={initialProduct?.stock ?? 0}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Kategori</label>
        <select
          name="category_id"
          defaultValue={initialProduct?.category_id || ''}
          required
          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
        >
          <option value="">Kategori Seçin</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Ürün Açıklaması</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialProduct?.description || ''}
          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Ekstra Detaylar & SEO Yazısı</label>
        <textarea
          name="details_content"
          rows={6}
          defaultValue={initialProduct?.details_content || ''}
          placeholder="Yıkama talimatı, kullanım alanları gibi özgün bilgileri buraya girin..."
          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-indigo-600 flex items-center gap-2">
          SEO Açıklaması (Google Özet)
          <span className="text-[10px] bg-indigo-100 px-2 py-0.5 rounded text-indigo-700">
            ÖNERİLEN: 150-160 KARAKTER
          </span>
        </label>
        <textarea
          name="meta_description"
          rows={2}
          defaultValue={initialProduct?.meta_description || ''}
          placeholder="Google arama sonuçlarında görünecek ilgi çekici özeti buraya yazın..."
          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-indigo-50/30"
        />
      </div>

      {/* Görsel Alanları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
        {/* Ana Görsel */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 block">Ana Görsel</label>
          {isEdit && initialProduct?.main_image_url && (
            <div className="relative w-full h-48 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
              <Image
                src={initialProduct.main_image_url}
                alt="Mevcut Ana Görsel"
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
          )}
          <input
            name="main_image"
            type="file"
            accept="image/*"
            required={!isEdit}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* Galeri Görselleri */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 block">Galeri Görselleri</label>
          {isEdit && (
            <div className="grid grid-cols-3 gap-2 mb-2">
              {galleryImages.map((url, i) => (
                <div
                  key={`${url}-${i}`}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200"
                >
                  <Image src={url} alt={`Galeri ${i}`} fill className="object-cover" unoptimized />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(url)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow z-10"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            name="gallery_images"
            type="file"
            accept="image/*"
            multiple
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p className="text-xs text-gray-400">
            Görseller yüklenmeden önce otomatik olarak WebP formatına sıkıştırılır.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50"
      >
        {loading ? statusText : isEdit ? 'Tüm Değişiklikleri Kaydet' : 'Ürünü Yayınla'}
      </button>
    </form>
  );
}