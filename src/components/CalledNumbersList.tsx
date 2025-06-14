
import React from 'react';

interface CalledNumbersListProps {
  calledNumbers: string[];
}

const CalledNumbersList: React.FC<CalledNumbersListProps> = ({ calledNumbers }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-h-80 overflow-y-auto">
      <h3 className="text-lg font-bold text-ethiopian-dark mb-3 sticky top-0 bg-white">
        Called Numbers ({calledNumbers.length}/75)
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {['B', 'I', 'N', 'G', 'O'].map((letter, columnIndex) => (
          <div key={letter} className="space-y-1">
            <div className="text-center font-bold text-sm text-ethiopian-dark bg-gray-100 py-1 rounded">
              {letter}
            </div>
            {calledNumbers
              .filter(num => {
                const number = parseInt(num.split('-')[1]);
                return (
                  (columnIndex === 0 && number >= 1 && number <= 15) ||
                  (columnIndex === 1 && number >= 16 && number <= 30) ||
                  (columnIndex === 2 && number >= 31 && number <= 45) ||
                  (columnIndex === 3 && number >= 46 && number <= 60) ||
                  (columnIndex === 4 && number >= 61 && number <= 75)
                );
              })
              .map((number, index) => (
                <div
                  key={index}
                  className="text-xs bg-ethiopian-green text-white px-2 py-1 rounded text-center"
                >
                  {number.split('-')[1]}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalledNumbersList;
