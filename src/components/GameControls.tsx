
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, RotateCcw, Shuffle, Volume2 } from 'lucide-react';

interface GameControlsProps {
  isGameActive: boolean;
  availableNumbers: number[];
  onStartGame: () => void;
  onCallNumber: () => void;
  onResetGame: () => void;
  onGenerateNewCard: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  isGameActive,
  availableNumbers,
  onStartGame,
  onCallNumber,
  onResetGame,
  onGenerateNewCard,
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {!isGameActive ? (
        <Button
          onClick={onStartGame}
          size="lg"
          className="bg-ethiopian-green hover:bg-ethiopian-green/90 text-white font-bold px-6"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Game
        </Button>
      ) : (
        <Button
          onClick={onCallNumber}
          disabled={availableNumbers.length === 0}
          size="lg"
          className="bg-ethiopian-yellow hover:bg-ethiopian-yellow/90 text-ethiopian-dark font-bold px-6"
        >
          <Volume2 className="w-5 h-5 mr-2" />
          Call Next Number
        </Button>
      )}

      <Button
        onClick={onResetGame}
        variant="outline"
        size="lg"
        className="border-ethiopian-red text-ethiopian-red hover:bg-ethiopian-red hover:text-white"
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        Reset Game
      </Button>

      <Button
        onClick={onGenerateNewCard}
        variant="outline"
        size="lg"
        className="border-ethiopian-green text-ethiopian-green hover:bg-ethiopian-green hover:text-white"
      >
        <Shuffle className="w-5 h-5 mr-2" />
        New Card
      </Button>
    </div>
  );
};

export default GameControls;
