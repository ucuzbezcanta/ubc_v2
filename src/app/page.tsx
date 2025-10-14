import { supabase } from "../../lib/supabaseClient";

import Slider from "@/components/Slider";

import PopularCategories from "@/components/PopularCategories";
import FeaturedProducts from "@/components/FeaturedProducts";

interface Slide {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  order_num: number | null;
  button_text: string | null;
}



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
  return data as Slide[];
}

export default async function HomePage() {
  // Tüm veri çekme işlemleri burada, Server Component'te yapılıyor
  const slides = await getSlides();
 

  return (
    <main className="pt-16">
      {/* 1. SLAYT BÖLÜMÜ - Çekilen veriyi props olarak aktarıyoruz */}
      <Slider slides={slides} />


      {/* POPULAR KATEGORILER */}
      <PopularCategories />

      {/* Öne çıkan ürünler */}
      <FeaturedProducts />
    </main>
  );
}
