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
import Link from "next/link";
import type { Participant, Funds, Winner, Withdrawal } from '@/lib/data';

interface AdminDashboardProps {
    initialParticipants: Participant[];
    initialFunds: Funds;
    initialWinners: Winner[];
    initialWithdrawals: Withdrawal[];
}

export default function AdminDashboard({ initialParticipants, initialFunds, initialWinners, initialWithdrawals }: AdminDashboardProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
    const [funds, setFunds] = useState<Funds>(initialFunds);
    const [winners, setWinners] = useState<Winner[]>(initialWinners);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(initialWithdrawals);

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
        setParticipants(prev => [...prev, { name, ticketValue, number }]);
        setFunds(prev => ({ ...prev, total: prev.total + ticketValue }));
    };

    const handleAddWithdrawal = (withdrawalRequest: Omit<Withdrawal, 'id' | 'date'>) => {
        const newWithdrawal: Withdrawal = {
            ...withdrawalRequest,
            id: `IDRetiro-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
        };
        setWithdrawals(prev => [newWithdrawal, ...prev]);
        setFunds(prev => ({ ...prev, withdrawn: prev.withdrawn + newWithdrawal.amount }));
    };
    
    const handleSpinEnd = (winnerName: string) => {
        const newWinner: Winner = {
            name: winnerName,
            date: new Date().toISOString().split('T')[0],
        };
        setWinners(prev => [newWinner, ...prev]);
        setParticipants([]); // Clear participants for the next raffle
        toast({
            title: "¡Tómbola Finalizada!",
            description: `El ganador es ${winnerName}. Se ha iniciado una nueva tómbola.`,
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p className="text-muted-foreground">Verificando acceso...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <header className="bg-card shadow-sm">
                <div className="container mx-auto p-4 flex justify-between items-center">
                    <Link href="/" className="text-xl font-headline text-primary">Panel de Administrador</Link>
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
            <Toaster />
        </div>
    );
}
