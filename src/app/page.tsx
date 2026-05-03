
"use client";

import React, { useEffect, useState } from 'react';
import { PhotoCarousel } from '@/components/photo-carousel';
import { CardPreview } from '@/components/card-preview';
import { UploadSection } from '@/components/upload-section';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
    // Sincronización de Fotos en tiempo real
    const qPhotos = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const unsubscribePhotos = onSnapshot(qPhotos, (snapshot) => {
      const fetchedPhotos = snapshot.docs.map(doc => (doc.data() as PhotoData).url);
      
      // Si no hay fotos en la DB, mostramos las de marcador de posición
      if (fetchedPhotos.length === 0) {
        setPhotos([
          PlaceHolderImages.find(i => i.id === 'gallery-1')?.imageUrl || '',
          PlaceHolderImages.find(i => i.id === 'gallery-2')?.imageUrl || '',
          PlaceHolderImages.find(i => i.id === 'gallery-3')?.imageUrl || '',
          PlaceHolderImages.find(i => i.id === 'gallery-4')?.imageUrl || '',
        ]);
      } else {
        setPhotos(fetchedPhotos);
      }
    });

    // Sincronización de Cartas en tiempo real
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
        description: "No se pudo guardar la imagen en la base de datos."
      });
    }
  };
  
  const addCard = async (cover: string, pdf: string) => {
    try {
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
        description: "El archivo es demasiado grande o hubo un problema de conexión."
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
    <div className="min-h-screen botanical-pattern relative overflow-hidden">
      
      <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-start z-40 mix-blend-difference pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="font-headline text-3xl text-white tracking-tighter">Carte Morgan.</h1>
          <p className="font-body text-[10px] uppercase tracking-[0.4em] text-white/60">2024 to end.</p>
        </div>
        <div className="vertical-label pointer-events-auto">
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">Est. Cotuí / Rep. Dom.</span>
        </div>
      </nav>

      <section className="relative h-screen flex items-center justify-center p-8 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full botanical-pattern" />
        </div>
        
        <div className="relative z-10 max-w-4xl text-center space-y-12 scroll-reveal">
          <div className="space-y-4">
            <span className="text-xs font-body tracking-[0.5em] uppercase text-primary mb-4 block">Nuestra Propia Antologia</span>
            <h2 className="text-7xl md:text-9xl font-headline leading-none text-foreground">
              Nuestros <br /> 
              <span className="italic pl-12 text-primary">Momentos.</span>
            </h2>
          </div>
          <div className="flex justify-center">
             <div className="w-1 px-4 border-l border-primary/20 h-24" />
          </div>
          <p className="max-w-md mx-auto font-body text-muted-foreground leading-loose">
            Mientras nuestras almas respiren, la mia siempre encontrara el camino para llegar 
            ti, incluso en los dias donde los ojos no puedan ver, siempre sabre donde esta el camino. 
            Siempre que quieras sentir lo que hay dentro de mi corazon, tendras esta llave 
            para que puedas entrar cuando quieras.
          </p>
        </div>

        <div className="absolute bottom-20 right-20 w-64 h-96 bg-accent/10 -z-0 translate-x-12 translate-y-12" />
      </section>

      <section className="py-24 space-y-12">
        <div className="px-8 flex justify-between items-end max-w-7xl mx-auto scroll-reveal">
          <h3 className="font-headline text-4xl">Nuestras Historias</h3>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold pb-2 text-primary">La esencia de cada dia</span>
        </div>
        <PhotoCarousel photos={photos} />
      </section>

      <section className="py-32 bg-white/40 backdrop-blur-sm min-h-screen">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-12">
          
          <div className="md:col-span-4 space-y-12 scroll-reveal">
            <div className="space-y-4">
              <h3 className="font-headline text-5xl leading-tight">Baúl de <br />Suspiros</h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                Cada sentimiento que tengamos, cada pensamiento, cada suspiro, es importante,
                 hay que darle la importancia necesaria a lo que te importa, por eso quiero que siempre
                 que pensemos en cada uno, sea importante.
              </p>
            </div>
            
            <div className="p-8 border-l border-primary/20 bg-background/50 space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Cada uno de nuestros suspiros.</p>
                <p className="text-xs italic text-muted-foreground">Sentimientos, pensamientos, deseos.</p>
              </div>
              <Separator className="bg-primary/10" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-headline">{cards.length}</p>
                  <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Cartas Totales</p>
                </div>
                <div>
                  <p className="text-2xl font-headline text-primary">01</p>
                  <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Publicaciones</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 scroll-reveal">
            {loading ? (
              <div className="h-[500px] flex items-center justify-center">
                <p className="font-headline text-xl animate-pulse text-primary">Abriendo el baúl...</p>
              </div>
            ) : cards.length === 0 ? (
              <div className="h-[500px] border-2 border-dashed border-primary/10 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                <p className="font-headline text-2xl">Su archivo está vacío.</p>
                <p className="text-xs uppercase tracking-[0.2em]">Cree su primera carta debajo</p>
              </div>
            ) : (
              <Carousel 
                opts={{ align: "start", loop: cards.length > 1 }}
                className="w-full"
              >
                <CarouselContent className="-ml-8">
                  {cards.map((card) => (
                    <CarouselItem key={card.id} className="pl-8 md:basis-1/2 lg:basis-1/2">
                      <CardPreview 
                        id={card.id}
                        coverImage={card.coverImage}
                        pdfDataUri={card.pdfDataUri}
                        onDelete={deleteCard}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex gap-4 mt-12 justify-end">
                  <CarouselPrevious className="relative translate-y-0 left-0 h-12 w-12 rounded-none bg-primary text-white border-none hover:bg-primary/80" />
                  <CarouselNext className="relative translate-y-0 right-0 h-12 w-12 rounded-none bg-primary text-white border-none hover:bg-primary/80" />
                </div>
              </Carousel>
            )}
          </div>
        </div>
      </section>

      <footer className="py-24 bg-foreground text-white/80">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <h4 className="font-headline text-3xl text-white">Carte Morgan.</h4>
            <p className="text-xs leading-loose font-light">
              Siempre que queramos dar un vistaso hacia atras, aqui estare, siempre...
            </p>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Conversaciones necesarias.</p>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-primary transition-colors cursor-pointer">Hacer las cosas bien.</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Esto es lo que realmente deseas?.</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Que es lo que amas.</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Hasta cuando seguiras aqui?.</li>
            </ul>
          </div>
          <div className="space-y-6 text-right md:text-left">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Contacto</p>
            <p className="text-xs italic">jerezsantosjoseoscar@gmail.com</p>
            <div className="flex gap-4 pt-4 md:justify-start justify-end">
              <div className="w-8 h-px bg-white/20" />
              <div className="w-8 h-px bg-primary" />
              <div className="w-8 h-px bg-white/20" />
            </div>
          </div>
        </div>
      </footer>

      <UploadSection onPhotoUpload={addPhoto} onCardUpload={addCard} />
    </div>
  );
}
