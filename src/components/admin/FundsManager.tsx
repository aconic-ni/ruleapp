"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

interface Funds {
    total: number;
    withdrawn: number;
}

interface FundsManagerProps {
    funds: Funds;
    onUpdateFunds: (newFunds: Funds) => void;
}

export default function FundsManager({ funds, onUpdateFunds }: FundsManagerProps) {
    const [amount, setAmount] = useState('');
    const { toast } = useToast();

    const handleTransaction = (type: 'deposit' | 'withdraw') => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast({ title: "Error", description: "Por favor, ingresa un monto válido.", variant: "destructive" });
            return;
        }

        if (type === 'withdraw' && numAmount > (funds.total - funds.withdrawn)) {
            toast({ title: "Error", description: "El retiro no puede exceder los fondos disponibles.", variant: "destructive" });
            return;
        }

        const newFunds = {
            total: type === 'deposit' ? funds.total + numAmount : funds.total,
            withdrawn: type === 'withdraw' ? funds.withdrawn + numAmount : funds.withdrawn,
        };

        onUpdateFunds(newFunds);
        setAmount('');
        toast({ title: "Éxito", description: `Transacción de ${type === 'deposit' ? 'ingreso' : 'retiro'} por $${numAmount.toLocaleString()} registrada.` });
    };

    const balance = funds.total - funds.withdrawn;

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline">Gestionar Fondos</CardTitle>
                <CardDescription>Registra los ingresos por boletos y los retiros de fondos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-sm text-secondary-foreground font-semibold">Ingresos Totales</p>
                        <p className="text-2xl font-bold">${funds.total.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-sm text-secondary-foreground font-semibold">Retiros Totales</p>
                        <p className="text-2xl font-bold">${funds.withdrawn.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg">
                        <p className="text-sm text-primary font-semibold">Balance Actual</p>
                        <p className="text-2xl font-bold text-primary">${balance.toLocaleString()}</p>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-end gap-4 p-4 border rounded-lg">
                    <div className="w-full sm:w-auto flex-grow">
                        <Label htmlFor="amount">Monto de Transacción</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button className="flex-1" onClick={() => handleTransaction('deposit')}>Registrar Ingreso</Button>
                        <Button className="flex-1" variant="outline" onClick={() => handleTransaction('withdraw')}>Registrar Retiro</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
