"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const categories = [
    {
        id: 1,
        title: "HamBez Çantalar",
        image: "/images/hambezkategori-2.jpg",
        info: "Ham Bez Çantalar",
        link: "/kategoriler/ham-bez-cantalar",
    },
    {
        id: 2,
        title: "Gabardin Çantalar",
        image: "/images/gabardin_kategori.jpg",
        info: "Gabardin Bez Çantalar",
        link: "/kategoriler/gabardin-cantalar",
    },
    {
        id: 3,
        title: "Clutch Çantalar",
        image: "/images/clutch-kategori.jpg",
        info: "Clutch Bez Çantalar",
        link: "/kategoriler/clutch-and-keseler",
    },
    {
        id: 4,
        title: "Kanvas Çantalar",
        image: "/images/kanvas-kategori.jpg",
        info: "Kanvas Bez Çantalar",
        link: "/kategoriler/kanvas-cantalar",
    },
    {
        id: 5,
        title: "Lamineli Çantalar",
        image: "/images/lamineli-kategori.jpg",
        info: "Lamineli Bez Çantalar",
        link: "/kategoriler/lamineli-dijital-baskili-cantalar",
    },
];
        

const CategorySlider = () => {
  // loop: true seçeneği sonsuz döngüyü sağlar
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    slidesToScroll: 1 
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="w-full py-16 bg-white">
      {/* Üst Başlık Kısmı */}
      <div className="px-4 md:px-10 mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-gray-900">
            Popüler Kategoriler
          </h2>
          <div className="h-1 w-20 bg-black mt-4"></div>
        </div>
        
        {/* Kontrol Okları */}
        <div className="flex gap-2">
          <button 
            onClick={scrollPrev}
            className="p-3 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all"
          >
            <FiChevronLeft size={20} />
          </button>
          <button 
            onClick={scrollNext}
            className="p-3 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Slider Alanı */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] min-w-0 relative h-[600px] border-r border-gray-100 group"
            >
              <div className="relative w-full h-full overflow-hidden bg-gray-50">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Sağ Üst Dikey Bilgi Yazısı */}
                <div className="absolute top-0 right-0 h-full w-12 flex items-start justify-center pt-10">
                <p className="vertical-text text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase whitespace-nowrap">
                    {cat.info}
                </p>
                </div>

                {/* Alt Kategori İsmi */}
                <div className="absolute bottom-12 left-10">
                  <Link 
                    href={cat.link}
                    className="text-2xl font-medium tracking-tight group-hover:text-gray-200 transition-colors inline-block"
                  >
                    {cat.title}
                    <span className="block h-[1px] w-full bg-gray-300 mt-1"></span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;