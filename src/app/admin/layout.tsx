import Link from "next/link";
import { ReactNode } from "react";


interface MenuItem {
    name: string;
    href: string;
    icon: string;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const menuItems: MenuItem[] = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Blog', href: '/admin/blog', icon: '📝' },
    {name: 'Gelen Mesajlar', href: '/admin/messages', icon: '📊'},
    { name: 'Ürünler', href: '/admin/products', icon: '📦' },
    { name: 'Kategoriler', href: '/admin/categories', icon: '📁' },
    { name: 'Slider Ayarları', href: '/admin/slider', icon: '🖼️' },
    { name: 'Hakkımızda', href: '/admin/about', icon: 'ℹ️' },
    { name: 'İletişim', href: '/admin/contact', icon: '📞' },
    { name: 'Atölye Takip', href: '/admin/takip', icon: '🧵' },
  ];

    return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-black pt-28 md:pt-0">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 md:fixed md:h-full">
        <div className="hidden md:block p-16 border-b">
          <h2 className="text-xl font-bold text-indigo-600 tracking-tight">Admin Panel</h2>
        </div>
        
        <nav className="flex md:block gap-2 p-2 md:p-4 md:space-y-2 overflow-x-auto md:overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as string} // Tip zorlaması yaparak 'Url' hatasını çözeriz
              className="shrink-0 whitespace-nowrap flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all duration-200 font-medium"
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block p-4 border-t">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 underline">
            Siteye Dön
          </Link>
        </div>
      </aside>

      {/* İÇERİK */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}