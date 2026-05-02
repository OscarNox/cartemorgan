
"use client";

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, FileUp, Plus, X } from 'lucide-react';
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
          className="fixed bottom-10 right-10 z-50 h-16 w-16 rounded-full shadow-2xl bg-primary text-white hover:bg-primary/90 hover:scale-110 transition-all border-none"
        >
          <Plus className="w-8 h-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-primary/5 p-6 border-b border-primary/10">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Curation Menu</DialogTitle>
            <p className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground pt-1">Enhance Your Collection</p>
          </DialogHeader>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Photo Upload */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 border-l-2 border-primary pl-3">
              <Camera className="w-4 h-4" /> Gallery Addition
            </h3>
            <div className="space-y-2">
              <Label htmlFor="photo-upload" className="text-xs uppercase text-muted-foreground tracking-widest">Select Image</Label>
              <Input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="cursor-pointer" />
              {photoPreview && (
                <div className="mt-2 flex items-center justify-between p-2 border border-primary/20 bg-primary/5">
                  <span className="text-xs truncate max-w-[200px]">Image selected</span>
                  <Button size="sm" onClick={submitPhoto} className="h-7 text-xs">Add to Carousel</Button>
                </div>
              )}
            </div>
          </section>

          {/* Card Upload */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 border-l-2 border-primary pl-3">
              <FileUp className="w-4 h-4" /> Editorial Card
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-cover" className="text-xs uppercase text-muted-foreground tracking-widest">Cover Artwork</Label>
                <Input id="card-cover" type="file" accept="image/*" onChange={handleCardCoverChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-pdf" className="text-xs uppercase text-muted-foreground tracking-widest">PDF Document</Label>
                <Input id="card-pdf" type="file" accept="application/pdf" onChange={handlePdfChange} />
              </div>
              {cardCoverPreview && pdfFile && (
                <Button onClick={submitCard} className="w-full">Create Signature Card</Button>
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
