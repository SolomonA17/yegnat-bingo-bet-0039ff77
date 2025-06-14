
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  LogOut, 
  User, 
  Settings,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminNavigation = () => {
  const { signOut, user } = useAuth();
  const { adminRole, isSuperAdmin, isAdmin, isCashier } = useAdminRole();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const getRoleDisplay = () => {
    if (isSuperAdmin) return 'Super Admin';
    if (isAdmin) return 'Admin';
    if (isCashier) return 'Cashier';
    return 'Staff';
  };

  const getRoleColor = () => {
    if (isSuperAdmin) return 'text-red-600 bg-red-50 border-red-200';
    if (isAdmin) return 'text-green-600 bg-green-50 border-green-200';
    if (isCashier) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-ethiopian-green" />
              <div>
                <h1 className="text-xl font-bold text-ethiopian-dark">
                  Ethiopian Bingo
                </h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Center - Role Badge */}
          <div className={`px-4 py-2 rounded-full border ${getRoleColor()}`}>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">{getRoleDisplay()}</span>
            </div>
          </div>

          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.user_metadata?.full_name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.phone || user?.email}
                </p>
              </div>
              <div className="w-8 h-8 bg-ethiopian-green rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>

            {/* Sign Out */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
