import { createClient } from '@/utils/supabase/server';
import CategoryManager from './CategoryManager';

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-black">Kategori Yönetimi</h1>
        <p className="text-gray-500 text-sm py-10">Ürün gruplarını buradan yönetin.</p>
      </div>
      <CategoryManager categories={categories || []} />
    </div>
  );
}