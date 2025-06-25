import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from 'lucide-react';

interface Winner {
    name: string;
    date: string;
}

interface WinnerHistoryProps {
    winners: Winner[];
}

export default function WinnerHistory({ winners }: WinnerHistoryProps) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline">Historial de Ganadores</CardTitle>
                <CardDescription>Lista de todos los ganadores de sorteos anteriores.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[70%]">Ganador</TableHead>
                                <TableHead className="text-right">Fecha del Sorteo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {winners.length > 0 ? winners.map((winner, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-500" />{winner.name}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">{winner.date}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                                        Aún no hay ganadores registrados.
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
