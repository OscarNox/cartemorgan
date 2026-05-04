
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, Sparkles, Eye, X, Quote } from 'lucide-react';
import { generatePdfHighlights } from '@/ai/flows/generate-pdf-highlights-flow';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface CardPreviewProps {
  id: string;
  coverImage: string;
  pdfDataUri: string;
  uploadedByUserId: string;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

export function CardPreview({ id, coverImage, pdfDataUri, onDelete, isAdmin }: CardPreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [highlights, setHighlights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleReveal = async () => {
    if (!highlights && !isLoading) {
      setIsLoading(true);
      try {
        const result = await generatePdfHighlights({ pdfDataUri });
        if (result && result.highlights) {
          setHighlights(result.highlights);
        } else {
          throw new Error("Respuesta vacía de la IA");
        }
      } catch (error) {
        console.error("Error al generar la esencia en producción:", error);
        setHighlights("No pudimos extraer la esencia de esta carta en este momento. Revisa la configuración de la API Key en Netlify.");
      } finally {
        setIsLoading(false);
      }
    }
    setIsFlipped(true);
  };

  const toggleFlipOnMobile = () => {
    if (window.innerWidth < 768) {
      if (!isFlipped) handleReveal();
      else setIsFlipped(false);
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
          
          {/* Lado Frontal (Portada) */}
          <div className="absolute inset-0 backface-hidden">
            <div className="relative w-full h-full bg-white border border-border shadow-lg overflow-hidden">
              <Image
                src={coverImage}
                alt="Portada Editorial"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-white/95 p-2.5 border border-primary/20 backdrop-blur-sm shadow-sm">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
              </div>

              {isAdmin && (
                <div className="absolute bottom-4 right-4 z-20 md:opacity-0 md:group-hover:opacity-100 transition-all">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10 rounded-none bg-white text-destructive hover:bg-destructive hover:text-white border border-destructive/20 shadow-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <div className="absolute bottom-4 left-4 md:hidden z-20">
                <div className="bg-white/90 px-3 py-1.5 text-[9px] uppercase tracking-widest text-primary font-bold shadow-sm">
                  Toca para leer el alma
                </div>
              </div>
            </div>
          </div>

          {/* Lado Posterior (Texto de IA) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#FAF9F6] border-2 border-primary/10 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Quote className="w-24 h-24 text-primary" />
            </div>

            <div className="relative z-10 space-y-6 flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Esencia de la Carta</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-[9px] uppercase tracking-widest text-primary hover:bg-primary/5 px-3 font-bold border border-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPreviewOpen(true);
                  }}
                >
                  <Eye className="w-3.5 h-3.5 mr-2" /> PDF Original
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                  <div className="space-y-4 py-6">
                    <div className="h-2 w-full bg-primary/5 animate-pulse rounded-full" />
                    <div className="h-2 w-[90%] bg-primary/5 animate-pulse rounded-full" />
                    <div className="h-2 w-[95%] bg-primary/5 animate-pulse rounded-full" />
                    <div className="h-2 w-[80%] bg-primary/5 animate-pulse rounded-full" />
                    <div className="h-2 w-[85%] bg-primary/5 animate-pulse rounded-full" />
                  </div>
                ) : (
                  <p className="text-sm md:text-base font-body leading-relaxed text-foreground/80 italic text-center md:text-left pt-2">
                    {highlights || "Analizando el contenido..."}
                  </p>
                )}
              </div>
            </div>
            
            <div className="pt-6 border-t border-primary/10 text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-primary/40 font-bold">
                Archivo Carte Morgan • {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-white border-none shadow-2xl flex flex-col rounded-none">
          <div className="p-4 md:p-6 bg-primary/[0.03] border-b border-primary/10 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white border border-primary/20 shadow-sm">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-headline text-lg md:text-xl text-foreground">Documento Original</h2>
                <p className="text-[9px] uppercase trackingwidest text-muted-foreground mt-0.5">Nuestros Suspiros Digitalizados</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsPreviewOpen(false)}
              className="rounded-none hover:bg-primary/10 h-10 w-10"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex-1 bg-muted/30 relative">
            <iframe 
              src={`${pdfDataUri}#toolbar=0&navpanes=0`} 
              className="w-full h-full border-none"
              title="Visor de PDF"
            />
          </div>
          <div className="p-4 bg-white border-t border-primary/10 text-center shrink-0">
            <p className="text-[8px] md:text-[9px] font-body text-muted-foreground uppercase tracking-[0.5em]">
              Propiedad de Nuestra Historia de Amor
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
