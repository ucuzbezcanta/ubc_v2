import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: product } = await supabase.from('products').select('*').eq('id', id).single();
  const { data: categories } = await supabase.from('categories').select('id, name').order('name');

  if (!product) notFound();

  const getCleanGallery = (data: string[] | string | null): string[] => {
    if (!data) return [];
    let rawArray: string[] = [];
    if (Array.isArray(data)) rawArray = data;
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

  return (
    <div className="p-4 md:p-12 lg:p-24 bg-gray-50 min-h-screen text-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Ürünü Düzenle</h1>
          <span className="text-xs bg-gray-200 px-3 py-1 rounded-full text-gray-500 font-mono">
            ID: {id}
          </span>
        </div>
        <ProductForm
          categories={categories || []}
          initialProduct={product}
          initialGallery={getCleanGallery(product.gallery_image_urls)}
        />
      </div>
    </div>
  );
}