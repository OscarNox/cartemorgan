
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, Sparkles, Eye, X } from 'lucide-react';
import { generatePdfHighlights } from '@/ai/flows/generate-pdf-highlights-flow';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const toggleFlipOnMobile = () => {
    if (window.innerWidth < 768) {
      if (!isFlipped) {
        handleReveal();
      } else {
        setIsFlipped(false);
      }
    }
  };

  return (
    <>
      <div 
        className="relative w-full aspect-[3/4] group perspective-1000 cursor-pointer md:cursor-default"
        onMouseEnter={() => window.innerWidth >= 768 && handleReveal()}
        onMouseLeave={() => window.innerWidth >= 768 && setIsFlipped(false)}
        onClick={toggleFlipOnMobile}
      >
        <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front Face */}
          <div className="absolute inset-0 backface-hidden">
            <div className="relative w-full h-full bg-white border border-border shadow-md overflow-hidden">
              <Image
                src={coverImage}
                alt="Portada de la tarjeta"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                data-ai-hint="editorial cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20">
                <div className="bg-white/95 p-2 border border-primary/20 backdrop-blur-sm shadow-sm">
                  <FileText className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
              </div>

              <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-20 md:opacity-0 md:group-hover:opacity-100 transition-all">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 md:h-10 md:w-10 rounded-none bg-white/95 text-destructive hover:bg-destructive hover:text-white border border-destructive/20 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Ayuda táctil para móviles */}
              <div className="absolute bottom-3 left-3 md:hidden z-20">
                <div className="bg-white/90 px-2 py-1 text-[8px] uppercase tracking-widest text-primary font-bold">
                  Toca para leer
                </div>
              </div>
            </div>
          </div>

          {/* Back Face */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border-2 border-primary/20 p-4 md:p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-3 md:space-y-4 overflow-hidden">
              <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary animate-pulse" />
                  <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-primary">Análisis IA</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-[9px] md:text-[10px] uppercase tracking-tighter text-primary hover:bg-primary/5 px-2 font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPreviewOpen(true);
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" /> Ver Completo
                </Button>
              </div>
              
              {isLoading ? (
                <div className="space-y-3 py-4">
                  <div className="h-2 w-full bg-muted animate-pulse" />
                  <div className="h-2 w-3/4 bg-muted animate-pulse" />
                  <div className="h-2 w-5/6 bg-muted animate-pulse" />
                  <div className="h-2 w-1/2 bg-muted animate-pulse" />
                </div>
              ) : (
                <div className="text-[12px] md:text-sm font-body leading-relaxed text-muted-foreground overflow-y-auto max-h-[180px] md:max-h-[250px] pr-2 custom-scrollbar">
                  {highlights || "Toca o pasa el cursor para analizar..."}
                </div>
              )}
            </div>
            
            <div className="pt-3 md:pt-4 border-t border-primary/10 flex justify-center italic text-[9px] md:text-[10px] text-primary/60 uppercase tracking-widest font-medium">
              Carte Morgan Editorial
            </div>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal Responsivo */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[92vh] p-0 overflow-hidden bg-white border-none shadow-2xl flex flex-col">
          <div className="p-4 md:p-5 bg-primary/5 border-b border-primary/10 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-primary/20 shadow-sm">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-headline text-base md:text-lg text-foreground">Archivo Histórico</h2>
                <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground">Original Digitalizada</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsPreviewOpen(false)}
              className="rounded-none hover:bg-primary/10 h-8 w-8 md:h-10 md:w-10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1 bg-muted/20 relative overflow-hidden">
            <iframe 
              src={`${pdfDataUri}#toolbar=0&navpanes=0`} 
              className="w-full h-full border-none"
              title="PDF Preview"
            />
          </div>
          <div className="p-3 md:p-4 bg-white border-t border-primary/10 text-center shrink-0">
            <p className="text-[8px] md:text-[9px] font-body text-muted-foreground uppercase tracking-[0.4em]">
              Antología Personal de Amor • Carte Morgan
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
