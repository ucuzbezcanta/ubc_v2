"use client";

import { useState,useEffect } from "react";

const LogoIntro = () => {
  // 1. Animasyonun görünürlüğünü yönetir
  const [isVisible, setIsVisible] = useState(true);
  // 2. DOM'dan tamamen kaldırılma durumunu yönetir
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // A) 3 saniye sonra görünmez yap (Opacity: 0)
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false); 
    }, 3000); // Video süresi

    // B) CSS geçiş süresi (500ms) + video süresi (3000ms) = 3500ms sonra DOM'dan kaldır
    const removalTimer = setTimeout(() => {
        setIsRemoved(true);
    }, 3500); // 3000ms (Video) + 500ms (CSS Geçişi)

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removalTimer);
    };
  }, []);

  // Bileşen tamamen kaldırıldıysa null döndür
  if (isRemoved) {
    return null; 
  }

    return(
        <div 
      className={`logo-intro-container ${!isVisible ? 'logo-intro-hidden' : ''}`}
      // !isVisible durumunda 'logo-intro-hidden' sınıfını ekler
    >
      <video
        className="logo-video"
        src="/ubc_capcut_2.mp4"
        autoPlay
        muted 
        playsInline
      />
    </div>
    );
};

export default LogoIntro;