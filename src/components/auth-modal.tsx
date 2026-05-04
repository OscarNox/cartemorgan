
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, Heart } from 'lucide-react';

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Normalizamos el identificador: si no tiene @, le añadimos @gmail.com para Firebase Auth
      let loginEmail = identifier.toLowerCase().trim();
      if (!loginEmail.includes('@')) {
        loginEmail = `${loginEmail}@gmail.com`;
      }
      
      await signInWithEmailAndPassword(auth, loginEmail, password);
      
      if (loginEmail === 'aidaluxmorgan@gmail.com') {
        toast({ title: "Bienvenida, Aida", description: "Control total activado." });
      } else {
        toast({ title: "Sesión iniciada", description: "Has accedido como espectador." });
      }
      setIsOpen(false);
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Error de Acceso", 
        description: "Usuario o contraseña incorrectos." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-50 h-14 w-14 md:h-16 md:w-16 rounded-full shadow-2xl bg-white border-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4"
        >
          <Lock className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] bg-white border-none p-0 overflow-hidden rounded-none shadow-2xl">
        <div className="bg-primary/[0.03] p-8 border-b border-primary/10 text-center">
          <Heart className="w-6 h-6 text-primary fill-primary mx-auto mb-4" />
          <DialogHeader>
            <DialogTitle className="font-headline text-3xl text-foreground">
              Identificación
            </DialogTitle>
            <p className="text-[10px] font-body tracking-[0.3em] uppercase text-muted-foreground mt-2">Acceso al Archivo Privado</p>
          </DialogHeader>
        </div>

        <form onSubmit={handleAuth} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Usuario / Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-primary/40" />
                <Input 
                  type="text" 
                  value={identifier} 
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10 h-12 rounded-none border-primary/10 focus-visible:ring-primary/20" 
                  placeholder="aidaluxmorgan"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-primary/40" />
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-none border-primary/10 focus-visible:ring-primary/20" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 rounded-none font-bold uppercase tracking-widest text-xs" disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar al Sistema'}
          </Button>

          <p className="text-center text-[9px] uppercase tracking-widest text-muted-foreground leading-relaxed">
            Ingresa 'aidaluxmorgan' para administrar el archivo.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
