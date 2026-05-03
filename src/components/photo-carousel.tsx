
"use client";

import React from 'react';
import Image from 'next/image';

interface PhotoCarouselProps {
  photos: string[];
}

export function PhotoCarousel({ photos }: PhotoCarouselProps) {
  if (photos.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border-y border-primary/10 bg-white/30 space-y-4">
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary/60 font-bold">
          Archivo Visual Vacío
        </p>
        <p className="text-xs font-body italic text-muted-foreground">
          Usa el botón (+) para añadir tus momentos a esta antología.
        </p>
      </div>
    );
  }

  // Multiply items to ensure seamless loop if there are enough photos
  const displayPhotos = photos.length > 5 ? [...photos, ...photos] : [...photos, ...photos, ...photos, ...photos];

  return (
    <div className="relative w-full overflow-hidden bg-white/50 py-12">
      <div className="flex animate-marquee gap-8 items-center whitespace-nowrap">
        {displayPhotos.map((photo, index) => (
          <div 
            key={index} 
            className="relative flex-shrink-0 w-64 h-80 grayscale hover:grayscale-0 transition-all duration-700 ease-in-out group"
          >
            <Image
              src={photo}
              alt={`Gallery photo ${index}`}
              fill
              className="object-cover"
              sizes="256px"
            />
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
    </div>
  );
}
