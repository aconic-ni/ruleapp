"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Footer from '@/components/Footer';

const ADMIN_PASSWORD = "password123"; // In a real app, this would be handled securely on the server.

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        try {
          sessionStorage.setItem('isAdminAuthenticated', 'true');
          router.push('/admin/dashboard');
        } catch (error) {
            toast({
                title: "Error de navegador",
                description: "El almacenamiento de sesión no está disponible.",
                variant: "destructive",
            });
        }
      } else {
        toast({
          title: "Error de Autenticación",
          description: "La contraseña es incorrecta.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

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
              <CardDescription>Ingresa la contraseña para gestionar la tómbola.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
