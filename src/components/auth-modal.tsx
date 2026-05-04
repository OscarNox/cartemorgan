
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Mail, Heart } from 'lucide-react';

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Bienvenido", description: "Has accedido al modo edición." });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Cuenta Creada", description: "Ahora puedes archivar recuerdos." });
      }
      setIsOpen(false);
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Error de Acceso", 
        description: "Credenciales inválidas o error de red." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 rounded-none text-[10px] uppercase tracking-widest px-6 h-9">
          Acceder
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] bg-white border-none p-0 overflow-hidden rounded-none shadow-2xl">
        <div className="bg-primary/[0.03] p-8 border-b border-primary/10 text-center">
          <Heart className="w-6 h-6 text-primary fill-primary mx-auto mb-4" />
          <DialogHeader>
            <DialogTitle className="font-headline text-3xl text-foreground">
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </DialogTitle>
            <p className="text-[10px] font-body tracking-[0.3em] uppercase text-muted-foreground mt-2">Acceso al Archivo Privado</p>
          </DialogHeader>
        </div>

        <form onSubmit={handleAuth} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-primary/40" />
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-none border-primary/10 focus-visible:ring-primary/20" 
                  placeholder="tu@email.com"
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
            {loading ? 'Procesando...' : (isLogin ? 'Entrar' : 'Crear Cuenta')}
          </Button>

          <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-primary font-bold hover:underline"
            >
              {isLogin ? 'Regístrate' : 'Inicia Sesión'}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
