"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getWithdrawals, Withdrawal } from '@/lib/data';
import { History, Loader2 } from 'lucide-react';
import PrintButton from '@/components/PrintButton';
import Footer from '@/components/Footer';

export default function WithdrawalsPage() {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[] | null>(null);

    useEffect(() => {
        getWithdrawals().then(setWithdrawals);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-8 px-4">
              <Card className="max-w-4xl mx-auto shadow-lg">
                  <CardHeader>
                      <CardTitle className="font-headline text-3xl flex items-center gap-3">
                          <History className="h-8 w-8 text-primary" />
                          Historial de Retiros
                      </CardTitle>
                      <CardDescription>Lista de todos los retiros de fondos registrados.</CardDescription>
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
                                      <TableHead>Declaración</TableHead>
                                      <TableHead className="text-right">Monto</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {withdrawals === null ? (
                                    <TableRow>
                                      <TableCell colSpan={6} className="h-24 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                      </TableCell>
                                    </TableRow>
                                  ) : withdrawals.length > 0 ? withdrawals.map((w) => (
                                      <TableRow key={w.id}>
                                          <TableCell className="font-mono text-xs">{w.id}</TableCell>
                                          <TableCell className="font-mono text-xs">{w.solicitudId}</TableCell>
                                          <TableCell className="font-medium">{w.name}</TableCell>
                                          <TableCell className="text-muted-foreground">{w.date}</TableCell>
                                          <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate" title={w.declaration}>{w.declaration}</TableCell>
                                          <TableCell className="text-right font-semibold">${w.amount.toLocaleString()}</TableCell>
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
                  <CardFooter className="flex justify-end">
                      <PrintButton />
                  </CardFooter>
              </Card>
            </main>
            <Footer />
        </div>
    );
}
