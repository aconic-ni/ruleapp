"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface RouletteProps {
  participants: string[];
}

const COLORS = ["#3B82F6", "#0EA5E9", "#FFC107", "#FF5722", "#4CAF50", "#2196F3", "#E91E63", "#00BCD4"];

export default function Roulette({ participants = [] }: RouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  
  const segmentDegrees = participants.length > 0 ? 360 / participants.length : 360;

  const handleSpin = () => {
    if (isSpinning || participants.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winnerName = participants[winnerIndex];

    const winnerSegmentStart = segmentDegrees * winnerIndex;
    const winnerSegmentCenter = winnerSegmentStart + (segmentDegrees / 2);
    // Align winner's segment center with the pointer at the top (270deg or -90deg)
    const targetRotation = 360 - winnerSegmentCenter;

    const extraSpins = Math.floor(Math.random() * 6) + 5;
    // Keep rotation values accumulating to prevent wheel from "jumping" back
    const totalRotation = rotation - (rotation % 360) + (360 * extraSpins) + targetRotation;

    setRotation(totalRotation);

    // This duration must match the CSS transition duration
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(winnerName);
      setShowWinnerDialog(true);
      // In a real app, call a service here to save the winner.
      // e.g., saveWinnerToDB(winnerName, new Date());
    }, 6000); 
  };

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
        <div style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} className="absolute -top-1 w-8 h-10 bg-accent z-10" />
        
        {/* Wheel */}
        <div
          className="relative w-full h-full rounded-full border-8 border-accent bg-background shadow-2xl overflow-hidden transition-transform duration-[6000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {participants.map((name, index) => {
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
                  <span className="block w-24 truncate text-center font-body">{name}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      <Button onClick={handleSpin} disabled={isSpinning || participants.length === 0} size="lg" className="font-bold text-lg px-8 py-6 rounded-full shadow-lg">
        <Star className="mr-2 h-5 w-5 animate-pulse" />
        {isSpinning ? 'Girando...' : 'Girar la Tómbola'}
      </Button>
    </div>
  );
}
