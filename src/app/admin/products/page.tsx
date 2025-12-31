import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import ProductDeleteButton from './ProductDeleteButton';

// Tip tanımlaması: 'any' hatasını çözer ve kodun neyle çalıştığını belirler
interface ProductWithCategory {
  id: string;
  name: string;
  price: number;
  stock: number;
  main_image_url: string | null;
  categories: {
    name: string;
  } | null;
}

export default async function AdminProductsPage() {
  const supabase = await createClient();

  // Veriyi çekiyoruz
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, 
      name, 
      price, 
      stock, 
      main_image_url,
      categories ( name )
    `);

  const products = (data as unknown as ProductWithCategory[]) || [];

  if (error) {
    console.error("Veri çekme hatası:", error);
  }

  return (
    <div className="p-4 md:p-28 bg-gray-50 min-h-screen">
      {/* BAŞLIK VE BUTON ALANI (MOBİL UYUMLU) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
          <p className="text-sm text-gray-500">Toplam {products.length} ürün listeleniyor</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-2 font-medium"
        >
          <span>+</span> Yeni Ürün Ekle
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* MASAÜSTÜ TABLO (MD VE ÜZERİ EKRANLAR) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Görsel</th>
                <th className="p-4 font-semibold">Ürün Adı</th>
                <th className="p-4 font-semibold">Kategori</th>
                <th className="p-4 font-semibold">Fiyat</th>
                <th className="p-4 font-semibold">Stok</th>
                <th className="p-4 font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors text-gray-700 text-sm">
                  <td className="p-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100">
                      <Image 
                        src={product.main_image_url || '/placeholder.jpg'} 
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-900">{product.name}</td>
                  <td className="p-4">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium">
                      {product.categories?.name || 'Kategorisiz'}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-900">{product.price} TL</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      (product.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stock || 0} Adet
                    </span>
                  </td>
                  <td className="p-4 text-right">
                  <div className="flex justify-end items-center gap-3">
                    <Link 
                      href={`/admin/products/edit/${product.id}`}
                      className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                    >
                      Düzenle
                    </Link>
                    
                    {/* Silme butonunu ayrı bileşen olarak çağırıyoruz */}
                    <ProductDeleteButton id={product.id} />
                  </div>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBİL LİSTE (MD ALTI EKRANLAR) */}
        <div className="md:hidden divide-y divide-gray-100">
          {products.map((product) => (
            <div key={product.id} className="p-4 flex items-center gap-4">
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border">
                <Image 
                  src={product.main_image_url || '/placeholder.jpg'} 
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                <p className="text-xs text-gray-500 uppercase font-semibold">{product.categories?.name}</p>
                <p className="text-sm font-bold text-indigo-600 mt-1">{product.price} TL</p>
              </div>
              <div className="flex flex-col gap-2">
              <Link 
                href={`/admin/products/edit/${product.id}`}
                className="p-1 text-center text-blue-600 text-xs font-bold border border-blue-100 rounded bg-blue-50"
              >
                Düzelt
              </Link>
              <ProductDeleteButton id={product.id} isMobile /> 
            </div>
            </div>
          ))}
        </div>

        {/* BOŞ DURUM */}
        {products.length === 0 && (
          <div className="p-20 text-center">
            <div className="text-gray-300 text-5xl mb-4 text-center flex justify-center">📦</div>
            <p className="text-gray-500 font-medium">Henüz ürün eklenmemiş.</p>
            <Link href="/admin/products/new" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">İlk ürünü hemen ekle</Link>
          </div>
        )}
      </div>
    </div>
  );
}