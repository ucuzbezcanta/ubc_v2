import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Sayfa bulunamadı - 404 | Ucuz Bez Çanta',
    description: 'Aradığınız sayfa bulunamadı. Lütfen ana sayfaya geri dönün.',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800 p-6 text-center">
      
      {/* Animasyonlu Logo */}
      <div className="relative mb-8">
        <Image
          src="/logo.svg" // KENDİ LOGO YOLUNUZU BURAYA YAZIN
          alt="Ucuz Bez Çanta Logo"
          width={150} // Logo genişliği
          height={150} // Logo yüksekliği
          className="animate-spin-slow-and-fade" // Özel Tailwind animasyon sınıfı
        />
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Animasyonlu Logo için özel stil gereksizse kaldırılabilir. */}
        </div>
      </div>

      <h1 className="text-6xl md:text-8xl font-extrabold text-indigo-700 mb-4 animate-bounce-slow">
        404
      </h1>
      <p className="text-xl md:text-2xl font-semibold mb-6 animate-fade-in delay-200">
        Sayfa Bulunamadı
      </p>
      <p className="text-lg text-gray-600 mb-8 max-w-md animate-fade-in delay-400">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir. Lütfen ana sayfaya geri dönün.
      </p>
      <Link href="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-105 animate-fade-in delay-600">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}