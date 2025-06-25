"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";

interface ParticipantManagerProps {
    participants: string[];
    onAddParticipant: (name: string) => void;
}

export default function ParticipantManager({ participants, onAddParticipant }: ParticipantManagerProps) {
    const [newName, setNewName] = useState('');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim() === '') {
            toast({
                title: "Error",
                description: "El nombre no puede estar vacío.",
                variant: "destructive"
            });
            return;
        }
        onAddParticipant(newName);
        setNewName('');
        toast({
            title: "Éxito",
            description: `Participante "${newName}" agregado.`,
        });
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline">Gestionar Participantes</CardTitle>
                <CardDescription>Añade nuevos participantes a la tómbola. Los nombres pueden repetirse para aumentar las probabilidades.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                <div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-participant">Nombre del Participante</Label>
                            <Input
                                id="new-participant"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>
                        <Button type="submit">Agregar Participante</Button>
                    </form>
                </div>
                <div>
                    <h3 className="font-semibold mb-2 text-muted-foreground">Lista de Participantes ({participants.length})</h3>
                    <ScrollArea className="h-72 w-full rounded-md border p-4 bg-muted/50">
                        {participants.length > 0 ? (
                            <ul className="space-y-1">
                            {participants.map((p, i) => (
                                <li key={i} className="text-sm p-1 rounded-md transition-colors hover:bg-background">{i+1}. {p}</li>
                            ))}
                            </ul>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-sm text-muted-foreground">No hay participantes todavía.</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
}
