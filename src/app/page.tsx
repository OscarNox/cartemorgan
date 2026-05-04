
"use client";

import React, { useEffect, useState } from 'react';
import { PhotoCarousel } from '@/components/photo-carousel';
import { CardPreview } from '@/components/card-preview';
import { UploadSection } from '@/components/upload-section';
import { AuthModal } from '@/components/auth-modal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useFirestore, useUser, useAuth } from '@/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

interface CardData {
  id: string;
  coverImage: string;
  pdfDataUri: string;
  uploadedByUserId: string;
  createdAt: any;
}

interface PhotoData {
  id: string;
  url: string;
  uploadedByUserId: string;
  createdAt: any;
}

export default function CarteBlanchePage() {
  const { toast } = useToast();
  const db = useFirestore();
  const auth = useAuth();
  const { user } = useUser();
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  // Definimos si el usuario actual es el administrador autorizado
  const isAdmin = user?.email === 'aidaluxmorgan@gmail.com';

  useEffect(() => {
    if (!db) return;

    const qPhotos = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const unsubscribePhotos = onSnapshot(qPhotos, (snapshot) => {
      const fetchedPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PhotoData[];
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
  }, [db]);

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
      toast({
        title: "Imagen Añadida",
        description: "Tu fotografía ha sido guardada en la galería eterna."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No tienes permisos para subir fotos."
      });
    }
  };
  
  const addCard = async (cover: string, pdf: string) => {
    if (!isAdmin || !db) return;
    try {
      if (pdf.length > 850000) {
        toast({
          variant: "destructive",
          title: "Documento muy pesado",
          description: "El PDF supera el límite de guardado."
        });
        return;
      }

      await addDoc(collection(db, 'cards'), {
        coverImage: cover,
        pdfDataUri: pdf,
        uploadedByUserId: user?.uid,
        createdAt: serverTimestamp()
      });
      toast({
        title: "Carta Archivada",
        description: "Tu nuevo suspiro ha sido guardado permanentemente."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No tienes permisos para subir cartas."
      });
    }
  };

  const deleteCard = async (id: string) => {
    if (!isAdmin || !db) return;
    try {
      await deleteDoc(doc(db, 'cards', id));
      toast({
        title: "Registro Removido",
        description: "La carta ha sido eliminada del archivo."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Solo el administrador puede eliminar este registro."
      });
    }
  };

  const handleSignOut = () => {
    signOut(auth);
    toast({
      title: "Sesión Cerrada",
      description: "Ahora estás en modo espectador."
    });
  };

  return (
    <div className="min-h-screen botanical-pattern relative overflow-hidden selection:bg-primary/20">
      
      <nav className="fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between items-start z-40 mix-blend-difference">
        <div className="pointer-events-auto">
          <h1 className="font-headline text-2xl md:text-3xl text-white tracking-tighter">Carte Morgan.</h1>
          <p className="font-body text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-white/60">Archivo de Momentos Eternos</p>
        </div>
        
        <div className="flex items-center gap-4 pointer-events-auto">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:block text-[9px] uppercase tracking-widest text-white/60">
                {isAdmin ? "Administrador: " : "Espectador: "} {user.email?.split('@')[0]}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
                className="text-white hover:bg-white/10 rounded-none"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <AuthModal />
          )}
          <div className="vertical-label hidden sm:block ml-4">
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">Memorias Sincronizadas</span>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full botanical-pattern" />
        </div>
        
        <div className="relative z-10 max-w-4xl text-center space-y-8 md:space-y-12 scroll-reveal">
          <div className="space-y-4">
            <span className="text-[10px] md:text-xs font-body tracking-[0.5em] uppercase text-primary mb-4 block">Nuestra Antología Personal</span>
            <h2 className="text-5xl sm:text-7xl md:text-9xl font-headline leading-tight md:leading-none text-foreground">
              Cada <br /> 
              <span className="italic sm:pl-12 text-primary">Suspiro.</span>
            </h2>
          </div>
          <div className="flex justify-center">
             <div className="w-px bg-primary/20 h-16 md:h-24" />
          </div>
          <p className="max-w-md mx-auto font-body text-sm md:text-base text-muted-foreground leading-loose px-4">
            Este es nuestro rincón sagrado. Aquí guardamos cada carta y fotografía que define nuestra historia. 
            {isAdmin ? " Estás en modo administrador." : " Estás en modo espectador."}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 space-y-8 md:space-y-12 bg-background/50 backdrop-blur-sm">
        <div className="px-6 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-end max-w-7xl mx-auto scroll-reveal gap-4">
          <div>
            <h3 className="font-headline text-3xl md:text-4xl">Galería Visual</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">Nuestros momentos en píxeles</p>
          </div>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Persistencia Activada</span>
        </div>
        <PhotoCarousel photos={photos.map(p => p.url)} />
      </section>

      <section className="py-20 md:py-32 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
          
          <div className="md:col-span-5 lg:col-span-4 space-y-8 md:space-y-12 scroll-reveal">
            <div className="space-y-4">
              <h3 className="font-headline text-4xl md:text-5xl leading-tight">Baúl de <br />Cartas</h3>
              <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                Cada carta subida es analizada por nuestra IA para extraer la esencia de lo que sentimos. 
                Los datos se sincronizan automáticamente en todos tus dispositivos.
              </p>
            </div>
            
            <div className="p-8 border border-primary/10 bg-primary/[0.02] space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Estado de la Base de Datos</p>
                <p className="text-[11px] italic text-muted-foreground">Conectado a Firebase Cloud Firestore.</p>
              </div>
              <Separator className="bg-primary/10" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-headline">{cards.length}</p>
                  <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Documentos</p>
                </div>
                <div>
                  <p className="text-2xl font-headline text-primary">RT</p>
                  <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Sincronización</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-8 scroll-reveal">
            {loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="font-headline text-xl animate-pulse text-primary">Consultando la nube...</p>
              </div>
            ) : cards.length === 0 ? (
              <div className="h-[400px] border border-dashed border-primary/20 flex flex-col items-center justify-center text-muted-foreground space-y-6 px-10 text-center">
                <p className="font-headline text-2xl">El archivo está listo</p>
                <p className="text-[10px] uppercase tracking-[0.2em] leading-loose">
                  Tu historia comienza con la primera carga. <br />
                  {isAdmin ? "Usa el botón flotante para añadir un nuevo recuerdo." : "Inicia sesión como administrador para empezar a archivar."}
                </p>
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

      <footer className="py-20 bg-foreground text-white/80">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <h4 className="font-headline text-3xl text-white">Carte Morgan.</h4>
            <p className="text-xs leading-loose font-light max-w-xs">
              Un refugio digital potenciado por Firebase y Gemini AI. Guardado para siempre en la nube de Google.
            </p>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Gestión de Datos</p>
            <ul className="space-y-3 text-xs">
              <li className="hover:text-primary transition-colors cursor-pointer">Seguridad Firestore</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Persistencia de Google</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Privacidad</li>
            </ul>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Estado del Sistema</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs italic">Base de datos activa.</p>
            </div>
          </div>
        </div>
      </footer>

      {isAdmin && <UploadSection onPhotoUpload={addPhoto} onCardUpload={addCard} />}
    </div>
  );
}
