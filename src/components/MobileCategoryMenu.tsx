"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
// Senin dosyanın yolu (src/app/lib/supabaseClient ise ona göre düzenle)
import { Category } from "../../lib/supabaseClient";

export default function MobileCategoryMenu({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden mb-6">
      {/* Tetikleyici Buton */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between w-full bg-white border border-gray-200 px-5 py-4 rounded-xl shadow-sm active:scale-[0.98] transition-all"
      >
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Koleksiyonlar</span>
          <span className="text-sm font-semibold text-gray-800">Kategorileri Görüntüle</span>
        </div>
        <Menu size={24} className="text-indigo-600" />
      </button>

      {/* Arka Plan Karartma */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Çekmece (Drawer) */}
      <div className={`fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-white z-[101] shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Kategoriler</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-white rounded-full shadow-sm">
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 py-6">
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/kategoriler/${category.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-4 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-6 border-t bg-gray-50">
             <p className="text-xs text-gray-500 text-center font-medium">Toplu alımlar için bizimle iletişime geçin.</p>
          </div>
        </div>
      </div>
    </div>
  );
}