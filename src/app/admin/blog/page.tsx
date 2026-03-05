import { createBlogAction, deleteBlogAction } from "@/actions/blog-actions";
import {fetchBlogPostsSummary } from "../../../../lib/supabaseClient";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteBlogButton from "@/components/admin/DeleteBlogButton";


export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const posts = (await fetchBlogPostsSummary()) || [];
  const status = (await searchParams).status;

  // Silme işlemi için iç fonksiyon
  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const result = await deleteBlogAction(id);
    if (result.success) {
      redirect("/admin/blog?status=deleted");
    }
  }



  // Ekleme fonksiyonu
  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await createBlogAction(formData);
    if (result.success) {
      redirect("/admin/blog?status=success");
    }
  }

  return (
  <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-24 text-black font-sans">
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight gray-900 text-black">Ucuz Bez Çanta | Blog Paneli</h1>
          {status === "success" && <span className="text-green-600 font-bold">✅ Yayınlandı!</span>}
          {status === "deleted" && <span className="text-red-600 font-bold">🗑️ Yazı Silindi!</span>}
        </div>

        {/* Yeni Yazı Formu */}
        <form
          action={handleSubmit}
          className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 mb-12 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Başlık</label>
              <input
                name="title"
                placeholder="Örn: 2026 Bez Çanta Trendleri"
                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">URL Uzantısı (Slug)</label>
              <input
                name="slug"
                placeholder="Örn: Toptan Bez Çanta Alırken Dikkat Edilmesi Gerekenler"
                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">Kısa SEO Açıklaması</label>
            <textarea
              name="description"
              placeholder="Arama sonuçlarında görünecek özet..."
              rows={2}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-2 border-2 border-dashed border-gray-100 p-6 rounded-3xl">
            <label className="text-sm font-semibold text-gray-600 block mb-2">Kapak Görseli</label>
            <input
              name="cover_image"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all"
            />
            <p className="text-[10px] text-gray-400 mt-2 italic">* Görsel otomatik olarak R2 bulut sistemine yüklenir.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">Yazı İçeriği</label>
            <textarea
              name="content"
              placeholder="Yazınızı buraya yazın (HTML destekler)..."
              rows={12}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl active:scale-[0.98]"
          >
            Blog Yazısını Paylaş
          </button>
        </form>

        {/* Mevcut Yazılar Tablosu */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm mt-12">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-bold text-lg text-black">Yayındaki Yazılar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="p-6">Başlık</th>
                  <th className="p-6">Tarih</th>
                  <th className="p-6 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-black">
                {posts.map((post) => (
                  <tr key={post.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="p-6 font-medium text-gray-700">{post.title}</td>
                    <td className="p-6 text-sm text-gray-400">
                      {new Date(post.published_at).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="p-6 text-right flex justify-end gap-3">
                    {/* Düzenle Butonu */}
                    <Link 
                      href={`/admin/blog/edit/${post.id}`} 
                      className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      Düzenle
                    </Link>

                    {/* Yeni Silme Bileşeni */}
                    <DeleteBlogButton id={post.id.toString()} onDelete={handleDelete} />
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}