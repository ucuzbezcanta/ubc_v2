// src/components/Footer.tsx

import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-12 border-t-3 border-indigo-500">
      <div className="container mx-auto px-4 pt-12 pb-8">
        
        {/* ANA SÜTUNLAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-b border-gray-700 pb-10">
          
          {/* Sütun 1: Kurumsal & İletişim */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-indigo-200">UCUZBEZCANTA</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/hakkimizda" className="hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/kariyer" className="hover:text-white transition-colors">
                  Kariyer
                </Link>
              </li>
            </ul>
          </div>

          {/* Sütun 2: Müşteri Hizmetleri & Politikalar */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-indigo-200">Müşteri Hizmetleri</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/sss" className="hover:text-white transition-colors">
                  Sıkça Sorulan Sorular (SSS)
                </Link>
              </li>
              <li>
                <Link href="/teslimat-ve-iade" className="hover:text-white transition-colors">
                  Teslimat ve İade
                </Link>
              </li>
              <li>
                <Link href="/gizlilik-politikasi" className="hover:text-white transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" className="hover:text-white transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>

          {/* Sütun 3: Hızlı Kategoriler (Örnek) */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-indigo-200">Popüler Kategoriler</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/kategoriler/clutch-and-keseler" className="hover:text-white transition-colors">
                  Promosyon Clutch Çantalar
                </Link>
              </li>
              <li>
                <Link href="/kategoriler/plaj-cantalari" className="hover:text-white transition-colors">
                  Promosyon Plaj Çantaları
                </Link>
              </li>
              <li>
                <Link href="/kategoriler/ham-bez-cantalar" className="hover:text-white transition-colors">
                  Promosyon Ham Bez Çantalar
                </Link>
              </li>
              <li>
                <Link href="/kategoriler/gabardin-cantalar" className="hover:text-white transition-colors">
                  Promosyon Gabardin Çantalar
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Sütun 4: İletişim Bilgileri ve Sosyal Medya */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-indigo-200">Bize Ulaşın</h3>
            <address className="space-y-3 text-sm text-gray-400 not-italic">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1 text-indigo-200" />
                <span>
                  Fetihtepe Mah. Tepe üstü Sokak No:41A Beyoğlu - İstanbul, Türkiye - Merkez Ofis
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-indigo-200" />
                <a href="tel:+902126592530" className="hover:text-white transition-colors">
                  +90 212 659 25 30
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-indigo-200" />
                <a href="mailto:info@ucuzbezcanta.com" className="hover:text-white transition-colors">
                  info@ucuzbezcanta.com
                </a>
              </div>
            </address>

            {/* Sosyal Medya İkonları */}
            <div className="flex space-x-4 mt-6">
                <a href="https://www.facebook.com/ucuzbezcanta" aria-label="Facebook" className="text-gray-400 hover:text-indigo-200 transition-colors">
                    <Facebook className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/ucuzbezcanta" aria-label="Instagram" className="text-gray-400 hover:text-indigo-200 transition-colors">
                    <Instagram className="w-6 h-6" />
                </a>
                <a href="https://tr.linkedin.com/in/ucuzbezcanta" aria-label="LinkedIn" className="text-gray-400 hover:text-indigo-200 transition-colors">
                    <Linkedin className="w-6 h-6" />
                </a>
            </div>
          </div>
        </div>

        {/* TELİF HAKKI VE ALT BİLGİ */}
        <div className="mt-8 pt-4 text-center text-xs text-gray-500">
          <p>
            &copy; {currentYear} Promozone E-Ticaret A.Ş. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}