
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, FileUp, Plus, Heart, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useStorage } from '@/firebase';

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
  const { toast } = useToast();
  const storage = useStorage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
    const file = e.target.files?.[0];
    if (file) setter(file);
  };

  const uploadFileToCloud = async (file: File, folder: string): Promise<string> => {
    const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const submitPhoto = async () => {
    if (!photoFile) return;
    setIsUploading(true);
    try {
      const downloadUrl = await uploadFileToCloud(photoFile, 'photos');
      onPhotoUpload(downloadUrl);
      setPhotoFile(null);
      setIsOpen(false);
      toast({ title: "¡Fotografía Guardada!", description: "Se ha almacenado permanentemente en la nube." });
    } catch (error: any) {
      console.error(error);
      toast({ 
        variant: "destructive", 
        title: "Error de Subida", 
        description: "No se pudo subir la imagen. Revisa tu conexión." 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const submitCard = async () => {
    if (!cardCoverFile || !pdfFile) return;
    setIsUploading(true);
    try {
      // Subida en paralelo para máxima velocidad
      const [coverUrl, pdfUrl] = await Promise.all([
        uploadFileToCloud(cardCoverFile, 'covers'),
        uploadFileToCloud(pdfFile, 'pdfs')
      ]);
      
      onCardUpload(coverUrl, pdfUrl);
      setCardCoverFile(null);
      setPdfFile(null);
      setIsOpen(false);
      toast({ title: "¡Carta Editorial Integrada!", description: "Documento guardado con éxito." });
    } catch (error: any) {
      console.error(error);
      toast({ 
        variant: "destructive", 
        title: "Error de Subida", 
        description: "Hubo un problema al subir los archivos de la carta." 
      });
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
              <DialogTitle className="font-headline text-2xl">Añadir Recuerdo</DialogTitle>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Guardado Permanente en Google Cloud</p>
          </DialogHeader>
        </div>
        
        <div className="p-6 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <section className="space-y-6">
            <h3 className="text-sm font-bold flex items-center gap-3 border-l-2 border-primary pl-4 text-foreground uppercase tracking-wider">
              <Camera className="w-4 h-4 text-primary" /> Nueva Fotografía
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Seleccionar Imagen</Label>
                <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setPhotoFile)} className="border-primary/10 h-12 pt-3 rounded-none cursor-pointer" />
              </div>
              {photoFile && (
                <Button onClick={submitPhoto} disabled={isUploading} className="w-full h-12 rounded-none bg-primary hover:bg-primary/90 font-bold tracking-widest uppercase text-xs">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Subir a la Nube"}
                </Button>
              )}
            </div>
          </section>

          <Separator className="bg-primary/10" />

          <section className="space-y-6">
            <h3 className="text-sm font-bold flex items-center gap-3 border-l-2 border-primary pl-4 text-foreground uppercase tracking-wider">
              <FileUp className="w-4 h-4 text-primary" /> Nueva Carta Editorial
            </h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Imagen de Portada</Label>
                <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setCardCoverFile)} className="border-primary/10 h-12 pt-3 rounded-none cursor-pointer" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Archivo PDF Original</Label>
                <Input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, setPdfFile)} className="border-primary/10 h-12 pt-3 rounded-none cursor-pointer" />
              </div>
              {cardCoverFile && pdfFile && (
                <Button onClick={submitCard} disabled={isUploading} className="w-full h-12 rounded-none bg-primary hover:bg-primary/90 font-bold tracking-widest uppercase text-xs">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Subir Documentos"}
                </Button>
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
