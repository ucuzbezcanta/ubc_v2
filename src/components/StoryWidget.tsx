"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseCircle } from "react-icons/io5";

interface Story {
  id: string;
  title: string;
  cover_image_url: string;
  video_url: string;
  order_num: number | null;
}

// Supabase'den verileri çeken sunucu fonksiyonu (props olarak alacağız)
// Not: Normalde Client Component async olamaz. page.tsx'ten veri alacağız.
// Şimdilik bu kısmı page.tsx'e taşımadan önce, bileşeni props alacak şekilde hazırlayalım.
interface StoryWidgetProps {
  stories: Story[];
}

export default function StoryWidget({ stories }: StoryWidgetProps) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openStory = (story: Story) => {
    setActiveStory(story);
  };

  const closeStory = () => {
    setActiveStory(null);
  };

  //Video bittiğinde otomatik kapat
  const handleVideoEnd = () => {
    closeStory();
  };

  if (!stories || stories.length === 0) {
    return null; //Hikaye yoksa bileşeni render etme
  }

  return (
    <>
      <div className="container mx-auto p-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Öne Çıkan Hikayeler</h2>

        {/* Hikaye Akışı (Yatay Kaydırılabilir) */}
        <div className="flex space-x-4 overflow-x-scroll pb-4 scrollbar-hide">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              className="flex flex-col items-center cursor-pointer flex-shrink-0"
              onClick={() => openStory(story)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-50 h-50 rounded-full border-4 border-pink-500 p-0.5 overflow-hidden">
                <Image
                  src={story.cover_image_url}
                  alt={story.title}
                  fill={true}
                  className="rounded-full object-cover"
                />
              </div>
              <p className="text-xs mt-1 text-gray-600 truncate max-w-[80px]">
                {story.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hikaye Modal (Fullscreen Görüntüleyici) */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeStory} // Boşluğa tıklayınca kapanma
          >
            <motion.div
              className="relative w-full max-w-md h-full max-h-[80vh] rounded-lg overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()} // Video alanına tıklayınca kapanmayı engelle
            >
              {/* Video Player */}
              <video
                ref={videoRef}
                src={activeStory.video_url}
                className="w-full h-full object-cover"
                autoPlay
                controls={false} // Kontrolleri gizleyebiliriz
                onEnded={handleVideoEnd}
                onLoadedMetadata={() => videoRef.current?.play()}
                loop={false} // Tekrar oynatmayı kapat
              />

              {/* Kapatma Butonu */}
              <button
                onClick={closeStory}
                className="absolute top-4 right-4 text-white p-2 text-3xl z-10"
              >
                <IoCloseCircle />
              </button>

              {/* Başlık */}
              <div className="absolute top-0 left-0 right-0 p-4 text-white bg-black/30">
                <h3 className="font-bold">{activeStory.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
