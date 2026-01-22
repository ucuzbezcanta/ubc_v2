"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const announcements = [
    "Yeni sezon ürünlerimizi kaçırmayın!",
    "Bize her zaman Whatsapp'tan ulaşabilirsiniz.",
    "Müşteri memnuniyeti bizim önceliğimizdir."
];

const TopHeader= () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
              setIsVisible(false);
            } else {
              setIsVisible(true);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
    <div
      className={`bg-[#1a1a1a] text-white overflow-hidden transition-all duration-500 ease-in-out ${
        isVisible 
          ? "max-h-20 opacity-100 py-2 border-b border-white/10" 
          : "max-h-0 opacity-0 py-0 border-none"
      }`}
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-3 items-center px-4 md:px-10 text-[11px] md:text-sm">
        {/* SOL: Sosyal Medya İkonları */}
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="https://instagram.com/kullaniciadin" target="_blank" className="hover:text-pink-500 transition-colors">
            <FaInstagram className="text-base" />
          </Link>
          <Link href="https://twitter.com/kullaniciadin" target="_blank" className="hover:text-blue-400 transition-colors">
            <FaTwitter className="text-base" />
          </Link>
          <Link href="https://facebook.com/kullaniciadin" target="_blank" className="hover:text-blue-600 transition-colors">
            <FaFacebook className="text-base" />
          </Link>
        </div>

        {/* ORTA: Kayan Yazılar */}
        <div className="flex justify-center text-center overflow-hidden">
          <p 
            key={currentIndex} 
            className="animate-top-text whitespace-nowrap font-light tracking-wide italic text-gray-300"
          >
            {announcements[currentIndex]}
          </p>
        </div>

        {/* SAĞ: WhatsApp */}
        <div className="flex justify-end">
          <Link 
            href="https://wa.me/905339780835" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-green-400 transition-colors group"
          >
            <FaWhatsapp className="text-lg text-green-500 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline font-medium">0533 978 08 35</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default TopHeader;