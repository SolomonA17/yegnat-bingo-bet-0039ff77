
import React from 'react';
import { Heart } from 'lucide-react';

const EthiopianHeader: React.FC = () => {
  return (
    <header className="text-center py-8 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 rounded-full bg-ethiopian-green mr-2"></div>
          <div className="w-8 h-8 rounded-full bg-ethiopian-yellow mr-2"></div>
          <div className="w-8 h-8 rounded-full bg-ethiopian-red"></div>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold mb-2">
          <span className="text-ethiopian-green">Ethiopian</span>{' '}
          <span className="text-ethiopian-yellow">Bingo</span>
        </h1>
        
        <p className="text-xl text-ethiopian-dark/80 mb-4">
          Traditional Bingo with Ethiopian Heritage
        </p>
        
        <div className="flex items-center justify-center text-ethiopian-red">
          <Heart className="w-5 h-5 mr-2 fill-current" />
          <span className="text-sm">Made with love for the Ethiopian community</span>
        </div>
      </div>
      
      {/* Decorative pattern background */}
      <div className="absolute inset-0 ethiopian-pattern opacity-10"></div>
    </header>
  );
};

export default EthiopianHeader;
