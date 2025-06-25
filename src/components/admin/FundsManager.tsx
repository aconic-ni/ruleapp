"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Funds, Withdrawal } from '@/lib/data';

interface FundsManagerProps {
    funds: Funds;
    withdrawals: Withdrawal[];
    onAddWithdrawal: (withdrawal: Omit<Withdrawal, 'id' | 'date'>) => void;
}

const withdrawalSchema = z.object({
    name: z.string().min(3, "El nombre es requerido."),
    amount: z.coerce.number().positive("El monto debe ser un número positivo."),
    declaration: z.string().min(10, "La declaración es muy corta.").max(500, "La declaración es muy larga."),
});

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

export default function FundsManager({ funds, withdrawals, onAddWithdrawal }: FundsManagerProps) {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<WithdrawalFormValues>({
        resolver: zodResolver(withdrawalSchema),
        defaultValues: {
            name: '',
            amount: 0,
            declaration: '',
        }
    });
    
    const balance = funds.total - funds.withdrawn;

    const onSubmit = (data: WithdrawalFormValues) => {
        if (data.amount > balance) {
            form.setError("amount", {
                type: "manual",
                message: "El retiro no puede exceder los fondos disponibles.",
            });
            return;
        }

        onAddWithdrawal(data);
        toast({ title: "Éxito", description: `Solicitud de retiro por $${data.amount.toLocaleString()} registrada.` });
        form.reset();
        setIsDialogOpen(false);
    };


    return (
        <div className="space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Gestionar Fondos</CardTitle>
                    <CardDescription>Visualiza el estado de los fondos y registra nuevos retiros.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-secondary rounded-lg">
                            <p className="text-sm text-secondary-foreground font-semibold">Ingresos Totales</p>
                            <p className="text-2xl font-bold">${funds.total.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-destructive/10 rounded-lg">
                            <p className="text-sm text-destructive font-semibold">Retiros Totales</p>
                            <p className="text-2xl font-bold text-destructive">${funds.withdrawn.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-primary/10 rounded-lg">
                            <p className="text-sm text-primary font-semibold">Balance Actual</p>
                            <p className="text-2xl font-bold text-primary">${balance.toLocaleString()}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Solicitar Retiro</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <DialogHeader>
                                        <DialogTitle>Nueva Solicitud de Retiro</DialogTitle>
                                        <DialogDescription>
                                            Complete el formulario para registrar un nuevo retiro. El ID de solicitud se generará automáticamente.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <FormField control={form.control} name="name" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre</FormLabel>
                                                <FormControl><Input placeholder="Nombre del solicitante" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="amount" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Monto</FormLabel>
                                                <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="declaration" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Declaración</FormLabel>
                                                <FormControl><Textarea placeholder="Motivo del retiro..." {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                                        <Button type="submit" disabled={form.formState.isSubmitting}>
                                            {form.formState.isSubmitting ? 'Registrando...' : 'Registrar Retiro'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>

            <Card className="shadow-lg">
                 <CardHeader>
                    <CardTitle className="font-headline">Historial de Retiros</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID Solicitud</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {withdrawals.length > 0 ? withdrawals.map((w) => (
                                    <TableRow key={w.id}>
                                        <TableCell className="font-mono text-xs">{w.id}</TableCell>
                                        <TableCell className="font-medium">{w.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{w.date}</TableCell>
                                        <TableCell className="text-right font-semibold">${w.amount.toLocaleString()}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">No hay retiros registrados.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
