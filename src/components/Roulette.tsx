
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Shuffle } from 'lucide-react';
import type { Participant } from '@/lib/data';
import { cn } from '@/lib/utils';

interface RouletteProps {
  participants: Participant[];
  onSpinEnd: (winnerName: string) => void;
  onCelebrationEnd: () => void;
}

const COLORS = [
  "#42A5F5", "#FF7043", "#66BB6A", "#FFCA28", "#26C6DA", "#EC407A", "#9CCC65", "#7E57C2",
  "#29B6F6", "#FFA726", "#8D6E63", "#EF5350", "#AB47BC", "#5C6BC0", "#26A69A", "#FFEE58",
  "#FF8A65", "#42A5F5", "#D4E157", "#BDBDBD", "#78909C", "#FF7043", "#A1887F", "#90A4AE",
  "#66BB6A", "#FFCA28", "#26C6DA", "#EC407A", "#9CCC65", "#7E57C2", "#29B6F6", "#FFA726",
  "#8D6E63", "#EF5350", "#AB47BC", "#5C6BC0", "#26A69A", "#FFEE58", "#FF8A65", "#D4E157",
  "#BDBDBD", "#78909C", "#A1887F", "#90A4AE", "#607D8B", "#FFC107", "#03A9F4", "#CDDC39"
];
const SPIN_DURATION_SECONDS = 8;

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

const ConfettiPiece = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute w-2 h-4" style={style} />
);

const ConfettiExplosion = () => {
    const [pieces, setPieces] = useState<React.ReactNode[]>([]);

    useEffect(() => {
        const confettiColors = ["#FFCA28", "#FF7043", "#66BB6A", "#42A5F5", "#EC407A", "#FFFFFF"];
        const newPieces = Array.from({ length: 150 }).map((_, i) => {
            const style: React.CSSProperties = {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * -20}%`,
                backgroundColor: confettiColors[i % confettiColors.length],
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `confetti-fall ${2 + Math.random() * 2}s ${Math.random() * 1}s linear forwards`,
            };
            return <ConfettiPiece key={i} style={style} />;
        });
        setPieces(newPieces);
    }, []);

    return <div className="absolute inset-0 pointer-events-none">{pieces}</div>;
};


export default function Roulette({ participants = [], onSpinEnd, onCelebrationEnd }: RouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [shuffledParticipants, setShuffledParticipants] = useState<Participant[]>([]);
  const [showWinnerCelebration, setShowWinnerCelebration] = useState(false);

  useEffect(() => {
    setShuffledParticipants(shuffleArray(participants));
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
    setShowWinnerCelebration(false);

    // Determine a random winner
    const winnerIndex = Math.floor(Math.random() * numParticipants);
    const winningParticipant = shuffledParticipants[winnerIndex];

    // Calculate the final rotation
    const fullSpins = 5 + Math.floor(Math.random() * 5); // 5 to 9 full spins
    const targetAngle = (winnerIndex * segmentDegrees) + (segmentDegrees / 2);
    const finalRotation = (fullSpins * 360) + (360 - targetAngle);

    // Use current rotation to make spins cumulative and smoother
    const newRotation = rotation - (rotation % 360) + finalRotation;

    setRotation(newRotation);

    // When spin animation finishes
    setTimeout(() => {
        setIsSpinning(false);
        if (winningParticipant) {
            setWinner(winningParticipant.name);
            setShowWinnerCelebration(true);
            onSpinEnd(winningParticipant.name); // Call onSpinEnd to save winner
        }
    }, SPIN_DURATION_SECONDS * 1000 + 200);
  };
  
  const handleCelebrationEnd = () => {
    onCelebrationEnd();
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
    return { background: `conic-gradient(${gradientParts.join(', ')})` };
  }, [shuffledParticipants, segmentDegrees, numParticipants]);

  if (showWinnerCelebration) {
    return (
        <div className="fixed inset-0 bg-green-600 z-50 flex flex-col items-center justify-center text-white p-4 overflow-hidden">
            <ConfettiExplosion />
            <p className="text-2xl mb-4 font-semibold">¡Felicidades al ganador!</p>
            <h1 className="text-5xl md:text-7xl font-bold font-headline mb-12 break-words text-center px-4 animate-pulse">
                {winner}
            </h1>
            <Button onClick={handleCelebrationEnd} size="lg" className="bg-white text-green-700 hover:bg-gray-200 text-xl font-bold px-10 py-8 rounded-full shadow-2xl z-10">
                <Star className="mr-3 h-6 w-6" />
                Cargar Otra Ruleta
            </Button>
        </div>
    )
  }

  if (participants.length === 0) {
    return (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
            <h3 className="text-xl font-headline text-muted-foreground">Esperando Ruleta</h3>
            <p className="mt-2 text-sm text-muted-foreground">Ingresa el ID de una ruleta guardada para empezar a jugar.</p>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] flex items-center justify-center">
        <div 
          className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-8 h-10 z-20"
          style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))' }}
        >
          <div style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} className="w-full h-full bg-red-500" />
        </div>
        
        <div
          className="relative w-full h-full rounded-full border-8 border-accent bg-background shadow-2xl overflow-hidden"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? `transform ${SPIN_DURATION_SECONDS}s cubic-bezier(0.25, 1, 0.5, 1)` : 'none'
          }}
        >
            <div className="absolute inset-0 rounded-full" style={wheelStyle} />

            {numParticipants > 0 && shuffledParticipants.map((participant, index) => {
              const angle = segmentDegrees * index + (segmentDegrees / 2);
              const textRadius = 0.8; // Percentage from center to place the text (80%)
              
              const x = 50 + textRadius * 50 * Math.cos((angle - 90) * (Math.PI / 180));
              const y = 50 + textRadius * 50 * Math.sin((angle - 90) * (Math.PI / 180));
              
              return (
                <div
                  key={`${participant.number}-${index}`}
                  className="absolute flex items-center justify-center pointer-events-none"
                  style={{
                    top: `${y}%`,
                    left: `${x}%`,
                    width: segmentDegrees * 3, // Adjust width based on segment size
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`
                  }}
                >
                  <span
                    className={cn(
                        "block text-center font-headline font-bold text-white",
                        numParticipants > 35 ? 'text-xs md:text-sm' : 'text-base md:text-lg'
                    )}
                    style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
                  >
                    {participant.number}
                  </span>
                </div>
              )
            })}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white border-4 border-gray-300 rounded-full z-10 shadow-inner" />
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
