import { fetchCategories, Category } from "../../../lib/supabaseClient";
import Link from "next/link";
import MobileCategoryMenu from "../../components/MobileCategoryMenu";

export default async function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categoriesData = await fetchCategories();
  
  // TypeScript için tip güvenli kontrol
  const categories: Category[] = categoriesData || [];

  if (categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      {/* Sadece Mobilde: Gelişmiş Drawer Menü */}
      <MobileCategoryMenu categories={categories} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sadece Masaüstünde: Sabit Yan Menü */}
        <aside className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24 h-[calc(100vh-140px)] border-r pr-6">
          <div className="bg-gray-50 rounded-2xl p-6 h-full overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-extrabold mb-6 text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
              Kategoriler
            </h2>
            <nav className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/kategoriler/${category.slug}`}
                  className="block text-[15px] font-semibold text-gray-600 hover:text-indigo-600 hover:bg-white p-3 rounded-xl transition-all hover:shadow-sm border border-transparent hover:border-gray-100"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="lg:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}
