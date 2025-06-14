
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div 
        className={`animate-spin rounded-full border-b-2 border-ethiopian-green ${sizeClasses[size]}`}
      />
      {text && (
        <p className="mt-2 text-sm text-ethiopian-dark">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
