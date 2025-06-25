"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Shuffle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Participant } from '@/lib/data';

interface RouletteProps {
  participants: Participant[];
  onSpinEnd: (winnerName: string) => void;
}

const COLORS = ["#3B82F6", "#0EA5E9", "#FFC107", "#FF5722", "#4CAF50", "#2196F3", "#E91E63", "#00BCD4"];

export default function Roulette({ participants = [], onSpinEnd }: RouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [shuffledParticipants, setShuffledParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    // Initial shuffle when participants change
    setShuffledParticipants([...participants].sort(() => Math.random() - 0.5));
  }, [participants]);
  
  const segmentDegrees = shuffledParticipants.length > 0 ? 360 / shuffledParticipants.length : 360;

  const handleShuffle = () => {
    setShuffledParticipants([...participants].sort(() => Math.random() - 0.5));
  }

  const handleSpin = () => {
    if (isSpinning || shuffledParticipants.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    const winnerIndex = Math.floor(Math.random() * shuffledParticipants.length);
    const winnerName = shuffledParticipants[winnerIndex].name;

    const winnerSegmentStart = segmentDegrees * winnerIndex;
    const winnerSegmentCenter = winnerSegmentStart + (segmentDegrees / 2);
    const targetRotation = 360 - winnerSegmentCenter;

    const extraSpins = Math.floor(Math.random() * 6) + 5;
    const totalRotation = rotation - (rotation % 360) + (360 * extraSpins) + targetRotation;

    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(winnerName);
      setShowWinnerDialog(true);
      onSpinEnd(winnerName);
    }, 6000); 
  };

  if (participants.length === 0) {
    return (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
            <h3 className="text-xl font-headline text-muted-foreground">Esperando Participantes</h3>
            <p className="mt-2 text-sm text-muted-foreground">Agrega participantes en la pestaña "Participantes" para activar la ruleta.</p>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <AlertDialog open={showWinnerDialog} onOpenChange={setShowWinnerDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-3xl font-headline text-accent">¡Felicidades!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-5xl font-bold text-primary py-6 break-words">
              {winner}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowWinnerDialog(false)} className="w-full">Cerrar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
        <div style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} className="absolute -top-1 w-8 h-10 bg-accent z-10" />
        
        <div
          className="relative w-full h-full rounded-full border-8 border-accent bg-background shadow-2xl overflow-hidden transition-transform duration-[6000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {shuffledParticipants.map((participant, index) => {
            const rotate = index * segmentDegrees;
            const skew = 90 - segmentDegrees;
            return (
              <div
                key={index}
                className="absolute w-1/2 h-1/2 origin-bottom-right"
                style={{
                  transform: `rotate(${rotate}deg) skewY(${skew > 0 ? skew : 0}deg)`,
                  background: COLORS[index % COLORS.length]
                }}
              >
                <div 
                  className="absolute w-[160%] h-full flex items-center justify-center text-white font-bold text-xs md:text-sm -translate-y-1/2"
                  style={{ 
                    transform: `skewY(${skew > 0 ? -skew : 0}deg) rotate(${segmentDegrees/2}deg) translate(-25%, -50%)`,
                  }}
                >
                  <span className="block w-24 truncate text-center font-body">{participant.name.split(' ')[0]}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button onClick={handleShuffle} disabled={isSpinning} variant="outline">
            <Shuffle className="mr-2 h-5 w-5" />
            Mezclar
        </Button>
        <Button onClick={handleSpin} disabled={isSpinning} size="lg" className="font-bold text-lg px-8 py-6 rounded-full shadow-lg">
            <Star className="mr-2 h-5 w-5 animate-pulse" />
            {isSpinning ? 'Girando...' : 'Girar la Tómbola'}
        </Button>
      </div>
    </div>
  );
}
