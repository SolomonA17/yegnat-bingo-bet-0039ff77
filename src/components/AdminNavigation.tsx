
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  CreditCard, 
  Wallet, 
  BarChart3, 
  Settings, 
  LogOut,
  Shield
} from 'lucide-react';

const AdminNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { adminRole, isAdmin, isSuperAdmin, isCashier } = useAdminRole();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: Home,
      path: '/admin',
      roles: ['super_admin', 'admin', 'cashier']
    },
    {
      label: 'Cards',
      icon: CreditCard,
      path: '/admin/cards',
      roles: ['super_admin', 'admin', 'cashier']
    },
    {
      label: 'Transactions',
      icon: Wallet,
      path: '/admin/transactions',
      roles: ['super_admin', 'admin', 'cashier']
    },
    {
      label: 'Users',
      icon: Users,
      path: '/admin/users',
      roles: ['super_admin', 'admin']
    },
    {
      label: 'Reports',
      icon: BarChart3,
      path: '/admin/reports',
      roles: ['super_admin', 'admin']
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      roles: ['super_admin', 'admin']
    }
  ];

  const canAccessRoute = (roles: string[]) => {
    return adminRole && roles.includes(adminRole.role);
  };

  return (
    <div className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-ethiopian-green mr-1"></div>
              <div className="w-6 h-6 rounded-full bg-ethiopian-yellow mr-1"></div>
              <div className="w-6 h-6 rounded-full bg-ethiopian-red"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-ethiopian-dark">Ethiopian Bingo</h1>
              <p className="text-xs text-gray-600">Admin System</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              canAccessRoute(item.roles) && (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 ${
                    location.pathname === item.path 
                      ? 'bg-ethiopian-green text-white' 
                      : 'text-gray-600 hover:text-ethiopian-green'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              )
            ))}
          </nav>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-ethiopian-dark">
                {user?.user_metadata?.full_name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-600 flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                {adminRole?.role?.replace('_', ' ').toUpperCase()}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;
