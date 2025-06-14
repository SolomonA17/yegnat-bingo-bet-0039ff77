
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Heart, Lock, User, Phone, ArrowLeft } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
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

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-ethiopian-dark flex items-center justify-center">
              {isForgotPassword && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsForgotPassword(false)}
                  className="mr-2 p-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              {getCardTitle()}
            </CardTitle>
            <CardDescription>
              {getCardDescription()}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !isForgotPassword && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ethiopian-dark flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
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
                {loading ? 'Please wait...' : (
                  isForgotPassword ? 'Send Reset Instructions' : 
                  (isLogin ? 'Sign In' : 'Create Account')
                )}
              </Button>
            </form>

            {!isForgotPassword && (
              <div className="mt-6 space-y-4">
                {isLogin && (
                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={() => setIsForgotPassword(true)}
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
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-ethiopian-green hover:text-ethiopian-green/80"
                  >
                    {isLogin ? 'Sign up here' : 'Sign in here'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
