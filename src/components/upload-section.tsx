
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, FileUp, Plus, Heart, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStorage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';

interface UploadSectionProps {
  onPhotoUpload: (url: string) => void;
  onCardUpload: (cover: string, pdf: string) => void;
}

export function UploadSection({ onPhotoUpload, onCardUpload }: UploadSectionProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [cardCoverFile, setCardCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const storage = useStorage();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
    const file = e.target.files?.[0];
    if (file) setter(file);
  };

  const uploadToStorage = async (file: File, path: string) => {
    const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const submitPhoto = async () => {
    if (!photoFile || !storage) return;
    setIsUploading(true);
    try {
      const url = await uploadToStorage(photoFile, 'photos');
      onPhotoUpload(url);
      setPhotoFile(null);
      setIsOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error de Carga", description: "No se pudo subir la imagen a la nube." });
    } finally {
      setIsUploading(false);
    }
  };

  const submitCard = async () => {
    if (!cardCoverFile || !pdfFile || !storage) return;
    setIsUploading(true);
    try {
      const coverUrl = await uploadToStorage(cardCoverFile, 'covers');
      const pdfUrl = await uploadToStorage(pdfFile, 'pdfs');
      onCardUpload(coverUrl, pdfUrl);
      setCardCoverFile(null);
      setPdfFile(null);
      setIsOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error de Carga", description: "Hubo un problema al subir la carta o su portada." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-50 h-16 w-16 md:h-20 md:w-20 rounded-full shadow-2xl bg-primary text-white hover:bg-primary/90 hover:scale-110 transition-all border-none ring-8 ring-primary/5"
        >
          <Plus className="w-8 h-8 md:w-10 md:h-10" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[450px] bg-white border-none shadow-2xl p-0 overflow-hidden rounded-none">
        <div className="bg-primary/[0.03] p-6 border-b border-primary/10">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <DialogTitle className="font-headline text-2xl">Curaduría Eterna</DialogTitle>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Subida directa a Google Cloud</p>
          </DialogHeader>
        </div>
        
        <div className="p-6 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <section className="space-y-6">
            <h3 className="text-sm font-bold flex items-center gap-3 border-l-2 border-primary pl-4 text-foreground uppercase tracking-wider">
              <Camera className="w-4 h-4 text-primary" /> Fotografía
            </h3>
            <div className="space-y-4">
              <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setPhotoFile)} className="border-primary/10 h-12 pt-3 rounded-none" />
              {photoFile && (
                <Button onClick={submitPhoto} disabled={isUploading} className="w-full h-12 rounded-none">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Subir a la Nube
                </Button>
              )}
            </div>
          </section>

          <Separator className="bg-primary/5" />

          <section className="space-y-6">
            <h3 className="text-sm font-bold flex items-center gap-3 border-l-2 border-primary pl-4 text-foreground uppercase tracking-wider">
              <FileUp className="w-4 h-4 text-primary" /> Carta Editorial
            </h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Portada</Label>
                <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setCardCoverFile)} className="border-primary/10 h-12 pt-3 rounded-none" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Documento PDF</Label>
                <Input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, setPdfFile)} className="border-primary/10 h-12 pt-3 rounded-none" />
              </div>
              {cardCoverFile && pdfFile && (
                <Button onClick={submitCard} disabled={isUploading} className="w-full h-12 rounded-none">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Guardar para siempre
                </Button>
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
