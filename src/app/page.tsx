import Header from '@/components/Header';
import Roulette from '@/components/Roulette';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getParticipants, getFunds, getRecentWinners } from '@/lib/data';

export default async function Home() {
  const participants = await getParticipants();
  const funds = await getFunds();
  const winners = await getRecentWinners();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">Tómbola Mágica</h1>
          <p className="text-muted-foreground mt-2 text-lg">Gira la ruleta y prueba tu suerte.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 flex items-center justify-center py-8">
            <Roulette participants={participants} />
          </div>
          
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Fondos Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-accent">${(funds.total - funds.withdrawn).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Total recaudado: ${funds.total.toLocaleString()}</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Ganadores Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {winners.map((winner, index) => (
                    <li key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                      <span className="font-semibold text-accent">{winner.name}</span>
                      <span className="text-xs text-muted-foreground">{winner.date}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Participantes</CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="text-2xl font-bold text-accent">{participants.length} boletos</p>
                 <p className="text-sm text-muted-foreground mt-1">en la tómbola actual</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
