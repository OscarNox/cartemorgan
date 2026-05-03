
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
  DialogTrigger,
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

  return (
    <>
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
                data-ai-hint="editorial cover"
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

          {/* Back Face (AI Summary & Preview Button) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border-2 border-primary/20 p-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Análisis IA</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-[10px] uppercase tracking-tighter text-primary hover:bg-primary/5 px-2"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <Eye className="w-3 h-3 mr-1" /> Ver Documento
                </Button>
              </div>
              
              {isLoading ? (
                <div className="space-y-2 py-4">
                  <div className="h-2 w-full bg-muted animate-pulse" />
                  <div className="h-2 w-3/4 bg-muted animate-pulse" />
                  <div className="h-2 w-1/2 bg-muted animate-pulse" />
                </div>
              ) : (
                <div className="text-sm font-body leading-relaxed text-muted-foreground line-clamp-[12] overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
                  {highlights || "Pase el cursor para analizar el documento..."}
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-primary/10 flex justify-center italic text-[10px] text-primary/60 uppercase tracking-widest">
              Carte Morgan Editorial
            </div>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-white border-none shadow-2xl">
          <div className="flex flex-col h-full">
            <div className="p-4 bg-primary/5 border-b border-primary/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white border border-primary/20">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-headline text-lg text-foreground">Vista Previa del Documento</h2>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Original Archivada</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-none hover:bg-primary/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 bg-muted/20 relative">
              <iframe 
                src={`${pdfDataUri}#toolbar=0&navpanes=0`} 
                className="w-full h-full border-none"
                title="PDF Preview"
              />
            </div>
            <div className="p-4 bg-white border-t border-primary/10 text-center">
              <p className="text-[10px] font-body text-muted-foreground uppercase tracking-[0.3em]">
                Protegido en la Antología Carte Morgan
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
