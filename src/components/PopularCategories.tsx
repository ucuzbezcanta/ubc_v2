import Link from "next/link";
import Image from "next/image";

const POPULAR_CATEGORIES = [
  {
    name: "Promosyon Gabardin Çantalar",
    slug: "gabardin-cantalar",
    image: "/images/gabardin_kategori.jpg",
  },
  {
    name: "Promosyon Kanvas Çantalar",
    slug: "kanvas-cantalar",
    image: "/images/kanvas-kategori.jpg",
  },
  {
    name: "Clutch & Keseler",
    slug: "clutch-and-keseler",
    image: "/images/clutch-kategori.jpg",
  },
  {
    name: "Lamineli Dijital Baskılı Çantalar",
    slug: "lamineli-dijital-baskili-cantalar",
    image: "/images/lamineli-kategori.jpg",
  },
];

export default function PopularCategories() {
  return (
    <section className="container mx-auto px-4 py-12">
      {/* Üst Başlıklar */}
      <div className="flex justify-start space-x-12 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-b-2 border-indigo-600">
          Popüler Kategoriler
        </h2>
      </div>

      <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 md:gap-6 pb-4 md:pb-0">
        {/* 2. KART VE SONRASI: Dinamik Kategori Kartları */}
        {POPULAR_CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/kategoriler/${category.slug}`}
            className="flex-shrink-0 w-44 md:w-auto group block"
          >
            {/* Kategori Görseli (Kare içinde) */}
            <div className="w-full h-64 relative rounded-xl overflow-hidden shadow-md transition duration-300 group-hover:shadow-xl">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>

            {/* Kategori Adı (Kare dışında, altında) */}
            <div className="mt-3 text-center">
              <span className="text-base font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
