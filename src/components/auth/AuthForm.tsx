
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Phone, Lock, ArrowLeft } from 'lucide-react';

interface AuthFormProps {
  isLogin: boolean;
  isForgotPassword: boolean;
  phoneNumber: string;
  password: string;
  fullName: string;
  loading: boolean;
  onPhoneNumberChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  isForgotPassword,
  phoneNumber,
  password,
  fullName,
  loading,
  onPhoneNumberChange,
  onPasswordChange,
  onFullNameChange,
  onSubmit,
  onBackToLogin,
}) => {
  const getButtonText = () => {
    if (loading) return 'Please wait...';
    if (isForgotPassword) return 'Send Reset Instructions';
    return isLogin ? 'Sign In' : 'Create Account';
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!isLogin && !isForgotPassword && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-ethiopian-dark flex items-center">
            <User className="w-4 h-4 mr-2" />
            Full Name
          </label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="Enter your full name"
            required={!isLogin && !isForgotPassword}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-ethiopian-dark flex items-center">
          <Phone className="w-4 h-4 mr-2" />
          Phone Number
        </label>
        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          placeholder="Enter your phone number (with country code +XXX)"
          required
        />
        <p className="text-xs text-gray-500">
          Include country code (e.g., +1 for US, +251 for Ethiopia)
        </p>
      </div>
      
      {!isForgotPassword && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-ethiopian-dark flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            Password
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-ethiopian-green hover:bg-ethiopian-green/90"
        disabled={loading}
      >
        {getButtonText()}
      </Button>

      {isForgotPassword && (
        <Button
          type="button"
          variant="ghost"
          onClick={onBackToLogin}
          className="w-full text-ethiopian-green hover:text-ethiopian-green/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      )}
    </form>
  );
};

export default AuthForm;
