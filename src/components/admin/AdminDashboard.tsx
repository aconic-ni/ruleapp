"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Landmark, Trophy, LogOut } from 'lucide-react';
import ParticipantManager from './ParticipantManager';
import FundsManager from './FundsManager';
import WinnerHistory from './WinnerHistory';
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";

type Participant = string;
interface Funds {
  total: number;
  withdrawn: number;
}
interface Winner {
  name: string;
  date: string;
}

interface AdminDashboardProps {
    initialParticipants: Participant[];
    initialFunds: Funds;
    initialWinners: Winner[];
}

export default function AdminDashboard({ initialParticipants, initialFunds, initialWinners }: AdminDashboardProps) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
    const [funds, setFunds] = useState<Funds>(initialFunds);

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
            // Silently fail if sessionStorage is not available
        }
        router.push('/');
    };
    
    const handleAddParticipant = (name: string) => {
        setParticipants(prev => [...prev, name]);
        // In a real app: addParticipantToDB(name);
    };

    const handleUpdateFunds = (newFunds: Funds) => {
        setFunds(newFunds);
        // In a real app: updateFundsInDB(newFunds);
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
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                        <TabsTrigger value="participants"><Users className="mr-2 h-4 w-4" />Participantes</TabsTrigger>
                        <TabsTrigger value="funds"><Landmark className="mr-2 h-4 w-4" />Fondos</TabsTrigger>
                        <TabsTrigger value="history"><Trophy className="mr-2 h-4 w-4" />Historial</TabsTrigger>
                    </TabsList>
                    <TabsContent value="participants" className="mt-6">
                        <ParticipantManager participants={participants} onAddParticipant={handleAddParticipant} />
                    </TabsContent>
                    <TabsContent value="funds" className="mt-6">
                        <FundsManager funds={funds} onUpdateFunds={handleUpdateFunds} />
                    </TabsContent>
                    <TabsContent value="history" className="mt-6">
                        <WinnerHistory winners={initialWinners} />
                    </TabsContent>
                </Tabs>
            </main>
            <Toaster />
        </div>
    );
}
