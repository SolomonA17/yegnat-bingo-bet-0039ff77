
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthForm from '@/components/auth/AuthForm';
import AuthToggle from '@/components/auth/AuthToggle';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, user, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const reset = searchParams.get('reset');
    if (reset === 'true') {
      setIsForgotPassword(false);
      setIsLogin(true);
      toast({
        title: "Password reset",
        description: "Please check your phone for password reset instructions.",
      });
    }
  }, [searchParams, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate phone number format (must include country code)
    if (!phoneNumber.startsWith('+')) {
      toast({
        title: "Invalid phone number",
        description: "Please include country code (e.g., +1 for US)",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      if (isForgotPassword) {
        const { error } = await resetPassword(phoneNumber);
        if (error) {
          toast({
            title: "Reset failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Reset instructions sent",
            description: "Please check your phone for password reset instructions.",
          });
          setIsForgotPassword(false);
          setIsLogin(true);
        }
      } else if (isLogin) {
        const { error } = await signIn(phoneNumber, password);
        if (error) {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
        }
      } else {
        const { error } = await signUp(phoneNumber, password, fullName);
        if (error) {
          toast({
            title: "Signup failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Verification needed",
            description: "Please check your phone for a verification code.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCardTitle = () => {
    if (isForgotPassword) return 'Reset Password';
    return isLogin ? 'Welcome Back' : 'Join Us';
  };

  const getCardDescription = () => {
    if (isForgotPassword) return 'Enter your phone number to reset your password';
    return isLogin 
      ? 'Sign in to continue playing Ethiopian Bingo' 
      : 'Create your account to start playing';
  };

  const handleToggleAuth = () => {
    setIsLogin(!isLogin);
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader />

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-ethiopian-dark">
              {getCardTitle()}
            </CardTitle>
            <CardDescription>
              {getCardDescription()}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <AuthForm
              isLogin={isLogin}
              isForgotPassword={isForgotPassword}
              phoneNumber={phoneNumber}
              password={password}
              fullName={fullName}
              loading={loading}
              onPhoneNumberChange={setPhoneNumber}
              onPasswordChange={setPassword}
              onFullNameChange={setFullName}
              onSubmit={handleSubmit}
              onBackToLogin={handleBackToLogin}
            />

            <AuthToggle
              isLogin={isLogin}
              isForgotPassword={isForgotPassword}
              onToggleAuth={handleToggleAuth}
              onForgotPassword={handleForgotPassword}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
