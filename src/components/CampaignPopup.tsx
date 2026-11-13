"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CampaignPopupProps {
  imageUrl?: string;
}

export default function CampaignPopup({ imageUrl }: CampaignPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    // Sayfa her açıldığında/yenilendiğinde 1 saniye sonra göster
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [imageUrl]);

  const closePopup = () => {
    setIsOpen(false);
  };

  if (!imageUrl) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={closePopup}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-md bg-transparent rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Kapatma Butonu */}
            <button
              onClick={closePopup}
              aria-label="Kapat"
              className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer"
            >
              ✕
            </button>

            {/* Sadece Kare Görsel */}
            <div className="relative w-full aspect-square">
              <Image
                src={imageUrl}
                alt="Kampanya"
                fill
                unoptimized={true}
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}