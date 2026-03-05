import { createClient } from "@/utils/supabase/server";
import { updateBlogAction } from "@/actions/blog-actions";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Mevcut veriyi çekiyoruz
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', parseInt(id))
    .single();

  if (error || !post) {
    redirect("/admin/blog");
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    const result = await updateBlogAction(formData);
    if (result.success) {
      redirect("/admin/blog?status=updated");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-24 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Yazıyı Düzenle</h1>

        <form action={handleUpdate} className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
          <input type="hidden" name="id" value={post.id} />
          <input type="hidden" name="current_image_url" value={post.cover_image_url} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Başlık</label>
              <input name="title" defaultValue={post.title} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">URL Uzantısı (Slug)</label>
              <input name="slug" defaultValue={post.slug} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">SEO Açıklaması</label>
            <textarea name="description" defaultValue={post.description} rows={2} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="space-y-4 border-2 border-dashed border-gray-100 p-6 rounded-3xl">
            <label className="text-sm font-semibold text-gray-600 block">Kapak Görseli</label>
            
            {post.cover_image_url && (
              <div className="relative w-40 h-24 rounded-xl overflow-hidden border mb-4">
                <Image src={post.cover_image_url} alt="Mevcut Görsel" fill className="object-cover" unoptimized />
              </div>
            )}
            
            <input name="cover_image" type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:bg-indigo-600 file:text-white" />
            <p className="text-[10px] text-gray-400 italic">* Değiştirmek istemiyorsanız yeni dosya seçmeyin.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Yazı İçeriği</label>
            <textarea name="content" defaultValue={post.content} rows={12} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>

          <div className="flex gap-4">
            <button 
                type="submit" 
                className="flex-1 bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl active:scale-[0.98]"
            >
                Değişiklikleri Kaydet
            </button>
            <Link 
                href="/admin/blog" 
                className="px-8 bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center"
            >
                İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}