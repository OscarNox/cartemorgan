
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, Sparkles } from 'lucide-react';
import { generatePdfHighlights } from '@/ai/flows/generate-pdf-highlights-flow';

interface CardPreviewProps {
  id: string;
  coverImage: string;
  pdfDataUri: string;
  onDelete: (id: string) => void;
}

export function CardPreview({ id, coverImage, pdfDataUri, onDelete }: CardPreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [highlights, setHighlights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReveal = async () => {
    if (!highlights && !isLoading) {
      setIsLoading(true);
      try {
        const result = await generatePdfHighlights({ pdfDataUri });
        setHighlights(result.highlights);
      } catch (error) {
        setHighlights("No se pudieron generar los puntos clave en este momento.");
      } finally {
        setIsLoading(false);
      }
    }
    setIsFlipped(true);
  };

  return (
    <div 
      className="relative w-full aspect-[3/4] group perspective-1000"
      onMouseEnter={handleReveal}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden">
          <div className="relative w-full h-full bg-white border border-border shadow-none overflow-hidden">
            <Image
              src={coverImage}
              alt="Portada de la tarjeta"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-white/90 p-2 border border-primary/20 backdrop-blur-sm">
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              <Button
                variant="destructive"
                size="icon"
                className="rounded-none bg-white/90 text-destructive hover:bg-destructive hover:text-white border border-destructive/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Back Face (AI Summary) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border-2 border-primary/20 p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-primary/10 pb-2">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Análisis de Tarjeta</span>
            </div>
            
            {isLoading ? (
              <div className="space-y-2 py-4">
                <div className="h-2 w-full bg-muted animate-pulse" />
                <div className="h-2 w-3/4 bg-muted animate-pulse" />
                <div className="h-2 w-1/2 bg-muted animate-pulse" />
              </div>
            ) : (
              <div className="text-sm font-body leading-relaxed text-muted-foreground line-clamp-[12]">
                {highlights || "Pase el cursor para analizar el documento..."}
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t border-primary/10 flex justify-center italic text-xs text-primary/60">
            Carte Blanche Editorial
          </div>
        </div>
      </div>
    </div>
  );
}
