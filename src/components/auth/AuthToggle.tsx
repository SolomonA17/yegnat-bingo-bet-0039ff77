
import React from 'react';
import { Button } from '@/components/ui/button';

interface AuthToggleProps {
  isLogin: boolean;
  isForgotPassword: boolean;
  onToggleAuth: () => void;
  onForgotPassword: () => void;
}

const AuthToggle: React.FC<AuthToggleProps> = ({
  isLogin,
  isForgotPassword,
  onToggleAuth,
  onForgotPassword,
}) => {
  if (isForgotPassword) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      {isLogin && (
        <div className="text-center">
          <Button
            variant="link"
            onClick={onForgotPassword}
            className="text-ethiopian-green hover:text-ethiopian-green/80 text-sm"
          >
            Forgot your password?
          </Button>
        </div>
      )}
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
        </p>
        <Button
          variant="link"
          onClick={onToggleAuth}
          className="text-ethiopian-green hover:text-ethiopian-green/80"
        >
          {isLogin ? 'Sign up here' : 'Sign in here'}
        </Button>
      </div>
    </div>
  );
};

export default AuthToggle;
