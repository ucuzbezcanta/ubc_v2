import { createClient } from '@/utils/supabase/server';
import ProductForm from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  return (
    <div className="p-4 md:p-28 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Yeni Ürün Ekle</h1>
        <ProductForm categories={categories || []} />
      </div>
    </div>
  );
}