// src/components/ContactInfo.tsx

import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ContactInfo() {
  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-gray-800">Doğrudan İletişim</h2>
      <p className="text-gray-600 text-lg">
        Tüm sorularınız, toplu sipariş talepleriniz ve bez çanta çözümleriniz için bize doğrudan ulaşabilirsiniz. {/* DÜZELTİLDİ */}
      </p>

      {/* İletişim Listesi */}
      <ul className="space-y-6">
        <li className="flex items-start space-x-4">
          <MapPin className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-800">Adresimiz</h4>
            <p className="text-gray-600">
              Fetihtepe Mah. Tepe üstü Sokak No:41A Beyoğlu - İstanbul, Türkiye - Merkez Ofis {/* DÜZELTİLDİ */}
            </p>
          </div>
        </li>
        <li className="flex items-start space-x-4">
          <Phone className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-800">Telefon</h4>
            <a href="tel:+902126592530" className="text-blue-600 hover:underline">
              +90 212 659 25 30
            </a>
          </div>
        </li>
        <li className="flex items-start space-x-4">
          <Mail className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-800">E-posta</h4>
            <a href="mailto:info@ucuzbezcanta.com" className="text-blue-600 hover:underline"> {/* DÜZELTİLDİ */}
              info@ucuzbezcanta.com
            </a>
          </div>
        </li>
        <li className="flex items-start space-x-4">
          <Clock className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-800">Çalışma Saatleri</h4>
            <p className="text-gray-600">Pazartesi - Cuma: 09:00 - 18:00</p>
          </div>
        </li>
      </ul>

      {/* Sosyal Medya */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">Bizi Takip Edin</h4>
        <div className="flex space-x-4">
          <Link href="https://www.facebook.com/ucuzbezcanta" aria-label="Facebook" className="text-gray-500 hover:text-indigo-600 transition-colors">
            <Facebook className="w-6 h-6" />
          </Link>
          <Link href="https://www.instagram.com/ucuzbezcanta" aria-label="Instagram" className="text-gray-500 hover:text-indigo-600 transition-colors">
            <Instagram className="w-6 h-6" />
          </Link>
          <Link href="https://tr.linkedin.com/in/ucuzbezcanta" aria-label="LinkedIn" className="text-gray-500 hover:text-indigo-600 transition-colors">
            <Linkedin className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}