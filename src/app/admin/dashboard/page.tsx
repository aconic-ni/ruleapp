"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getFunds, getAllWinners, getWithdrawals, getAllRaffles, Funds, Winner, Withdrawal, Raffle } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [initialData, setInitialData] = useState<{
        funds: Funds;
        winners: Winner[];
        withdrawals: Withdrawal[];
        raffles: Raffle[];
    } | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/admin');
        }
    }, [user, authLoading, router]);

    const handleDataRefresh = async () => {
        if (user) {
            const [funds, winners, withdrawals, raffles] = await Promise.all([
                getFunds(),
                getAllWinners(),
                getWithdrawals(),
                getAllRaffles(),
            ]);
            setInitialData({ funds, winners, withdrawals, raffles });
        }
    }

    useEffect(() => {
        handleDataRefresh();
    }, [user]);


    if (authLoading || !user || !initialData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Cargando datos del panel...</p>
            </div>
        );
    }

    return (
        <AdminDashboard
            initialFunds={initialData.funds}
            initialWinners={initialData.winners}
            initialWithdrawals={initialData.withdrawals}
            initialRaffles={initialData.raffles}
            onDataChange={handleDataRefresh}
        />
    );
}
