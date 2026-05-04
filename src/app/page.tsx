
"use client";

import React, { useEffect, useState } from 'react';
import { PhotoCarousel } from '@/components/photo-carousel';
import { CardPreview } from '@/components/card-preview';
import { UploadSection } from '@/components/upload-section';
import { AuthModal } from '@/components/auth-modal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { useFirestore, useUser, useAuth, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc, serverTimestamp, addDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { LogOut, ShieldCheck, Heart } from 'lucide-react';

export default function CarteBlanchePage() {
  const { toast } = useToast();
  const db = useFirestore();
  const auth = useAuth();
  const { user } = useUser();
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const isAdmin = user?.email?.toLowerCase() === 'aidaluxmorgan@gmail.com';

  const photosQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
  }, [db]);

  const cardsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'cards'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: photos, isLoading: photosLoading } = useCollection(photosQuery);
  const { data: cards, isLoading: cardsLoading } = useCollection(cardsQuery);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [cards, photos]);

  const addPhoto = async (url: string) => {
    if (!isAdmin || !db) return;
    try {
      await addDoc(collection(db, 'photos'), {
        url,
        uploadedByUserId: user?.uid,
        createdAt: serverTimestamp()
      });
      toast({ title: "Imagen Añadida", description: "Tu fotografía ha sido guardada en la galería eterna." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar la referencia en la base de datos." });
    }
  };
  
  const addCard = async (cover: string, pdf: string) => {
    if (!isAdmin || !db) return;
    try {
      await addDoc(collection(db, 'cards'), {
        coverImage: cover,
        pdfDataUri: pdf,
        uploadedByUserId: user?.uid,
        createdAt: serverTimestamp()
      });
      toast({ title: "Carta Archivada", description: "Tu nuevo suspiro ha sido guardado permanentemente." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo archivar la carta." });
    }
  };

  const deleteCard = async (id: string) => {
    if (!isAdmin || !db) return;
    try {
      await deleteDoc(doc(db, 'cards', id));
      toast({ title: "Registro Removido", description: "La carta ha sido eliminada del archivo." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No tienes permisos para eliminar este registro." });
    }
  };

  const handleSignOut = () => {
    signOut(auth);
    toast({ title: "Sesión Cerrada", description: "Has vuelto al modo espectador." });
  };

  return (
    <div className="min-h-screen botanical-pattern relative overflow-hidden selection:bg-primary/20">
      <nav className="fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between items-start z-40 mix-blend-difference">
        <div className="pointer-events-auto">
          <h1 className="font-headline text-2xl md:text-3xl text-white tracking-tighter">Carte Morgan.</h1>
          <p className="font-body text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-white/60">Archivo de Momentos Eternos</p>
        </div>
        
        <div className="flex items-center gap-4 pointer-events-auto">
          {user && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-widest text-white/80 font-bold flex items-center gap-1.5">
                  {isAdmin && <ShieldCheck className="w-3 h-3 text-primary" />}
                  {isAdmin ? "Admin" : "Espectador"}
                </span>
                <span className="text-[8px] text-white/40 uppercase tracking-tighter">{user.email}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-white hover:bg-white/10 rounded-none h-10 w-10">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-white overflow-hidden">
        <div className="relative z-10 max-w-4xl text-center space-y-8 md:space-y-12 scroll-reveal">
          <div className="space-y-4">
            <span className="text-[10px] md:text-xs font-body tracking-[0.5em] uppercase text-primary mb-4 block">Nuestra Antología Personal</span>
            <h2 className="text-5xl sm:text-7xl md:text-9xl font-headline leading-tight md:leading-none text-foreground">
              Cada <br /> <span className="italic sm:pl-12 text-primary">Suspiro.</span>
            </h2>
          </div>
          <p className="max-w-md mx-auto font-body text-sm md:text-base text-muted-foreground leading-loose px-4">
            Un rincón sagrado para nuestras palabras y memorias. 
            {isAdmin ? " Control total activado." : " Disfruta de nuestra historia."}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 space-y-8 md:space-y-12 bg-background/50 backdrop-blur-sm">
        <div className="px-6 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-end max-w-7xl mx-auto scroll-reveal gap-4">
          <div>
            <h3 className="font-headline text-3xl md:text-4xl">Galería Visual</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">Nuestros momentos en píxeles</p>
          </div>
        </div>
        <PhotoCarousel photos={photos?.map(p => p.url) || []} />
      </section>

      <section className="py-20 md:py-32 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
          <div className="md:col-span-5 lg:col-span-4 space-y-8 md:space-y-12 scroll-reveal">
            <h3 className="font-headline text-4xl md:text-5xl leading-tight">Baúl de <br />Cartas</h3>
            <div className="p-8 border border-primary/10 bg-primary/[0.02] space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-headline">{cards?.length || 0}</p>
                  <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Documentos</p>
                </div>
                <div>
                  <p className="text-2xl font-headline text-primary">ACT</p>
                  <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Estado</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-8 scroll-reveal">
            {!cards || cardsLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="font-headline text-xl animate-pulse text-primary">Consultando la nube...</p>
              </div>
            ) : cards.length === 0 ? (
              <div className="h-[400px] border border-dashed border-primary/20 flex flex-col items-center justify-center text-muted-foreground space-y-6 px-10 text-center">
                <p className="font-headline text-2xl">El archivo está listo</p>
                <p className="text-[10px] uppercase tracking-[0.2em]">Accede para empezar a guardar memorias.</p>
              </div>
            ) : (
              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent className="-ml-4 md:-ml-8">
                  {cards.map((card) => (
                    <CarouselItem key={card.id} className="pl-4 md:pl-8 basis-full sm:basis-1/2">
                      <CardPreview 
                        id={card.id}
                        coverImage={card.coverImage}
                        pdfDataUri={card.pdfDataUri}
                        uploadedByUserId={card.uploadedByUserId}
                        onDelete={deleteCard}
                        isAdmin={isAdmin}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex gap-4 mt-12 justify-center md:justify-end">
                  <CarouselPrevious className="relative translate-y-0 left-0 h-12 w-12 rounded-none bg-primary text-white border-none hover:bg-primary/90" />
                  <CarouselNext className="relative translate-y-0 right-0 h-12 w-12 rounded-none bg-primary text-white border-none hover:bg-primary/90" />
                </div>
              </Carousel>
            )}
          </div>
        </div>
      </section>

      <footer className="py-24 md:py-32 border-t border-primary/10 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <div className="flex justify-center">
            <Heart className="w-6 h-6 text-primary/40 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h4 className="font-headline text-4xl md:text-5xl text-foreground tracking-tighter">Carte Morgan.</h4>
            <p className="text-[10px] uppercase tracking-[0.6em] text-primary font-bold">Nuestra Propia antología</p>
          </div>
          <div className="pt-8 flex flex-col items-center gap-6">
            <div className="w-px h-12 bg-primary/20" />
            <p className="max-w-xs mx-auto text-[11px] leading-relaxed text-muted-foreground italic font-body">
              "Porque cada palabra escrita es un suspiro que el tiempo no podrá borrar."
            </p>
            <div className="flex items-center gap-3 px-6 py-2 border border-primary/10 bg-primary/[0.02]">
               <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
               <p className="text-[9px] uppercase tracking-widest text-primary/60 font-bold">
                 Archivo Digital Protegido • {currentYear}
               </p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full botanical-pattern opacity-[0.03] pointer-events-none" />
      </footer>

      {!user ? <AuthModal /> : isAdmin ? <UploadSection onPhotoUpload={addPhoto} onCardUpload={addCard} /> : <AuthModal />}
    </div>
  );
}
