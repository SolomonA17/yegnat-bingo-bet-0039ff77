
import React from 'react';

interface NumberDisplayProps {
  currentNumber: string | null;
  isAnimating: boolean;
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ currentNumber, isAnimating }) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-ethiopian-dark mb-4">Called Number</h2>
      <div className={`
        w-32 h-32 mx-auto rounded-full bg-white border-4 border-ethiopian-green
        flex items-center justify-center shadow-lg
        ${isAnimating ? 'number-call pulse-glow' : ''}
      `}>
        {currentNumber ? (
          <span className="text-4xl font-bold text-ethiopian-green">
            {currentNumber}
          </span>
        ) : (
          <span className="text-xl text-gray-400">
            Ready
          </span>
        )}
      </div>
    </div>
  );
};

export default NumberDisplay;
