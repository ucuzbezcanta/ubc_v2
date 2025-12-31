import { createClient } from "@/utils/supabase/server";
import { createProduct } from "@/actions/product-actions";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const supabase = await createClient();

  // 1. Kategorileri veritabanından çek (Select input için)
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  // Form gönderildikten sonra çalışacak istemci tarafı mantığı yerine 
  // basitlik için doğrudan Server Action'ı form action'a bağlıyoruz.
  async function handleSubmit(formData: FormData) {
    'use server'
    const result = await createProduct(formData);
    if (result && result.success) {
      redirect('/admin/products?status=success');
    }
  }

return (
    <div className="p-4 md:p-28 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Yeni Ürün Ekle</h1>
        
        <form action={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ürün Adı */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Ürün Adı</label>
              <input
                name="name"
                type="text"
                placeholder="Örn: Büzgülü Pamuk Çanta"
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-black transition-all"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">URL Uzantısı (Slug)</label>
              <input
                name="slug"
                type="text"
                placeholder="buzgulu-pamuk-canta"
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-black transition-all"
              />
            </div>

            {/* Fiyat */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Fiyat (TL)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-black transition-all"
              />
            </div>

            {/* Stok */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Stok Adedi</label>
              <input
                name="stock"
                type="number"
                defaultValue="0"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-black transition-all"
              />
            </div>
          </div>

          {/* Kategori */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Kategori</label>
            <select
              name="category_id"
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-black transition-all bg-white"
            >
              <option value="">Kategori Seçin</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Açıklama */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Ürün Açıklaması</label>
            <textarea
              name="description"
              rows={4}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-black transition-all"
            ></textarea>
          </div>

          {/* Görsel Alanları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Ana Görsel</label>
              <input
                name="main_image"
                type="file"
                accept="image/*"
                required
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Galeri Görselleri</label>
              
              <input
                name="gallery_images"
                type="file"
                accept="image/*"
                multiple
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p className="text-xs">Birden fazla görsel için CTRL ye basılı tutabilirsiniz.</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg active:scale-[0.98]"
          >
            Ürünü Yayınla
          </button>
        </form>
      </div>
    </div>
  );
}