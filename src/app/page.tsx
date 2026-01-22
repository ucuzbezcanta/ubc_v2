import { supabase } from "../../lib/supabaseClient";

import Slider from "@/components/Slider";
import { Metadata } from "next";

import PopularCategories from "@/components/PopularCategories";
import FeaturedProducts from "@/components/FeaturedProducts";

import LogoIntro from "@/components/LogoIntro";

import { getImageUrl } from "@/utils/imageHelper";

import CategorySlider from "@/components/CategorySlider";

interface Slide {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  order_num: number | null;
  button_text: string | null;
}

// --- ANA SAYFAYA ÖZEL METADATA ---
export const metadata: Metadata = {
  title: "Anasayfa - Ucuz bez çanta", // layout.tsx'teki template ile birleşerek "Anasayfa | Ucuz Bez Çanta" olur
  description: "Ucuz bez çanta, kanvas çanta ve ham bez çanta siparişlerinizi toptan fiyatlarla, en kaliteli baskı çözümleriyle hemen alın. Türkiye'nin en hızlı bez çanta üreticisi.",

  keywords: ["bez çanta toptan satış", "kanvas çanta imalatı", "promosyon"],

  openGraph: {
    type: 'website',
    description: "Türkiye genelinde toptan bez çanta imalatında lider. Promosyon ve etkinlikleriniz için çözümler. Kaliteyi ucuza alın!",
  },


  alternates: {
    canonical: '/', // layout.tsx'te tanımlanan metadataBase'e "/ " ekler
  }
};

// Server Component'te (page.tsx) çalışacak veri çekme fonksiyonu
async function getSlides(): Promise<Slide[]> {
  const { data, error } = await supabase
    .from("slides")
    .select("*")
    .order("order_num", { ascending: true });

  if (error) {
    console.error("Slayt verileri çekilirken hata:", error.message);
    return [];
  }
  return (data ?? []).map((slide) => ({
    ...slide,
    image_url: getImageUrl(slide.image_url),
  })) as Slide[];
}

export default async function HomePage() {
  // Tüm veri çekme işlemleri burada, Server Component'te yapılıyor
  const slides = await getSlides();


  return (
    <>
      <LogoIntro />
      <main className="pt-16">
        {/* 1. SLAYT BÖLÜMÜ - Çekilen veriyi props olarak aktarıyoruz */}
        <Slider slides={slides} />

        {/* Öne çıkan ürünler */}
        <FeaturedProducts />

        {/* POPULAR KATEGORILER */}
        <CategorySlider />

      </main>
    </>
  );
}
