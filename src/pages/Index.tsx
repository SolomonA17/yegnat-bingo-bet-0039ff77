
import React from 'react';
import EthiopianHeader from '@/components/EthiopianHeader';
import BingoCard from '@/components/BingoCard';
import NumberDisplay from '@/components/NumberDisplay';
import CalledNumbersList from '@/components/CalledNumbersList';
import GameControls from '@/components/GameControls';
import UserProfile from '@/components/UserProfile';
import useBingoGame from '@/hooks/useBingoGame';

const Index = () => {
  const {
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
  } = useBingoGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <EthiopianHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Bingo Card */}
          <div className="lg:col-span-1 fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ethiopian-dark mb-4 text-center">
                Your Bingo Card
              </h2>
              <BingoCard
                numbers={bingoCard}
                markedNumbers={markedNumbers}
                onCellClick={markNumber}
              />
            </div>
            
            <div className="text-center space-y-2 mb-6">
              <p className="text-sm text-ethiopian-dark/70">
                Click numbers after they're called
              </p>
              <p className="text-xs text-ethiopian-dark/50">
                Marked: {markedNumbers.size} numbers
              </p>
            </div>

            {/* User Profile */}
            <UserProfile />
          </div>

          {/* Center Column - Game Display */}
          <div className="lg:col-span-1 fade-in">
            <NumberDisplay currentNumber={currentNumber} isAnimating={isAnimating} />
            
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-ethiopian-dark">Game Status</h3>
                  <p className="text-ethiopian-green font-medium">
                    {isGameActive ? 'Game Active' : 'Ready to Play'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-ethiopian-green">
                      {calledNumbers.length}
                    </p>
                    <p className="text-sm text-gray-600">Called</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-ethiopian-yellow">
                      {availableNumbers.length}
                    </p>
                    <p className="text-sm text-gray-600">Remaining</p>
                  </div>
                </div>
              </div>
            </div>

            <GameControls
              isGameActive={isGameActive}
              availableNumbers={availableNumbers}
              onStartGame={startGame}
              onCallNumber={callNextNumber}
              onResetGame={resetGame}
              onGenerateNewCard={generateNewCard}
            />
          </div>

          {/* Right Column - Called Numbers */}
          <div className="lg:col-span-1 fade-in">
            <h2 className="text-2xl font-bold text-ethiopian-dark mb-4 text-center">
              Called Numbers
            </h2>
            <CalledNumbersList calledNumbers={calledNumbers} />
            
            {calledNumbers.length > 0 && (
              <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
                <h4 className="font-semibold text-ethiopian-dark mb-2">Recent Calls:</h4>
                <div className="space-y-1">
                  {calledNumbers.slice(-5).reverse().map((number, index) => (
                    <div 
                      key={index} 
                      className="text-sm bg-ethiopian-green/10 px-3 py-1 rounded text-ethiopian-green"
                    >
                      {number}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 ethiopian-pattern opacity-95">
            <h3 className="text-xl font-bold text-ethiopian-dark mb-4 text-center">
              How to Play Ethiopian Bingo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-ethiopian-dark/80">
              <div className="text-center">
                <div className="w-12 h-12 bg-ethiopian-green text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                  1
                </div>
                <p><strong>Start the Game:</strong> Click "Start Game" to begin playing</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-ethiopian-yellow text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                  2
                </div>
                <p><strong>Listen for Numbers:</strong> Click "Call Next Number" to hear the next number</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-ethiopian-red text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                  3
                </div>
                <p><strong>Mark Your Card:</strong> Click numbers on your card when they're called</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
