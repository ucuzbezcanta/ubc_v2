import Link from "next/link";
import Image from "next/image";
import { ProductForCategory } from "../../lib/supabaseClient";
import { getImageUrl } from "@/utils/imageHelper";


export default function RelatedProducts({ products }: { products: ProductForCategory[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-20 border-t pt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 px-2">Benzer Ürünler</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={`/urunler/${product.slug}`}
            className="group block bg-white rounded-2xl overflow-hidden border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
              <Image
                src={getImageUrl(product.main_image_url) || "/images/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-400 mt-2">Detaylı Bilgi İçin Tıklayın</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}