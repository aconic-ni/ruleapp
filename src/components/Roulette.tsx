"use client";

import { useState, useEffect, useMemo } from 'react';
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
import { cn } from '@/lib/utils';

interface RouletteProps {
  participants: Participant[];
  onSpinEnd: (winnerName: string) => void;
}

// Expanded color palette to avoid adjacent repeats for up to 50 participants
const COLORS = [
  "#42A5F5", "#FF7043", "#66BB6A", "#FFCA28", "#26C6DA", "#EC407A", "#9CCC65", "#7E57C2",
  "#29B6F6", "#FFA726", "#8D6E63", "#EF5350", "#AB47BC", "#5C6BC0", "#26A69A", "#FFEE58",
  "#FF8A65", "#42A5F5", "#D4E157", "#BDBDBD", "#78909C", "#FF7043", "#A1887F", "#90A4AE",
  "#66BB6A", "#FFCA28", "#26C6DA", "#EC407A", "#9CCC65", "#7E57C2", "#29B6F6", "#FFA726",
  "#8D6E63", "#EF5350", "#AB47BC", "#5C6BC0", "#26A69A", "#FFEE58", "#FF8A65", "#D4E157",
  "#BDBDBD", "#78909C", "#A1887F", "#90A4AE", "#607D8B", "#FFC107", "#03A9F4", "#CDDC39"
];
const SPIN_DURATION_SECONDS = 8;

// Fisher-Yates shuffle algorithm for a good shuffle
const shuffleArray = (array: Participant[]) => {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array];
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
};


export default function Roulette({ participants = [], onSpinEnd }: RouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [shuffledParticipants, setShuffledParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    setShuffledParticipants(participants);
  }, [participants]);
  
  const numParticipants = shuffledParticipants.length;
  const segmentDegrees = numParticipants > 0 ? 360 / numParticipants : 360;

  const handleShuffle = () => {
    if(isSpinning) return;
    setShuffledParticipants(shuffleArray(shuffledParticipants));
  }

  const handleSpin = () => {
    if (isSpinning || numParticipants < 2) return;

    setIsSpinning(true);
    setWinner(null);

    const winnerIndex = Math.floor(Math.random() * numParticipants);
    const winnerData = shuffledParticipants[winnerIndex];
    
    const winnerSegmentCenter = (segmentDegrees * winnerIndex) + (segmentDegrees / 2);
    const targetAngle = 360 - winnerSegmentCenter;

    const extraSpins = (8 + Math.floor(Math.random() * 4)) * 360;
    const currentAngle = rotation % 360;
    const newRotation = rotation - currentAngle + extraSpins + targetAngle;
    
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const winningParticipant = shuffledParticipants.find(p => p.number === winnerData.number);
      if (winningParticipant) {
        setWinner(winningParticipant.name);
        setShowWinnerDialog(true);
        onSpinEnd(winningParticipant.name);
      }
    }, SPIN_DURATION_SECONDS * 1000 + 200);
  };

  const wheelStyle = useMemo(() => {
    if (numParticipants === 0) {
      return { background: 'hsl(var(--muted))' };
    }
    const gradientParts = shuffledParticipants.map((p, i) => {
      const start = i * segmentDegrees;
      const end = (i + 1) * segmentDegrees;
      return `${COLORS[i % COLORS.length]} ${start}deg ${end}deg`;
    });
    return { background: `conic-gradient(from 180deg, ${gradientParts.join(', ')})` };
  }, [shuffledParticipants, segmentDegrees, numParticipants]);


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

      <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] flex items-center justify-center">
        <div 
          className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-8 h-10 z-20"
          style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))' }}
        >
          <div style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} className="w-full h-full bg-red-500" />
        </div>
        
        <div
          className="relative w-full h-full rounded-full border-8 border-accent bg-background shadow-2xl"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? `transform ${SPIN_DURATION_SECONDS}s cubic-bezier(0.25, 1, 0.5, 1)` : 'none'
          }}
        >
            <div className="absolute inset-0" style={wheelStyle} />

            {numParticipants > 0 && shuffledParticipants.map((participant, index) => {
              const angle = segmentDegrees * index + (segmentDegrees / 2);
              const textRadius = 42.5;
              const angleRad = (angle - 90) * (Math.PI / 180);
              const x = 50 + textRadius * Math.cos(angleRad);
              const y = 50 + textRadius * Math.sin(angleRad);
              
              return (
                <div
                  key={`${participant.number}-${index}`}
                  className="absolute flex items-center justify-center pointer-events-none"
                  style={{
                    top: `${y}%`,
                    left: `${x}%`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`
                  }}
                >
                  <span
                    className="block text-center font-headline font-bold text-lg md:text-xl text-white"
                    style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
                  >
                    {participant.number}
                  </span>
                </div>
              )
            })}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full z-10 shadow-inner" />
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button onClick={handleShuffle} disabled={isSpinning} variant="outline">
            <Shuffle className="mr-2 h-5 w-5" />
            Mezclar
        </Button>
        <Button onClick={handleSpin} disabled={isSpinning || numParticipants < 2} size="lg" className="font-bold text-lg px-8 py-6 rounded-full shadow-lg">
            <Star className={cn("mr-2 h-5 w-5", isSpinning && "animate-spin")} />
            {isSpinning ? 'Girando...' : 'Girar la Tómbola'}
        </Button>
      </div>
    </div>
  );
}
