
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Funds, Withdrawal } from '@/lib/data';
import { Eye } from 'lucide-react';
import WithdrawalReceipt from '@/components/admin/WithdrawalReceipt';
import PrintButton from '@/components/PrintButton';

interface FundsManagerProps {
    funds: Funds;
    withdrawals: Withdrawal[];
    onAddWithdrawal: (withdrawal: Omit<Withdrawal, 'id' | 'date'>) => Promise<void>;
}

const withdrawalSchema = z.object({
    solicitudId: z.string().min(1, "El ID de solicitud es requerido."),
    name: z.string().min(3, "El nombre es requerido."),
    amount: z.coerce.number().positive("El monto debe ser un número positivo."),
    declaration: z.string().min(1, "La declaración es requerida."),
    observation: z.string().min(10, "La observación es muy corta.").max(500, "La observación es muy larga."),
});

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

export default function FundsManager({ funds, withdrawals, onAddWithdrawal }: FundsManagerProps) {
    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
    const [viewingWithdrawal, setViewingWithdrawal] = useState<Withdrawal | null>(null);

    const form = useForm<WithdrawalFormValues>({
        resolver: zodResolver(withdrawalSchema),
        defaultValues: {
            solicitudId: '',
            name: '',
            amount: 0,
            declaration: '',
            observation: '',
        }
    });
    
    const balance = funds.total - funds.withdrawn;

    const onSubmit = async (data: WithdrawalFormValues) => {
        if (data.amount > balance) {
            form.setError("amount", {
                type: "manual",
                message: "El retiro no puede exceder los fondos disponibles.",
            });
            return;
        }

        await onAddWithdrawal(data);
        form.reset();
        setIsRequestDialogOpen(false);
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
                    <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Solicitar Retiro</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <DialogHeader>
                                        <DialogTitle>Nueva Solicitud de Retiro</DialogTitle>
                                        <DialogDescription>
                                            Complete el formulario para registrar un nuevo retiro. El ID de transacción se generará automáticamente.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <FormField control={form.control} name="solicitudId" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>ID Solicitud (Manual)</FormLabel>
                                                <FormControl><Input placeholder="Ej: SOL-001" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
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
                                                <FormLabel>Declaración (Código)</FormLabel>
                                                <FormControl><Input placeholder="Ej: L45868/1" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="observation" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Observación</FormLabel>
                                                <FormControl><Textarea placeholder="Motivo del retiro, detalles..." {...field} /></FormControl>
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
                                    <TableHead>ID Transacción</TableHead>
                                    <TableHead>ID Solicitud</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {withdrawals.length > 0 ? withdrawals.map((w) => (
                                    <TableRow key={w.id}>
                                        <TableCell className="font-mono text-xs">{w.id}</TableCell>
                                        <TableCell className="font-mono text-xs">{w.solicitudId}</TableCell>
                                        <TableCell className="font-medium">{w.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{w.date}</TableCell>
                                        <TableCell className="text-right font-semibold">${w.amount.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => setViewingWithdrawal(w)} title="Ver / Imprimir Recibo">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">No hay retiros registrados.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!viewingWithdrawal} onOpenChange={(isOpen) => { if (!isOpen) setViewingWithdrawal(null) }}>
                <DialogContent className="sm:max-w-2xl">
                    {viewingWithdrawal && <WithdrawalReceipt withdrawal={viewingWithdrawal} />}
                    <DialogFooter className="no-print justify-end gap-2">
                        <PrintButton />
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cerrar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
