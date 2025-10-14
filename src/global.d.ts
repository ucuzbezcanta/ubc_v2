// src/global.d.ts

// 1. Genel CSS Modüllerini Tanıma (Tailwind CSS'in içeriği için)
// Genellikle CSS modülleri bir obje döndürür
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

// 2. Swiper CSS Modüllerini Tanıma (Side-effect import'ları)
// Bu import'lar sadece yan etki yaratır ve bir değişken atanmaz.
// En güvenli tanım: Modül içeriğinin string olduğunu varsaymak.
declare module "swiper/css" {
  const content: string;
  export default content;
}

declare module "swiper/css/pagination" {
  const content: string;
  export default content;
}

declare module "swiper/css/navigation" {
  const content: string;
  export default content;
}

// 3. Swiper/React ve Swiper/Modules için Tanımlar
// Bu modüller kendi tanımlamalarına sahiptir, sadece kesinleştiriyoruz.
declare module "swiper/react";
declare module "swiper/modules";
