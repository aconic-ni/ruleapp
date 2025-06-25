
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Landmark, Trophy, LogOut, Ticket, Loader2 } from 'lucide-react';
import ParticipantManager from './ParticipantManager';
import FundsManager from './FundsManager';
import WinnerHistory from './WinnerHistory';
import Roulette from '../Roulette';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import type { Funds, Winner, Withdrawal, Raffle } from '@/lib/data';
import { setRaffleWinner, addWithdrawal } from '@/lib/actions';
import { getRaffleById } from '@/lib/data';
import Footer from "../Footer";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


interface AdminDashboardProps {
    initialFunds: Funds;
    initialWinners: Winner[];
    initialWithdrawals: Withdrawal[];
}

export default function AdminDashboard({ initialFunds, initialWinners, initialWithdrawals }: AdminDashboardProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { user, loading } = useAuth();
    
    // State for Roulette Tab
    const [raffleIdInput, setRaffleIdInput] = useState('');
    const [loadedRaffle, setLoadedRaffle] = useState<Raffle | null>(null);
    const [isLoadingRaffle, setIsLoadingRaffle] = useState(false);
    const [raffleError, setRaffleError] = useState<string | null>(null);
    
    const funds = initialFunds;
    const winners = initialWinners;
    const withdrawals = initialWithdrawals;

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/admin');
        }
    }, [user, loading, router]);
    
    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            toast({
                title: "Error al cerrar sesión",
                description: "No se pudo cerrar la sesión. Por favor, inténtalo de nuevo.",
                variant: "destructive",
            });
        }
    };
    
    const handleAddWithdrawal = async (withdrawalRequest: Omit<Withdrawal, 'id' | 'date'>) => {
        try {
            await addWithdrawal(withdrawalRequest);
            toast({ title: "Éxito", description: "Retiro registrado y fondos actualizados." });
            router.refresh(); 
        } catch (error) {
            toast({ title: "Error", description: "No se pudo registrar el retiro.", variant: "destructive" });
        }
    };
    
    const handleLoadRaffle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!raffleIdInput) return;
        
        setIsLoadingRaffle(true);
        setRaffleError(null);
        setLoadedRaffle(null);
        
        try {
            const raffle = await getRaffleById(raffleIdInput);
            if (!raffle) {
                setRaffleError("No se encontró ninguna ruleta con ese ID.");
            } else if (raffle.status === 'completed' || raffle.winner) {
                setRaffleError("Esta ruleta ya fue jugada. El ganador fue " + raffle.winner + ".");
            } else {
                setLoadedRaffle(raffle);
            }
        } catch (error) {
            setRaffleError("Ocurrió un error al cargar la ruleta.");
            console.error(error);
        } finally {
            setIsLoadingRaffle(false);
        }
    };

    const handleSetWinner = async (winnerName: string) => {
        if (!loadedRaffle) return;

        try {
            await setRaffleWinner(loadedRaffle.id, winnerName);
            toast({
                title: "¡Tómbola Finalizada y Guardada!",
                description: `El ganador es ${winnerName}. El sorteo ha concluido.`,
            });
            router.refresh();
        } catch (error) {
            toast({
                title: "Error de Guardado",
                description: "No se pudo guardar el ganador de la tómbola.",
                variant: "destructive"
            });
        }
    };

    const resetRaffleState = () => {
        setLoadedRaffle(null);
        setRaffleIdInput('');
        setRaffleError(null);
        setIsLoadingRaffle(false);
    }

    if (loading || !user) {
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
                            <ParticipantManager />
                        </TabsContent>
                        <TabsContent value="roulette" className="mt-6">
                            {!loadedRaffle ? (
                                <Card className="max-w-md mx-auto">
                                    <CardHeader>
                                        <CardTitle>Jugar una Ruleta</CardTitle>
                                        <CardDescription>Ingresa el ID de una ruleta guardada para jugarla.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleLoadRaffle} className="space-y-4">
                                            <Input
                                                placeholder="ID de la Ruleta"
                                                value={raffleIdInput}
                                                onChange={(e) => setRaffleIdInput(e.target.value)}
                                                disabled={isLoadingRaffle}
                                            />
                                            <Button type="submit" className="w-full" disabled={isLoadingRaffle || !raffleIdInput}>
                                                {isLoadingRaffle && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {isLoadingRaffle ? 'Cargando...' : 'Cargar Ruleta'}
                                            </Button>
                                        </form>
                                        {raffleError && (
                                            <Alert variant="destructive" className="mt-4">
                                                <AlertTitle>Error</AlertTitle>
                                                <AlertDescription>{raffleError}</AlertDescription>
                                            </Alert>
                                        )}
                                    </CardContent>
                                </Card>
                            ) : (
                                <Roulette 
                                    participants={loadedRaffle.participants} 
                                    onSpinEnd={handleSetWinner}
                                    onCelebrationEnd={resetRaffleState}
                                />
                            )}
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
