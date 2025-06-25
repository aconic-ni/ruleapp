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

const COLORS = ["#3B82F6", "#0EA5E9", "#FFC107", "#FF5722", "#4CAF50", "#2196F3", "#E91E63", "#00BCD4"];
const SPIN_DURATION_MS = 8000;

export default function Roulette({ participants = [], onSpinEnd }: RouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [shuffledParticipants, setShuffledParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    // Initial shuffle when participants change
    if (participants.length > 0) {
        setShuffledParticipants([...participants].sort(() => Math.random() - 0.5));
    } else {
        setShuffledParticipants([]);
    }
  }, [participants]);
  
  const numParticipants = shuffledParticipants.length;
  const segmentDegrees = numParticipants > 0 ? 360 / numParticipants : 360;

  const handleShuffle = () => {
    if(isSpinning) return;
    setShuffledParticipants([...shuffledParticipants].sort(() => Math.random() - 0.5));
  }

  const handleSpin = () => {
    if (isSpinning || numParticipants === 0) return;

    setIsSpinning(true);
    setWinner(null);

    const winnerIndex = Math.floor(Math.random() * numParticipants);
    const winnerData = shuffledParticipants[winnerIndex];

    const winnerSegmentStart = segmentDegrees * winnerIndex;
    const winnerSegmentCenter = winnerSegmentStart + (segmentDegrees / 2);
    
    // The pointer is at the top (270deg). We want the center of the winner's segment to land there.
    const targetVisualAngle = (270 - winnerSegmentCenter + 360) % 360;
    const currentVisualAngle = rotation % 360;
    
    let angleDelta = targetVisualAngle - currentVisualAngle;
    if (angleDelta < 0) {
        angleDelta += 360; // Ensure we always spin forward
    }

    const extraSpins = 8 * 360; // 8 full spins for effect
    const newRotation = rotation + extraSpins + angleDelta;

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(winnerData.name);
      setShowWinnerDialog(true);
      onSpinEnd(winnerData.name);
    }, SPIN_DURATION_MS); // Must match animation duration
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
    return { background: `conic-gradient(from 0deg, ${gradientParts.join(', ')})` };
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

      <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
        {/* Pointer */}
        <div style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} className="absolute top-0 w-8 h-10 bg-accent z-10 transform -translate-y-1/2" />
        
        <div
          className="relative w-full h-full rounded-full border-8 border-accent bg-background shadow-2xl transition-transform ease-out"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? `${SPIN_DURATION_MS}ms` : '0ms'
          }}
        >
            {/* Segments */}
            <div className="absolute inset-0" style={wheelStyle} />

            {/* Labels */}
            {numParticipants > 0 && shuffledParticipants.map((participant, index) => {
              const angle = segmentDegrees * index + (segmentDegrees / 2); // Angle to center of segment
              const radiusPercent = 35; // 35% from the center
              const angleRad = (angle - 90) * (Math.PI / 180); // adjust by -90 because 0deg is right, we want it to be top
              const x = 50 + radiusPercent * Math.cos(angleRad);
              const y = 50 + radiusPercent * Math.sin(angleRad);
              
              return (
                <div
                  key={`${participant.number}-${index}`}
                  className="absolute flex items-center justify-center"
                  style={{
                    top: `${y}%`,
                    left: `${x}%`,
                    transform: `translate(-50%, -50%)`
                  }}
                >
                  <span
                    className="block text-center font-headline font-bold text-2xl md:text-3xl text-white"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7), 0 0 5px rgba(0,0,0,0.5)' }}
                  >
                    #{participant.number}
                  </span>
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
            <Star className={cn("mr-2 h-5 w-5", isSpinning && "animate-spin")} />
            {isSpinning ? 'Girando...' : 'Girar la Tómbola'}
        </Button>
      </div>
    </div>
  );
}
