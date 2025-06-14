
import { useState, useCallback } from 'react';

interface UseBingoGame {
  bingoCard: (number | null)[][];
  markedNumbers: Set<number>;
  calledNumbers: string[];
  currentNumber: string | null;
  isGameActive: boolean;
  isAnimating: boolean;
  availableNumbers: number[];
  startGame: () => void;
  callNextNumber: () => void;
  markNumber: (number: number) => void;
  resetGame: () => void;
  generateNewCard: () => void;
}

const useBingoGame = (): UseBingoGame => {
  const [bingoCard, setBingoCard] = useState<(number | null)[][]>(() => generateBingoCard());
  const [markedNumbers, setMarkedNumbers] = useState<Set<number>>(new Set());
  const [calledNumbers, setCalledNumbers] = useState<string[]>([]);
  const [currentNumber, setCurrentNumber] = useState<string | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>(() => 
    Array.from({ length: 75 }, (_, i) => i + 1)
  );

  function generateBingoCard(): (number | null)[][] {
    const card: (number | null)[][] = Array(5).fill(null).map(() => Array(5).fill(null));
    
    // Generate numbers for each column
    const columns = [
      Array.from({ length: 15 }, (_, i) => i + 1),  // B: 1-15
      Array.from({ length: 15 }, (_, i) => i + 16), // I: 16-30
      Array.from({ length: 15 }, (_, i) => i + 31), // N: 31-45
      Array.from({ length: 15 }, (_, i) => i + 46), // G: 46-60
      Array.from({ length: 15 }, (_, i) => i + 61), // O: 61-75
    ];

    // Fill each column with 5 random numbers
    for (let col = 0; col < 5; col++) {
      const shuffled = [...columns[col]].sort(() => Math.random() - 0.5);
      for (let row = 0; row < 5; row++) {
        if (row === 2 && col === 2) {
          // Free space in the center
          card[row][col] = null;
        } else {
          card[row][col] = shuffled[row];
        }
      }
    }

    return card;
  }

  const generateNewCard = useCallback(() => {
    setBingoCard(generateBingoCard());
    setMarkedNumbers(new Set());
  }, []);

  const startGame = useCallback(() => {
    setIsGameActive(true);
    console.log('Game started!');
  }, []);

  const getColumnLetter = (number: number): string => {
    if (number >= 1 && number <= 15) return 'B';
    if (number >= 16 && number <= 30) return 'I';
    if (number >= 31 && number <= 45) return 'N';
    if (number >= 46 && number <= 60) return 'G';
    if (number >= 61 && number <= 75) return 'O';
    return '';
  };

  const callNextNumber = useCallback(() => {
    if (availableNumbers.length === 0) {
      console.log('All numbers have been called!');
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const number = availableNumbers[randomIndex];
    const letter = getColumnLetter(number);
    const calledNumber = `${letter}-${number}`;

    setIsAnimating(true);
    setCurrentNumber(calledNumber);
    setCalledNumbers(prev => [...prev, calledNumber]);
    setAvailableNumbers(prev => prev.filter((_, index) => index !== randomIndex));

    // Announce the number
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${letter} ${number}`);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }

    // Stop animation after 2 seconds
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);

    console.log(`Called: ${calledNumber}`);
  }, [availableNumbers]);

  const markNumber = useCallback((number: number) => {
    if (calledNumbers.some(called => called.includes(number.toString()))) {
      setMarkedNumbers(prev => {
        const newSet = new Set(prev);
        if (newSet.has(number)) {
          newSet.delete(number);
        } else {
          newSet.add(number);
        }
        return newSet;
      });
      console.log(`Marked/Unmarked: ${number}`);
    } else {
      console.log(`Number ${number} hasn't been called yet!`);
    }
  }, [calledNumbers]);

  const resetGame = useCallback(() => {
    setMarkedNumbers(new Set());
    setCalledNumbers([]);
    setCurrentNumber(null);
    setIsGameActive(false);
    setIsAnimating(false);
    setAvailableNumbers(Array.from({ length: 75 }, (_, i) => i + 1));
    console.log('Game reset!');
  }, []);

  return {
    bingoCard,
    markedNumbers,
    calledNumbers,
    currentNumber,
    isGameActive,
    isAnimating,
    availableNumbers,
    startGame,
    callNextNumber,
    markNumber,
    resetGame,
    generateNewCard,
  };
};

export default useBingoGame;
