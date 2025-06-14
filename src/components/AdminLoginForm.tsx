
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Phone, Lock, Shield } from 'lucide-react';

const AdminLoginForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const { hasAnyAdminRole, loading: roleLoading } = useAdminRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log('AdminLoginForm - user:', user);
    console.log('AdminLoginForm - roleLoading:', roleLoading);
    console.log('AdminLoginForm - hasAnyAdminRole():', hasAnyAdminRole());
  }, [user, roleLoading, hasAnyAdminRole]);

  // Redirect if already authenticated and has admin role
  useEffect(() => {
    if (user && !roleLoading) {
      console.log('User is authenticated, checking roles...');
      if (hasAnyAdminRole()) {
        console.log('User has admin role, redirecting to /admin');
        navigate('/admin');
      } else {
        console.log('User does not have admin role');
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges. Please contact your administrator.",
          variant: "destructive",
        });
      }
    }
  }, [user, hasAnyAdminRole, roleLoading, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Attempting login with phone:', phoneNumber);

    if (!phoneNumber.startsWith('+')) {
      toast({
        title: "Invalid phone number",
        description: "Please include country code (e.g., +251 for Ethiopia)",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await signIn(phoneNumber, password);
      console.log('Sign in result:', { error });
      
      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login failed",
          description: error.message || "Invalid credentials or insufficient privileges",
          variant: "destructive",
        });
      } else {
        console.log('Login successful, auth state should update automatically');
        toast({
          title: "Login successful",
          description: "Welcome to the admin system",
        });
      }
    } catch (error) {
      console.error('Login exception:', error);
      toast({
        title: "Login error",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-ethiopian-green" />
          </div>
          <CardTitle className="text-2xl text-ethiopian-dark">
            Admin Access
          </CardTitle>
          <p className="text-gray-600">
            Staff login for Ethiopian Bingo system
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ethiopian-dark flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number
              </label>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+251XXXXXXXXX"
                required
              />
            </div>
            
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

            <Button
              type="submit"
              className="w-full bg-ethiopian-green hover:bg-ethiopian-green/90"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Access System'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>For authorized staff only</p>
            <p>Contact your administrator for access</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginForm;
