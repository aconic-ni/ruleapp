"use client"; // Convert to client component

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFunds, getRecentWinners, Funds, Winner } from '@/lib/data';
import { Ticket, DollarSign, Trophy, Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';

export default function Home() {
  const [funds, setFunds] = useState<Funds | null>(null);
  const [winners, setWinners] = useState<Winner[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fundsData, winnersData] = await Promise.all([
          getFunds(),
          getRecentWinners()
        ]);
        setFunds(fundsData);
        setWinners(winnersData);
      } catch (error) {
        console.error("Failed to fetch data for home page", error);
      }
    }
    fetchData();
  }, []);

  const renderLoading = () => (
    <div className="flex justify-center items-center h-24">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">RuleApp</h1>
          <p className="text-muted-foreground mt-2 text-lg">Administra tus tómbolas y sigue los resultados.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <Card className="shadow-lg col-span-full lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><DollarSign/> Estado de Fondos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {funds === null ? renderLoading() : (
                <>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Total Recaudado</span>
                    <span className="font-bold text-lg">${funds.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Total Retirado</span>
                    <span className="font-bold text-lg text-destructive">${funds.withdrawn.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-primary">Saldo Actual</span>
                    <span className="font-bold text-2xl text-primary">${(funds.total - funds.withdrawn).toLocaleString()}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-lg col-span-full md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Trophy /> Ganadores Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {winners === null ? renderLoading() : (
                 winners.length > 0 ? (
                  <ul className="space-y-3">
                    {winners.map((winner, index) => (
                      <li key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                        <span className="font-semibold text-accent">{winner.name}</span>
                        <span className="text-xs text-muted-foreground">{winner.date}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Aún no hay ganadores. ¡La próxima tómbola está por comenzar!</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          <div className="md:col-span-2 lg:col-span-3 bg-card border border-dashed rounded-lg p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <Ticket className="h-16 w-16 text-primary/50 mb-4" />
            <h2 className="text-2xl font-headline text-primary">Próximamente</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              El área de la ruleta ahora es exclusiva para administradores. Ingresa al panel de administración para iniciar una nueva tómbola.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
