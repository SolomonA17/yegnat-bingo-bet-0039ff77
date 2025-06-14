
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { useTransaction } from '@/contexts/TransactionContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Home, 
  Plus, 
  Minus, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Wallet,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NavigationBar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useRole();
  const { balance } = useTransaction();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState(2); // Mock notification count

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
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

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: Home, 
      visible: true 
    },
    { 
      path: '/wallet?tab=deposit', 
      label: 'Deposit', 
      icon: Plus, 
      visible: true 
    },
    { 
      path: '/wallet?tab=withdraw', 
      label: 'Withdraw', 
      icon: Minus, 
      visible: true 
    },
    { 
      path: '/admin', 
      label: 'Admin', 
      icon: Settings, 
      visible: isAdmin 
    },
  ];

  const visibleMenuItems = menuItems.filter(item => item.visible);

  const fullName = user?.user_metadata?.full_name || "Player";

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-ethiopian-green via-ethiopian-yellow to-ethiopian-red shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-ethiopian-green font-bold text-lg">B</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">
                Ethiopian Bingo
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {visibleMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path.split('?')[0])
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side - Balance, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Wallet Balance */}
            <div className="hidden sm:flex items-center bg-white/20 px-3 py-1 rounded-full">
              <Wallet className="w-4 h-4 text-white mr-2" />
              <span className="text-white font-semibold">
                {balance.toFixed(2)} ETB
              </span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 relative"
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/20 flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block">{fullName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{fullName}</p>
                  <p className="text-xs text-gray-500">
                    {user?.phone || user?.user_metadata?.phone_number}
                  </p>
                  <div className="sm:hidden mt-1">
                    <p className="text-xs text-gray-600">
                      Balance: {balance.toFixed(2)} ETB
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/wallet" className="w-full flex items-center">
                    <Wallet className="w-4 h-4 mr-2" />
                    My Wallet
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/20"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-sm border-t border-white/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {visibleMenuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.path.split('?')[0])
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Balance Display */}
              <div className="px-3 py-2 border-t border-white/20 mt-3">
                <div className="flex items-center justify-between text-white">
                  <span className="text-sm">Wallet Balance:</span>
                  <span className="font-semibold">{balance.toFixed(2)} ETB</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
