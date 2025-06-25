import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Raffle } from '@/lib/data';

interface RaffleHistoryProps {
    raffles: Raffle[];
}

export default function RaffleHistory({ raffles }: RaffleHistoryProps) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline">Historial de Sorteos</CardTitle>
                <CardDescription>Lista de todas las ruletas creadas y su estado actual.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID de la Ruleta</TableHead>
                                <TableHead>Fecha Creación</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Ganador</TableHead>
                                <TableHead className="text-right">Monto</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {raffles.length > 0 ? raffles.map((raffle) => (
                                <TableRow key={raffle.id}>
                                    <TableCell className="font-mono text-xs">{raffle.id}</TableCell>
                                    <TableCell>{raffle.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={raffle.status === 'completed' ? 'default' : 'secondary'} className={raffle.status === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}>
                                            {raffle.status === 'completed' ? 'Concluida' : 'Pendiente'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{raffle.winner || 'N/A'}</TableCell>
                                    <TableCell className="text-right font-semibold">${raffle.raffleTotal.toLocaleString()}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        No se han creado ruletas todavía.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
