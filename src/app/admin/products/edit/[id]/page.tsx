import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { updateProduct } from '@/actions/product-actions';
import Image from 'next/image';
import GalleryEditor from './GalleryEditor';

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
  gallery_image_urls: string[] | string | null;
}

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: productRaw } = await supabase.from('products').select('*').eq('id', id).single();
  const { data: categories } = await supabase.from('categories').select('id, name');

  if (!productRaw) notFound();
  const product = productRaw as ProductData;

  const getCleanGallery = (data: string[] | string | null): string[] => {
    if (!data) return [];
    let rawArray: string[] = [];
    if (Array.isArray(data)) { rawArray = data; } 
    else if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        rawArray = Array.isArray(parsed) ? parsed : [data];
      } catch {
        rawArray = data.replace(/{|}/g, '').split(',');
      }
    }
    return rawArray
      .map((url: string) => url.trim().replace(/^"|"$/g, ''))
      .filter((url: string) => url.startsWith('http'));
  };

  const galleryImages = getCleanGallery(product.gallery_image_urls);

  // SERVER ACTION: Form dışına aldık
  async function actionHandler(formData: FormData) {
    'use server';
    const result = await updateProduct(id, formData);
    if (result.success) {
      redirect('/admin/products?status=updated');
    }
  }

  return (
    <div className="p-4 md:p-12 lg:p-24 bg-gray-50 min-h-screen text-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Ürünü Düzenle</h1>
            <span className="text-xs bg-gray-200 px-3 py-1 rounded-full text-gray-500 font-mono">ID: {id}</span>
        </div>
        
        {/* Form Action artık bağımsız bir fonksiyon */}
        <form action={actionHandler} className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border space-y-8">
          
          <input type="hidden" name="current_main_image" defaultValue={product.main_image_url || ''} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Ürün Adı</label>
              <input name="name" defaultValue={product.name} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">URL (Slug)</label>
              <input name="slug" defaultValue={product.slug} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Fiyat (TL)</label>
              <input name="price" type="number" step="0.01" defaultValue={product.price} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Stok</label>
              <input name="stock" type="number" defaultValue={product.stock || 0} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Kategori</label>
            <select name="category_id" defaultValue={product.category_id} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white" required>
              {categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Açıklama</label>
            <textarea name="description" defaultValue={product.description || ''} rows={4} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Ekstra Detaylar & SEO Yazısı</label>
            <textarea
              name="details_content"
              defaultValue={product?.details_content || ''} // Edit sayfası için
              rows={6}
              placeholder="Yıkama talimatı, kullanım alanları gibi özgün bilgileri buraya girin..."
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-black transition-all"
            ></textarea>
            <p className="text-xs text-gray-400 italic">Googleda öne çıkmak için buraya en az 200 kelime özgün içerik girmenizi öneririm.</p>
          </div>

          {/* SEO Açıklaması */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-indigo-600 flex items-center gap-2">
                SEO Açıklaması (Meta Description)
                <span className="text-[10px] bg-indigo-100 px-2 py-0.5 rounded">ÖNERİLEN: 150-160 KARAKTER</span>
              </label>
              <textarea 
                name="meta_description" 
                defaultValue={product.meta_description || ''} 
                rows={2} 
                placeholder="Google için kısa özet..."
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50/20" 
              />
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t pt-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">Ana Görsel</label>
              <div className="relative w-full h-56 bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 shadow-inner">
                <Image 
                  src={product.main_image_url || '/placeholder.jpg'} 
                  alt="Mevcut" 
                  fill 
                  className="object-contain p-2" 
                  unoptimized 
                />
              </div>
              <label className="flex items-center justify-center w-full h-12 bg-white text-indigo-600 border border-indigo-600 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors font-medium text-sm text-center">
                <span>📷 Ana Görseli Değiştir</span>
                <input name="main_image" type="file" accept="image/*" className="hidden" />
              </label>
            </div>

            <GalleryEditor initialImages={galleryImages} />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95 text-lg"
          >
            Tüm Değişiklikleri Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}