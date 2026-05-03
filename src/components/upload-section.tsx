
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, FileUp, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 h-14 w-14 md:h-16 md:w-16 rounded-full shadow-2xl bg-primary text-white hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all border-none"
        >
          <Plus className="w-7 h-7 md:w-8 md:h-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[92vw] sm:max-w-[425px] bg-white border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-primary/5 p-5 md:p-6 border-b border-primary/10">
          <DialogHeader>
            <DialogTitle className="font-headline text-xl md:text-2xl text-foreground">Menú de Curaduría</DialogTitle>
            <p className="text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground pt-1">Actualizar el Archivo</p>
          </DialogHeader>
        </div>
        
        <div className="p-5 md:p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Carga de Fotos */}
          <section className="space-y-4">
            <h3 className="text-xs md:text-sm font-bold flex items-center gap-2 border-l-2 border-primary pl-3 text-foreground">
              <Camera className="w-4 h-4 text-primary" /> Galería de Momentos
            </h3>
            <div className="space-y-3">
              <Label htmlFor="photo-upload" className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">Seleccionar Imagen</Label>
              <div className="relative group">
                <Input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange} 
                  className="cursor-pointer file:text-primary file:font-bold border-primary/10 focus-visible:ring-primary/20" 
                />
              </div>
              {photoPreview && (
                <div className="mt-2 flex flex-col gap-2 p-3 border border-primary/10 bg-primary/5 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-primary">Previsualización Lista</span>
                    <Button variant="ghost" size="icon" onClick={() => setPhotoPreview(null)} className="h-6 w-6">
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                  <Button size="sm" onClick={submitPhoto} className="w-full text-xs font-bold uppercase tracking-wider h-8">Subir a la Galería</Button>
                </div>
              )}
            </div>
          </section>

          {/* Carga de Cartas */}
          <section className="space-y-4">
            <h3 className="text-xs md:text-sm font-bold flex items-center gap-2 border-l-2 border-primary pl-3 text-foreground">
              <FileUp className="w-4 h-4 text-primary" /> Nueva Carta Editorial
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-cover" className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">Arte de Portada (JPG/PNG)</Label>
                <Input id="card-cover" type="file" accept="image/*" onChange={handleCardCoverChange} className="border-primary/10 focus-visible:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-pdf" className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">Documento (PDF)</Label>
                <Input id="card-pdf" type="file" accept="application/pdf" onChange={handlePdfChange} className="border-primary/10 focus-visible:ring-primary/20" />
              </div>
              
              {cardCoverPreview && pdfFile && (
                <Button 
                  onClick={submitCard} 
                  className="w-full font-bold uppercase tracking-widest text-xs h-10 shadow-lg shadow-primary/10 animate-in zoom-in-95"
                >
                  Archivar Sentimiento
                </Button>
              )}
            </div>
          </section>
        </div>
        <div className="p-4 bg-muted/10 text-center">
          <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Cada detalle cuenta en nuestra historia</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
