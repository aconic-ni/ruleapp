"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Footer from '@/components/Footer';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/admin/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!auth) {
      toast({
          title: "Error de Configuración",
          description: "El servicio de autenticación no está disponible.",
          variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      let description = "Ocurrió un error inesperado.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = "El correo electrónico o la contraseña son incorrectos.";
      }
      toast({
        title: "Error de Autenticación",
        description: description,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  if (loading || user) {
      return (
          <div className="flex min-h-screen items-center justify-center bg-background">
              <p className="text-muted-foreground">Cargando...</p>
          </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-sm shadow-2xl">
          <form onSubmit={handleLogin}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-4">
                <KeyRound className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline text-2xl">Acceso de Administrador</CardTitle>
              <CardDescription>Ingresa tus credenciales para gestionar la tómbola.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="********"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
