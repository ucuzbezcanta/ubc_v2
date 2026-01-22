"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation'; // Yönlendirme için eklendi
import {
  IoSearch,
  IoPersonOutline,
  IoMenu,
  IoClose,
  IoChevronDown,
} from "react-icons/io5";


import TopHeader from "./TopHeader";


// Tip Tanımlaması: SupabaseClient dosyanızdaki Category arayüzünü kullanın
interface Category {
  id: string; 
  name: string;
  slug: string;
}

interface MegaMenuData {
  title: string;
  slug: string;
  image: string; 
}

// Yeni prop'u tanımlıyoruz
interface HeaderProps {
  serverCategories: Category[];
}

// Mock data:
const megaMenuMockImages: MegaMenuData[] = [
  {
    title: "Promosyon Bez Çanta",
    slug: "promosyon-bez-canta",
    image: "/hambez.jpg",
  },
  {
    title: "Promosyon Plaj Çanta",
    slug: "promosyon-plaj-cantasi",
    image: "/plaj.jpg",
  },
];

export default function Header({ serverCategories }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  
  // ARAMA MANTIKLARI İÇİN YENİ STATE VE HOOK'LAR
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter(); // Next.js yönlendirme hook'u

  const isLoggedIn = false;

  // Arama formu submit edildiğinde çalışır
  const handleSearch = (e?: React.FormEvent) => {
      e?.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

      if (searchTerm.trim()) {
          // Kullanıcıyı arama sonuçları sayfasına yönlendir: /arama?q=termos
          router.push(`/arama?q=${encodeURIComponent(searchTerm.trim())}`);
          
          // Mobil veya büyük ekrandaki arama alanını kapat
          setIsSearchOpen(false);
          setIsMobileMenuOpen(false); // Eğer mobil menü açıksa kapat
          setSearchTerm(''); // Arama terimini temizle
      }
  };


  // Kategori verilerini düzenleme: Mega menü için 2 sütuna bölelim
  const categoryCount = serverCategories.length;
  const splitPoint = Math.ceil(categoryCount / 2);

  const column1Categories = serverCategories.slice(0, splitPoint);
  const column2Categories = serverCategories.slice(splitPoint);

  return (
    <>
   
      <motion.header
        className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <TopHeader />
        <div className="container mx-auto p-4 flex items-center justify-between">
          {/* Sol Alan: Logo ve Menüler (Değişmedi) */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="Mağaza Logosu"
                width={120}
                height={40}
                className="object-contain"
              />
            </Link>

            {/* Menü Navigasyonu (Büyük Ekranlar İçin) */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Ana Sayfa
              </Link>

              {/* Kategoriler Mega Menü Kapsayıcısı - KOD AYNI KALDI */}
              {/* ... Mega Menü Kodları ... */}
              <div
                className="relative"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                  Kategoriler{" "}
                  <IoChevronDown className="ml-1 transition-transform" />
                </button>

                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      className="absolute left-0 top-full mt-2 w-[800px] bg-white shadow-lg rounded-md overflow-hidden p-6"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex justify-between space-x-8">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">
                            Çanta Kategorileri
                          </h4>
                          <div className="flex flex-col space-y-2">
                            {column1Categories.map((item) => (
                              <Link
                                key={item.slug}
                                href={`/kategoriler/${item.slug}`}
                                className="block text-gray-700 hover:text-blue-600 transition-colors"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">
                            Diğer Kategoriler
                          </h4>
                          <div className="flex flex-col space-y-2">
                            {column2Categories.map((item) => (
                              <Link
                                key={item.slug}
                                href={`/kategoriler/${item.slug}`}
                                className="block text-gray-700 hover:text-blue-600 transition-colors"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="flex-1 space-y-4">
                          {megaMenuMockImages.map((item) => (
                            <div
                              key={item.slug}
                              className="relative rounded-lg overflow-hidden shadow-sm group"
                            >
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={300}
                                height={150}
                                className="w-full object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <span className="text-white text-lg font-semibold">
                                  {item.title}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/hakkimizda"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Hakkımızda
              </Link>
              <Link
                href="/blog"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/sss"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                S.S.S.
              </Link>
              <Link
                href="/iletisim"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                İletişim
              </Link>
            </nav>
          </div>

          {/* SAĞ ALAN: İkonlar */}
          <div className="flex items-center space-x-4">
            {/* Hamburger menü ikonu (Sadece mobil için görünür) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)} // Tıklandığında mobil menüyü aç
              className="p-2 text-gray-600 hover:text-gray-800 md:hidden"
            >
              <IoMenu size={22} />
            </button>

            {/* Arama İkonu ve Input Kapsayıcısı (DESKTOP) */}
            <div className="relative">
              <button
                onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    setSearchTerm(''); // Input açıldığında içeriği temizle
                }}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <IoSearch size={22} />
              </button>
              <AnimatePresence>
                {isSearchOpen && (
                    // FORM İLE ÇEVRİLİ INPUT
                    <motion.form
                      onSubmit={handleSearch} // Form submit edildiğinde arama yap
                      className="absolute right-0 mt-2 w-64 md:w-80 bg-white shadow-lg rounded-md overflow-hidden flex" // bg-gray-100 yerine bg-white daha iyi durur
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ originX: "right" }}
                    >
                        <input
                            type="search" // "search" tipi klavyede uygun butonu çıkarır
                            placeholder="Ürün Ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            // Arama kutusu açıldığında Enter'a basınca otomatik arama yapar
                            className="w-full p-2 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        />
                        <button
                            type="submit"
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                        >
                            <IoSearch size={20} />
                        </button>
                    </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Kullanıcı İkonu ve Dropdown - KOD AYNI KALDI */}
            {/* ... Kullanıcı Dropdown Kodları ... */}
            <div className="relative">
              {" "}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <IoPersonOutline size={22} />
              </button>
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isLoggedIn ? (
                      <>
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Hesabım
                        </Link>
                        <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Çıkış Yap
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Giriş Yap
                        </Link>
                        <Link
                          href="/register"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Kayıt Ol
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* MOBİL MENÜ BİLEŞENİ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-6 flex flex-col space-y-4"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <IoClose size={24} />
                </button>
              </div>
              
              {/* MOBİL ARAMA FORMU - YENİ EKLENDİ */}
              <form onSubmit={handleSearch} className="flex border-b pb-4">
                  <input
                      type="search"
                      placeholder="Ürün Ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                      type="submit"
                      className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
                  >
                      <IoSearch size={20} />
                  </button>
              </form>

              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-lg font-semibold text-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ana Sayfa
                </Link>

                {/* Kategoriler Dropdown - KOD AYNI KALDI */}
                {/* ... Mobil Kategoriler Kodları ... */}
                <div>
                  <button
                    onClick={() =>
                      setIsMobileCategoriesOpen(!isMobileCategoriesOpen)
                    }
                    className="flex items-center text-lg font-semibold text-gray-800 w-full justify-between"
                  >
                    Kategoriler{" "}
                    <IoChevronDown
                      className={`ml-2 transition-transform ${isMobileCategoriesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isMobileCategoriesOpen && (
                      <motion.div
                        className="mt-2 pl-4 flex flex-col space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {serverCategories.map((category) => (
                          <Link
                            key={category.slug}
                            href={`/kategoriler/${category.slug}`}
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {category.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="/hakkimizda"
                  className="text-lg font-semibold text-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Hakkımızda
                </Link>
                <Link
                  href="/blog"
                  className="text-lg font-semibold text-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/sss"
                  className="text-lg font-semibold text-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  S.S.S.
                </Link>
                <Link
                  href="/iletisim"
                  className="text-lg font-semibold text-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  İletişim
                </Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}