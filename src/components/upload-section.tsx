
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, FileUp, Plus, Trash2, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface UploadSectionProps {
  onPhotoUpload: (url: string) => void;
  onCardUpload: (cover: string, pdf: string) => void;
}

export function UploadSection({ onPhotoUpload, onCardUpload }: UploadSectionProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cardCoverPreview, setCardCoverPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCardCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCardCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPdfFile(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submitPhoto = () => {
    if (photoPreview) {
      onPhotoUpload(photoPreview);
      setPhotoPreview(null);
      setIsOpen(false);
    }
  };

  const submitCard = () => {
    if (cardCoverPreview && pdfFile) {
      onCardUpload(cardCoverPreview, pdfFile);
      setCardCoverPreview(null);
      setPdfFile(null);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-50 h-16 w-16 md:h-20 md:w-20 rounded-full shadow-2xl bg-primary text-white hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all border-none ring-8 ring-primary/5"
        >
          <Plus className="w-8 h-8 md:w-10 md:h-10" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[450px] bg-white border-none shadow-[0_0_50px_rgba(0,0,0,0.1)] p-0 overflow-hidden rounded-none">
        <div className="bg-primary/[0.03] p-6 md:p-8 border-b border-primary/10">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <DialogTitle className="font-headline text-2xl text-foreground">Curaduría de Memorias</DialogTitle>
            </div>
            <p className="text-[10px] font-body tracking-[0.3em] uppercase text-muted-foreground">Actualizar nuestro archivo eterno</p>
          </DialogHeader>
        </div>
        
        <div className="p-6 md:p-8 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Carga de Fotos */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold flex items-center gap-3 border-l-2 border-primary pl-4 text-foreground uppercase tracking-wider">
              <Camera className="w-4 h-4 text-primary" /> Fotografía Nueva
            </h3>
            <div className="space-y-4">
              <Label htmlFor="photo-upload" className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">Seleccionar del carrete</Label>
              <Input 
                id="photo-upload" 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoChange} 
                className="cursor-pointer border-primary/10 focus-visible:ring-primary/20 rounded-none h-12 pt-3" 
              />
              {photoPreview && (
                <div className="mt-4 p-4 border border-primary/10 bg-primary/[0.02] animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Previsualización</span>
                    <Button variant="ghost" size="icon" onClick={() => setPhotoPreview(null)} className="h-8 w-8 hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <Button onClick={submitPhoto} className="w-full text-xs font-bold uppercase tracking-[0.2em] h-12 rounded-none">
                    Subir a la Galería
                  </Button>
                </div>
              )}
            </div>
          </section>

          <Separator className="bg-primary/5" />

          {/* Carga de Cartas */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold flex items-center gap-3 border-l-2 border-primary pl-4 text-foreground uppercase tracking-wider">
              <FileUp className="w-4 h-4 text-primary" /> Suspiro Editorial
            </h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="card-cover" className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">Portada de la Carta</Label>
                <Input id="card-cover" type="file" accept="image/*" onChange={handleCardCoverChange} className="border-primary/10 focus-visible:ring-primary/20 rounded-none h-12 pt-3" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-pdf" className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">Documento PDF</Label>
                <Input id="card-pdf" type="file" accept="application/pdf" onChange={handlePdfChange} className="border-primary/10 focus-visible:ring-primary/20 rounded-none h-12 pt-3" />
              </div>
              
              {cardCoverPreview && pdfFile && (
                <Button 
                  onClick={submitCard} 
                  className="w-full font-bold uppercase tracking-[0.2em] text-xs h-12 rounded-none shadow-xl shadow-primary/10 animate-in slide-in-from-bottom-4"
                >
                  Guardar para siempre
                </Button>
              )}
            </div>
          </section>
        </div>
        <div className="p-5 bg-primary/[0.03] text-center border-t border-primary/10">
          <p className="text-[9px] uppercase tracking-[0.4em] text-primary/60 font-medium">Cada detalle construye nuestro infinito</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
