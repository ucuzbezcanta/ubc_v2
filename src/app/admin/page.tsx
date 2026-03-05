import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Veritabanından hızlı istatistikleri çekiyoruz
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: categoryCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
  const { count: messageCount } = await supabase.from('contact_messages').select('*', {count: 'exact', head: true});
  const { count: blogCount } = await supabase.from('blog_posts').select('*', {count: 'exact', head: true});

  //Son gelen 5 mesajı çekelim
  const { data: recentMessages, error:messageError } = await supabase
    .from('contact_messages')
    .select('name, email, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  
    if (messageError) {
      console.error("Mesajlar çekilirken hata oluştu:", messageError.message);
    }
  
  // En son eklenen 5 ürünü çekelim
  const { data: recentProducts } = await supabase
    .from('products')
    .select('name, price, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    { name: 'Toplam Ürün', value: productCount || 0, icon: '📦', color: 'bg-blue-500' },
    { name: 'Kategoriler', value: categoryCount || 0, icon: '📁', color: 'bg-purple-500' },
    { name: 'Blog Yazıları', value: blogCount || 0, icon: '📝', color: 'bg-green-500' },
    { name: 'Gelen Mesajlar', value: messageCount || 0, icon: '📩', color: 'bg-red-500' },
    { name: 'Aktif Kampanyalar', value: 0, icon: '🔥', color: 'bg-orange-500' }, // Statik veya slider tablosundan çekilebilir
    { name: 'Site Trafiği', value: '---', icon: '📈', color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-8 py-16 animate-in fade-in duration-700 text-black">
      {/* Üst Karşılama */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Merhaba, Admin 👋</h1>
        <p className="text-gray-500 mt-1">İşte bugün sitende olup bitenlerin özeti.</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-gray-200`}>
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{item.name}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Son Eklenen Ürünler Listesi */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-lg">Son Eklenen Ürünler</h2>
            <Link href="/admin/products" className="text-indigo-600 text-sm font-semibold hover:underline">Tümünü Gör</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentProducts?.map((product, i) => (
              <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-700">{product.name}</span>
                <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">{product.price} TL</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard'da Son Mesajları Gösteren Bölüm */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-lg">Son Gelen Mesajlar</h2>
            <Link href="/admin/messages" className="text-indigo-600 text-sm font-semibold hover:underline">Tümünü Gör</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentMessages?.map((msg, i) => (
              <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-100 transition-colors">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">{msg.name}</span>
                  <span className="text-xs text-gray-400">{msg.email}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(msg.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hızlı Erişim Menüsü */}
        <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Hızlı İşlemler</h2>
            <p className="text-indigo-100 text-sm mb-6">Sık yaptığın işlemlere buradan anında ulaşabilirsin.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/blog" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all border border-white/10 text-center font-semibold">
              📝 Blog Yazısı Yaz
            </Link>
            <Link href="/admin/products/new" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all border border-white/10 text-center font-semibold">
              ➕ Ürün Ekle
            </Link>

            <Link href="/admin/categories" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all border border-white/10 text-center font-semibold">
              📁 Kategori Ekle / Düzenle
            </Link>
            <Link href="/admin/slider" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all border border-white/10 text-center font-semibold">
              🖼️ Slider Değiştir
            </Link>
            <Link href="/" target="_blank" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all border border-white/10 text-center font-semibold">
              🌐 Siteyi Gör
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}