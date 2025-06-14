
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get the phone number from user metadata if available
  const phoneNumber = user?.phone || user?.user_metadata?.phone_number || "Not available";
  const fullName = user?.user_metadata?.full_name || "Player";

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg text-ethiopian-dark">
          <User className="w-5 h-5 mr-2" />
          Player Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-gray-600">Full Name</p>
          <p className="font-medium text-ethiopian-dark">{fullName}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Phone Number</p>
          <p className="font-medium text-ethiopian-dark">{phoneNumber}</p>
        </div>
        
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="w-full border-ethiopian-red text-ethiopian-red hover:bg-ethiopian-red hover:text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
