// src/components/Slider.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Swiper kütüphanesi importları
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface Slide {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  order_num: number | null;
  button_text: string | null;
}

export default function Slider({ slides }: { slides: Slide[] }) {
  if (!slides || slides.length === 0) {
    return (
      <div className="relative w-full h-[300px] md:h-[400px] bg-gray-200 flex items-center justify-center">
        <h2 className="text-xl text-gray-600">
          Gösterilecek slayt bulunamadı.
        </h2>
      </div>
    );
  }

  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop={true}
      pagination={{ clickable: true }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="w-full h-[400px] md:h-[600px] cursor-grab bg-gray-50" // Arka plan rengi eklendi (object-contain boşlukları için)
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={slide.image_url}
              alt={slide.title}
              fill={true}
              priority={true}
              unoptimized={true}
              // MOBİL ÇÖZÜMÜ: object-cover yerine object-contain yaparak görselin kırpılmasını önledik
              className="object-contain md:object-cover" 
              sizes="(max-width: 768px) 100vw, 100vw"
            />

            {/* Slayt Üzerindeki İçerik (Eğer görselin üzerinde yazılarınız varsa) */}
            <div className="absolute inset-0 flex items-center justify-start p-6 md:p-16 pointer-events-none">
              <motion.div
                className="max-w-xl text-cyan-950 pointer-events-auto"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="text-2xl md:text-6xl font-extrabold mb-2 md:mb-4 leading-tight drop-shadow-sm">
                  {slide.title}
                </h1>
                {slide.description && (
                  <p className="text-sm md:text-xl mb-4 md:mb-6 drop-shadow-sm">{slide.description}</p>
                )}
                {slide.link_url && (
                  <Link href={slide.link_url}>
                    <motion.button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 md:py-3 md:px-8 rounded-full shadow-lg transition duration-300 text-sm md:text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {slide.button_text || "Şimdi Keşfet"}
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}