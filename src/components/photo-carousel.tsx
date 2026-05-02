
"use client";

import React from 'react';
import Image from 'next/image';

interface PhotoCarouselProps {
  photos: string[];
}

export function PhotoCarousel({ photos }: PhotoCarouselProps) {
  // Triple the items to ensure seamless loop
  const displayPhotos = [...photos, ...photos, ...photos];

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
