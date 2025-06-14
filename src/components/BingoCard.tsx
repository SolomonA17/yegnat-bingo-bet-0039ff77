
import React from 'react';

interface BingoCardProps {
  numbers: (number | null)[][];
  markedNumbers: Set<number>;
  onCellClick: (number: number) => void;
}

const BingoCard: React.FC<BingoCardProps> = ({ numbers, markedNumbers, onCellClick }) => {
  const headers = ['B', 'I', 'N', 'G', 'O'];

  return (
    <div className="bg-white rounded-lg shadow-xl border-4 border-ethiopian-green/20 overflow-hidden">
      {/* Header Row */}
      <div className="grid grid-cols-5 bg-gradient-to-r from-ethiopian-green via-ethiopian-yellow to-ethiopian-red">
        {headers.map((letter, index) => (
          <div 
            key={index}
            className="h-12 flex items-center justify-center text-white font-bold text-xl border-r border-white/20 last:border-r-0"
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Bingo Grid */}
      <div className="grid grid-cols-5">
        {numbers.map((row, rowIndex) =>
          row.map((number, colIndex) => {
            const isMarked = number && markedNumbers.has(number);
            const isFreeSpace = rowIndex === 2 && colIndex === 2;

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => number && onCellClick(number)}
                disabled={isFreeSpace}
                className={`
                  h-16 sm:h-20 bingo-cell flex items-center justify-center text-lg sm:text-xl font-semibold
                  border border-gray-200 hover:bg-gray-50
                  ${isMarked ? 'marked' : ''}
                  ${isFreeSpace ? 'bg-ethiopian-yellow text-white cursor-default' : 'cursor-pointer'}
                `}
              >
                {isFreeSpace ? '★' : number}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BingoCard;
