
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Landmark, Trophy, LogOut, Ticket } from 'lucide-react';
import ParticipantManager from './ParticipantManager';
import FundsManager from './FundsManager';
import WinnerHistory from './WinnerHistory';
import Roulette from '../Roulette';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import type { Participant, Funds, Winner, Withdrawal } from '@/lib/data';
import { saveRaffle, addWithdrawal } from '@/lib/actions';
import Footer from "../Footer";

interface AdminDashboardProps {
    initialParticipants: Participant[]; // This will likely be empty now
    initialFunds: Funds;
    initialWinners: Winner[];
    initialWithdrawals: Withdrawal[];
}

export default function AdminDashboard({ initialParticipants, initialFunds, initialWinners, initialWithdrawals }: AdminDashboardProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Local state for the current, un-saved raffle
    const [participants, setParticipants] = useState<Participant[]>(initialParticipants);

    // These props will be updated by router.refresh()
    const funds = initialFunds;
    const winners = initialWinners;
    const withdrawals = initialWithdrawals;

    useEffect(() => {
        try {
            const isAdmin = sessionStorage.getItem('isAdminAuthenticated') === 'true';
            if (!isAdmin) {
                router.replace('/admin');
            } else {
                setIsAuthenticated(true);
            }
        } catch (error) {
            router.replace('/admin');
        }
    }, [router]);

    const handleLogout = () => {
        try {
            sessionStorage.removeItem('isAdminAuthenticated');
        } catch (error) {
            // Silently fail
        }
        router.push('/');
    };
    
    const handleAddParticipant = (name: string, ticketValue: number, number: number) => {
        // This only updates local state. DB is updated on raffle completion.
        setParticipants(prev => [...prev, { name, ticketValue, number }]);
    };

    const handleAddWithdrawal = async (withdrawalRequest: Omit<Withdrawal, 'id' | 'date'>) => {
        try {
            await addWithdrawal(withdrawalRequest);
            toast({ title: "Éxito", description: "Retiro registrado y fondos actualizados." });
            router.refresh(); // Re-fetches server-side data
        } catch (error) {
            toast({ title: "Error", description: "No se pudo registrar el retiro.", variant: "destructive" });
        }
    };
    
    const handleSpinEnd = async (winnerName: string) => {
        try {
            await saveRaffle(winnerName, participants);
            
            toast({
                title: "¡Tómbola Finalizada y Guardada!",
                description: `El ganador es ${winnerName}. Se ha iniciado una nueva tómbola.`,
            });
            
            setParticipants([]); // Clear local participants for the next raffle
            router.refresh(); // Re-fetches server-side data (funds, winners)
            
        } catch (error) {
             toast({
                title: "Error de Guardado",
                description: "No se pudo guardar la tómbola en la base de datos.",
                variant: "destructive"
            });
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p className="text-muted-foreground">Verificando acceso...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/30">
            <div className='flex-1'>
                <header className="bg-card shadow-sm">
                    <div className="container mx-auto p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3 text-xl font-headline font-bold text-primary">
                            <Ticket className="h-6 w-6" />
                            RuleApp
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Cerrar Sesión
                        </Button>
                    </div>
                </header>
                
                <main className="container mx-auto py-8">
                    <Tabs defaultValue="participants" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                            <TabsTrigger value="participants"><Users className="mr-2 h-4 w-4" />Participantes</TabsTrigger>
                            <TabsTrigger value="roulette"><Ticket className="mr-2 h-4 w-4" />Ruleta</TabsTrigger>
                            <TabsTrigger value="funds"><Landmark className="mr-2 h-4 w-4" />Fondos</TabsTrigger>
                            <TabsTrigger value="history"><Trophy className="mr-2 h-4 w-4" />Historial</TabsTrigger>
                        </TabsList>
                        <TabsContent value="participants" className="mt-6">
                            <ParticipantManager participants={participants} onAddParticipant={handleAddParticipant} />
                        </TabsContent>
                        <TabsContent value="roulette" className="mt-6">
                            <Roulette participants={participants} onSpinEnd={handleSpinEnd} />
                        </TabsContent>
                        <TabsContent value="funds" className="mt-6">
                            <FundsManager funds={funds} withdrawals={withdrawals} onAddWithdrawal={handleAddWithdrawal} />
                        </TabsContent>
                        <TabsContent value="history" className="mt-6">
                            <WinnerHistory winners={winners} />
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
            <Footer />
            <Toaster />
        </div>
    );
}
