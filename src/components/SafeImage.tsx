"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "src" | "onError" | "onLoad"> {
  src?: string | null;
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt,
  className = "",
  fallbackSrc = "/dikiliyor-canta.png",
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setFallbackFailed(false);
    setIsLoaded(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden bg-[#F4F4F4]">
        {!fallbackFailed && fallbackSrc && (
          <Image
            src={fallbackSrc}
            alt={`${alt} - Görsel hazırlanıyor`}
            fill
            sizes={props.sizes || "100vw"}
            onError={() => setFallbackFailed(true)}
            className="object-cover opacity-55"
          />
        )}

        <div className="relative z-10 bg-black/35 w-full h-full flex flex-col items-center justify-center p-1.5 text-center">
          <span className="text-[10px] sm:text-xs font-medium text-white drop-shadow leading-tight mb-1.5">
            Görsel hazırlanıyor
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.reload();
            }}
            className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-medium bg-white text-[#111111] rounded shadow hover:bg-neutral-100 transition cursor-pointer"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#EFEFEF] animate-pulse"
        />
      )}
      <Image
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          console.warn("[SafeImage] onError:", { alt, src });
          setHasError(true);
        }}
        {...props}
      />
    </>
  );
}