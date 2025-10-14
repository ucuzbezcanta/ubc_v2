import { fetchCategories } from "../../../lib/supabaseClient";
import Link from "next/link";

export default async function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //fetchcategories, supabase.ts dosyasından gelir
  const categories = await fetchCategories();

  //Kategoriler yoksa layoutu sadece içeriği göstererek render et
  if (!categories || categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sol Kolon: Kategori Listesi (Sticky Menü) */}
        <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit border-r pr-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Kategoriler</h2>
          <nav className="space-y-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/kategoriler/${category.slug}`}
                className="block text-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-50 p-2 rounded-md transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Sağ Kolon: Sayfa İçeriği (Ürünler) */}
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
