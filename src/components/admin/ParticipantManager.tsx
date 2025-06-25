
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import type { Participant } from '@/lib/data';
import { createRaffle } from '@/lib/actions';
import { Loader2 } from 'lucide-react';

export default function ParticipantManager() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [newName, setNewName] = useState('');
    const [ticketValue, setTicketValue] = useState(25);
    const [participantNumber, setParticipantNumber] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const handleAddParticipant = (e: React.FormEvent) => {
        e.preventDefault();
        const num = parseInt(participantNumber, 10);

        if (newName.trim() === '') {
            toast({ title: "Error", description: "El nombre no puede estar vacío.", variant: "destructive" });
            return;
        }
        if (ticketValue <= 0) {
            toast({ title: "Error", description: "El valor del boleto debe ser positivo.", variant: "destructive" });
            return;
        }
        if (isNaN(num) || num < 1 || num > 50) {
            toast({ title: "Error", description: "El número debe estar entre 1 y 50.", variant: "destructive" });
            return;
        }
        if (participants.some(p => p.number === num)) {
            toast({ title: "Error", description: `El número ${num} ya ha sido elegido. Por favor, elige otro.`, variant: "destructive" });
            return;
        }

        const newParticipant: Participant = { name: newName.trim(), ticketValue, number: num };
        setParticipants(prev => [...prev, newParticipant]);
        
        setNewName('');
        setTicketValue(25);
        setParticipantNumber('');
    };

    const handleSaveRaffle = async () => {
        if (participants.length === 0) {
            toast({ title: "Error", description: "Agrega al menos un participante para guardar la ruleta.", variant: "destructive" });
            return;
        }
        setIsSaving(true);
        try {
            const newRaffleId = await createRaffle(participants);
            toast({
                title: "Ruleta Guardada con Éxito",
                description: `ID de la Ruleta: ${newRaffleId}. Ya puedes jugarla en la pestaña 'Ruleta'.`,
                duration: 8000
            });
            setParticipants([]); // Clear participants for the next raffle
        } catch (error) {
            toast({ title: "Error al Guardar", description: "No se pudo guardar la ruleta.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline">Crear Nueva Ruleta</CardTitle>
                <CardDescription>Añade los participantes y luego guarda la ruleta para poder jugarla.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                <div>
                    <form onSubmit={handleAddParticipant} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-participant">Nombre del Participante</Label>
                            <Input
                                id="new-participant"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Ej: Juan Pérez"
                                disabled={isSaving}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ticket-value">Valor del Boleto</Label>
                            <Input
                                id="ticket-value"
                                type="number"
                                value={ticketValue}
                                onChange={(e) => setTicketValue(Number(e.target.value))}
                                placeholder="25"
                                disabled={isSaving}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="participant-number">Número (1-50)</Label>
                            <Input
                                id="participant-number"
                                type="number"
                                min="1"
                                max="50"
                                value={participantNumber}
                                onChange={(e) => setParticipantNumber(e.target.value)}
                                placeholder="Ej: 7"
                                disabled={isSaving}
                            />
                        </div>
                        <Button type="submit" disabled={isSaving}>Agregar Participante</Button>
                    </form>
                </div>
                <div>
                    <h3 className="font-semibold mb-2 text-muted-foreground">Lista de Participantes ({participants.length})</h3>
                    <ScrollArea className="h-72 w-full rounded-md border p-4 bg-muted/50">
                        {participants.length > 0 ? (
                            <ul className="space-y-1">
                            {participants.map((p, i) => (
                                <li key={i} className="text-sm p-1 rounded-md transition-colors hover:bg-background flex justify-between items-center">
                                    <span>{i+1}. {p.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-primary text-base">#{p.number}</span>
                                        <span className="font-mono text-muted-foreground">${p.ticketValue}</span>
                                    </div>
                                </li>
                            ))}
                            </ul>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-sm text-muted-foreground">Añade participantes para crear una nueva ruleta.</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSaveRaffle} disabled={isSaving || participants.length === 0}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? "Guardando..." : "Guardar Ruleta"}
                 </Button>
            </CardFooter>
        </Card>
    );
}
