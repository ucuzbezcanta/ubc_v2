'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function GalleryEditor({ initialImages }: { initialImages: string[] }) {
  const [images, setImages] = useState<string[]>(initialImages);

  const removeImage = (urlToRemove: string) => {
    setImages(images.filter(url => url !== urlToRemove));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-gray-700">Ürün Galerisi</label>
      
      {/* Silinenleri takip etmek için gizli input (Form action burayı okuyacak) */}
      <input type="hidden" name="current_gallery_urls" value={JSON.stringify(images)} />

      <div className="grid grid-cols-3 gap-3">
        {images.map((url, i) => (
          <div key={`${url}-${i}`} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 bg-white">
            <Image src={url} alt={`Galeri ${i}`} fill className="object-cover" unoptimized />
            
            {/* Silme Butonu (X) */}
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
            >
              ✕
            </button>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-3 py-6 text-center border-2 border-dashed rounded-xl text-gray-400 text-xs">
            Görsel yok.
          </div>
        )}
      </div>

      <label className="flex flex-col items-center justify-center w-full h-12 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors font-medium text-sm text-center">
        <span>🖼️ Galeriye Fotoğraf Ekle</span>
        <input name="gallery_images" type="file" accept="image/*" multiple className="hidden" />
      </label>
    </div>
  );
}