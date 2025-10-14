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

// Slider bileşeninin alacağı veri tipi (Artık props olarak gelecek)
interface Slide {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  order_num: number | null;
  button_text: string | null;
}

// Bileşen artık bir Client Component ve veri props olarak alıyor
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
      className="w-full h-[500px] md:h-[600px] cursor-grab"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative w-full h-full">
            <Image
              src={slide.image_url}
              alt={slide.title}
              fill={true}
              priority={true}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Slayt Üzerindeki İçerik */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-start p-8 md:p-16">
              <motion.div
                className="max-w-xl text-white"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-6">{slide.description}</p>
                {slide.link_url && (
                  <Link href={slide.link_url}>
                    <motion.button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
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
