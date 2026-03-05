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
    {name: 'Gelen Mesajlar', href: '/admin/messages', icon: '📊'},
    { name: 'Ürünler', href: '/admin/products', icon: '📦' },
    { name: 'Kategoriler', href: '/admin/categories', icon: '📁' },
    { name: 'Slider Ayarları', href: '/admin/slider', icon: '🖼️' },
    { name: 'Hakkımızda', href: '/admin/about', icon: 'ℹ️' },
    { name: 'İletişim', href: '/admin/contact', icon: '📞' },
  ];

    return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 md:fixed flex-col fixed h-full">
        <div className="p-16 border-b">
          <h2 className="text-xl font-bold text-indigo-600 tracking-tight">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as string} // Tip zorlaması yaparak 'Url' hatasını çözeriz
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all duration-200 font-medium"
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 underline">
            Siteye Dön
          </Link>
        </div>
      </aside>

      {/* İÇERİK */}
      <main className="flex-1 md:ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}