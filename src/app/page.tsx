
"use client";

import React, { useEffect, useState } from 'react';
import { PhotoCarousel } from '@/components/photo-carousel';
import { CardPreview } from '@/components/card-preview';
import { UploadSection } from '@/components/upload-section';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface CardData {
  id: string;
  coverImage: string;
  pdfDataUri: string;
  createdAt: any;
}

interface PhotoData {
  id: string;
  url: string;
  createdAt: any;
}

export default function CarteBlanchePage() {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qPhotos = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const unsubscribePhotos = onSnapshot(qPhotos, (snapshot) => {
      const fetchedPhotos = snapshot.docs.map(doc => (doc.data() as PhotoData).url);
      setPhotos(fetchedPhotos);
    });

    const qCards = query(collection(db, 'cards'), orderBy('createdAt', 'desc'));
    const unsubscribeCards = onSnapshot(qCards, (snapshot) => {
      const fetchedCards = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CardData[];
      setCards(fetchedCards);
      setLoading(false);
    });

    return () => {
      unsubscribePhotos();
      unsubscribeCards();
    };
  }, []);

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
    try {
      await addDoc(collection(db, 'photos'), {
        url,
        createdAt: new Date()
      });
      toast({
        title: "Imagen Añadida",
        description: "Tu fotografía ha sido guardada en la galería."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la imagen. Verifica tu conexión de Firebase."
      });
    }
  };
  
  const addCard = async (cover: string, pdf: string) => {
    try {
      if (pdf.length > 800000) {
        toast({
          variant: "destructive",
          title: "Archivo muy grande",
          description: "El PDF supera el límite de Firestore. Intenta con un archivo más pequeño."
        });
        return;
      }
      await addDoc(collection(db, 'cards'), {
        coverImage: cover,
        pdfDataUri: pdf,
        createdAt: new Date()
      });
      toast({
        title: "Carta Creada",
        description: "El nuevo suspiro ha sido archivado correctamente."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de Guardado",
        description: "Hubo un problema al subir la carta a la base de datos."
      });
    }
  };

  const deleteCard = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'cards', id));
      toast({
        title: "Carta Eliminada",
        description: "El registro ha sido removido del archivo."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la carta."
      });
    }
  };

  return (
    <div className="min-h-screen botanical-pattern relative overflow-hidden selection:bg-primary/20">
      
      {/* Navegación Responsive */}
      <nav className="fixed top-0 left-0 w-full p-4 md:p-8 flex justify-between items-start z-40 mix-blend-difference pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="font-headline text-2xl md:text-3xl text-white tracking-tighter">Carte Morgan.</h1>
          <p className="font-body text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-white/60">2024 to end.</p>
        </div>
        <div className="vertical-label pointer-events-auto hidden sm:block">
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">Est. Cotuí / Rep. Dom.</span>
        </div>
      </nav>

      {/* Hero Section Responsive */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 md:p-8 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full botanical-pattern" />
        </div>
        
        <div className="relative z-10 max-w-4xl text-center space-y-8 md:space-y-12 scroll-reveal">
          <div className="space-y-4">
            <span className="text-[10px] md:text-xs font-body tracking-[0.5em] uppercase text-primary mb-4 block">Nuestra Propia Antología</span>
            <h2 className="text-5xl sm:text-7xl md:text-9xl font-headline leading-tight md:leading-none text-foreground">
              Nuestros <br /> 
              <span className="italic sm:pl-12 text-primary">Momentos.</span>
            </h2>
          </div>
          <div className="flex justify-center">
             <div className="w-px bg-primary/20 h-16 md:h-24" />
          </div>
          <p className="max-w-md mx-auto font-body text-sm md:text-base text-muted-foreground leading-loose px-4">
            Mientras nuestras almas respiren, la mía siempre encontrará el camino para llegar 
            a ti. Cada vez que quieras sentir lo que hay dentro de mi corazón, tendrás esta llave 
            para entrar cuando desees.
          </p>
        </div>

        <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-32 h-48 md:w-64 md:h-96 bg-accent/10 -z-0 translate-x-12 translate-y-12" />
      </section>

      {/* Galería Visual */}
      <section className="py-16 md:py-24 space-y-8 md:space-y-12">
        <div className="px-6 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-end max-w-7xl mx-auto scroll-reveal gap-4">
          <h3 className="font-headline text-3xl md:text-4xl">Nuestras Historias</h3>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Nuestra esencia</span>
        </div>
        <PhotoCarousel photos={photos} />
      </section>

      {/* Baúl de Suspiros Responsive Grid */}
      <section className="py-20 md:py-32 bg-white/40 backdrop-blur-sm min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
          
          <div className="md:col-span-5 lg:col-span-4 space-y-8 md:space-y-12 scroll-reveal">
            <div className="space-y-4">
              <h3 className="font-headline text-4xl md:text-5xl leading-tight">Baúl de <br className="hidden md:block" />Suspiros</h3>
              <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                Cada sentimiento, cada pensamiento y cada suspiro que tenemos es parte de lo que sentimos y amamos. 
                Es importante dar valor a lo que amamos, por eso para que 
                nuestra historia sea eterna tenemos que apreciarla.
              </p>
            </div>
            
            <div className="p-6 md:p-8 border-l border-primary/20 bg-background/50 space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Nuestros Suspiros</p>
                <p className="text-[11px] italic text-muted-foreground">Sentimientos, pensamientos y deseos guardados.</p>
              </div>
              <Separator className="bg-primary/10" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl md:text-2xl font-headline">{cards.length}</p>
                  <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Cartas</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-headline text-primary">∞</p>
                  <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Infinitas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-8 scroll-reveal">
            {loading ? (
              <div className="h-[400px] md:h-[500px] flex items-center justify-center">
                <p className="font-headline text-lg md:text-xl animate-pulse text-primary">Abriendo el baúl...</p>
              </div>
            ) : cards.length === 0 ? (
              <div className="h-[400px] md:h-[500px] border border-dashed border-primary/20 flex flex-col items-center justify-center text-muted-foreground space-y-4 px-6 text-center">
                <p className="font-headline text-xl md:text-2xl">El archivo está esperando...</p>
                <p className="text-[10px] uppercase tracking-[0.2em]">Crea tu primera carta usando el botón (+) abajo</p>
              </div>
            ) : (
              <Carousel 
                opts={{ align: "start", loop: cards.length > 1 }}
                className="w-full"
              >
                <CarouselContent className="-ml-4 md:-ml-8">
                  {cards.map((card) => (
                    <CarouselItem key={card.id} className="pl-4 md:pl-8 basis-full sm:basis-1/2">
                      <CardPreview 
                        id={card.id}
                        coverImage={card.coverImage}
                        pdfDataUri={card.pdfDataUri}
                        onDelete={deleteCard}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex gap-2 mt-8 md:mt-12 justify-center md:justify-end">
                  <CarouselPrevious className="relative translate-y-0 left-0 h-10 w-10 md:h-12 md:w-12 rounded-none bg-primary text-white border-none hover:bg-primary/80" />
                  <CarouselNext className="relative translate-y-0 right-0 h-10 w-10 md:h-12 md:w-12 rounded-none bg-primary text-white border-none hover:bg-primary/80" />
                </div>
              </Carousel>
            )}
          </div>
        </div>
      </section>

      {/* Footer Responsive */}
      <footer className="py-16 md:py-24 bg-foreground text-white/80">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-16">
          <div className="space-y-6">
            <h4 className="font-headline text-2xl md:text-3xl text-white">Carte Morgan.</h4>
            <p className="text-[11px] md:text-xs leading-loose font-light max-w-xs">
              Siempre que queramos dar un vistazo hacia atrás, aquí estaré, siempre...
            </p>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Conversaciones necesarias.</p>
            <ul className="space-y-3 text-[11px] md:text-xs">
            <li className="hover:text-primary transition-colors cursor-pointer">Querer hacer las cosas bien.</li>
              <li className="hover:text-primary transition-colors cursor-pointer">¿Que es lo que amas?.</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Lo que buscamos.</li>
              <li className="hover:text-primary transition-colors cursor-pointer">¿Esto es lo que siempre quise?</li>
            </ul>
          </div>
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Siempre tuyo</p>
            <p className="text-xs italic text-center md:text-left">Estare contigo cuando necesites sentir mi corazón.</p>
            <div className="flex gap-4 pt-4">
              <div className="w-8 h-px bg-white/20" />
              <div className="w-8 h-px bg-primary" />
              <div className="w-8 h-px bg-white/20" />
            </div>
          </div>
        </div>
      </footer>

      {/* Botón flotante responsive */}
      <UploadSection onPhotoUpload={addPhoto} onCardUpload={addCard} />
    </div>
  );
}
