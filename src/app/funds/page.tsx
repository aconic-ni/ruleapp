"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { getFunds, Funds } from '@/lib/data';
import { DollarSign, Loader2 } from 'lucide-react';
import PrintButton from '@/components/PrintButton';
import Footer from '@/components/Footer';

export default function FundsPage() {
  const [funds, setFunds] = useState<Funds | null>(null);

  useEffect(() => {
    getFunds().then(setFunds);
  }, []);

  if (!funds) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="ml-4 text-muted-foreground">Cargando fondos...</p>
      </div>
    );
  }

  const balance = funds.total - funds.withdrawn;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              Estado de Fondos
            </CardTitle>
            <CardDescription>Resumen detallado de los movimientos financieros.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-muted-foreground">Ingresos Totales (Venta de Boletos)</span>
              <span className="font-bold text-2xl text-green-600">${funds.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-muted-foreground">Retiros Totales</span>
              <span className="font-bold text-2xl text-destructive">${funds.withdrawn.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center bg-primary/10 p-4 rounded-lg">
              <span className="font-semibold text-primary">Balance Actual Disponible</span>
              <span className="font-bold text-3xl text-primary">${balance.toLocaleString()}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <PrintButton />
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
