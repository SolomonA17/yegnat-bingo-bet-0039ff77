
import React from 'react';
import { Heart } from 'lucide-react';

const AuthHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="w-8 h-8 rounded-full bg-ethiopian-green mr-2"></div>
        <div className="w-8 h-8 rounded-full bg-ethiopian-yellow mr-2"></div>
        <div className="w-8 h-8 rounded-full bg-ethiopian-red"></div>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">
        <span className="text-ethiopian-green">Ethiopian</span>{' '}
        <span className="text-ethiopian-yellow">Bingo</span>
      </h1>
      
      <div className="flex items-center justify-center text-ethiopian-red">
        <Heart className="w-4 h-4 mr-2 fill-current" />
        <span className="text-sm">Welcome to our community</span>
      </div>
    </div>
  );
};

export default AuthHeader;
