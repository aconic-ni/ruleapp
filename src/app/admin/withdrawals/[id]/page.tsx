"use client";

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getWithdrawalById } from '@/lib/actions';
import type { Withdrawal } from '@/lib/data';
import WithdrawalReceipt from '@/components/admin/WithdrawalReceipt';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import PrintButton from '@/components/PrintButton';
import { useAuth } from '@/context/AuthContext';

export default function WithdrawalDetailPage({ params }: { params: { id: string } }) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [withdrawal, setWithdrawal] = useState<Withdrawal | null | undefined>(undefined);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/admin');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            getWithdrawalById(params.id)
                .then(data => {
                    setWithdrawal(data); // Can be null if not found
                });
        }
    }, [params.id, user]);

    if (authLoading || withdrawal === undefined) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Cargando...</p>
            </div>
        );
    }
    
    if (!withdrawal) {
        notFound();
    }

    return (
        <div className="bg-gray-100 min-h-screen print:bg-white">
            <div className="container mx-auto py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8 no-print flex justify-between items-center">
                        <Button asChild variant="outline">
                            <Link href="/admin/dashboard">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver al Panel
                            </Link>
                        </Button>
                        <PrintButton />
                    </div>
                    <main id="receipt" className="bg-white rounded-xl shadow-md print:shadow-none print:rounded-none">
                        <WithdrawalReceipt withdrawal={withdrawal} />
                    </main>
                </div>
            </div>
        </div>
    );
}
