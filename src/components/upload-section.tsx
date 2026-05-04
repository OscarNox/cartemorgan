
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, FileUp, Plus, Heart, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
    const file = e.target.files?.[0];
    setErrorMsg(null);
    if (file) {
      // Limite de seguridad para evitar errores de sincronización (Firestore 1MB limit)
      if (file.size > 1048576 && file.type === 'application/pdf') {
        setErrorMsg("El PDF es demasiado grande. Intenta con uno menor a 1MB para que se guarde para siempre.");
        return;
      }
      setter(file);
    }
  };

  // Convierte un archivo a Base64 para guardarlo directamente en la base de datos
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Comprime la imagen antes de guardarla para que nunca falle el guardado
  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Redimensionar si es muy grande
          const maxDim = 1200;
          if (width > height && width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          } else if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Calidad media para asegurar que quepa en Firestore
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
      };
    });
  };

  const submitPhoto = async () => {
    if (!photoFile) return;
    setIsUploading(true);
    try {
      const base64 = await compressImage(photoFile);
      onPhotoUpload(base64);
      setPhotoFile(null);
      setIsOpen(false);
      toast({ title: "¡Guardado al instante!", description: "La foto ya es parte de la página." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo procesar la imagen." });
    } finally {
      setIsUploading(false);
    }
  };

  const submitCard = async () => {
    if (!cardCoverFile || !pdfFile) return;
    setIsUploading(true);
    try {
      const [coverBase64, pdfBase64] = await Promise.all([
        compressImage(cardCoverFile),
        fileToBase64(pdfFile)
      ]);
      
      onCardUpload(coverBase64, pdfBase64);
      setCardCoverFile(null);
      setPdfFile(null);
      setIsOpen(false);
      toast({ title: "¡Carta Guardada!", description: "El documento se ha integrado correctamente." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Error al procesar los documentos." });
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
            <DialogDescription className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
              Guardado Directo en la Página (Sin Nube Externa)
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="p-6 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {errorMsg && (
            <Alert variant="destructive" className="rounded-none border-destructive/20 bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Atención</AlertTitle>
              <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
            </Alert>
          )}

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
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Guardar en la Página"}
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
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Integrar Documentos"}
                </Button>
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
