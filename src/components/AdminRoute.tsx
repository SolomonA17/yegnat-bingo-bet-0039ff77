
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';

interface AdminRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, requiredRoles = [] }) => {
  const { user, loading: authLoading } = useAuth();
  const { adminRole, loading: roleLoading, hasAnyAdminRole, canAccess } = useAdminRole();

  console.log('AdminRoute - current state:', {
    user: !!user,
    authLoading,
    roleLoading,
    adminRole,
    hasAnyAdminRole: hasAnyAdminRole(),
    requiredRoles
  });

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ethiopian-green mx-auto mb-4"></div>
          <p className="text-ethiopian-dark">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('AdminRoute - no user, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // For authenticated users, allow access to basic admin panel
  // Only restrict access for specific role requirements
  if (requiredRoles.length > 0 && adminRole && !canAccess(requiredRoles)) {
    console.log('AdminRoute - insufficient role privileges');
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ethiopian-dark mb-4">Insufficient Privileges</h1>
          <p className="text-gray-600">Your role doesn't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Required roles: {requiredRoles.join(', ')}</p>
          <p className="text-sm text-gray-500 mt-1">Your role: {adminRole?.role}</p>
        </div>
      </div>
    );
  }

  console.log('AdminRoute - access granted');
  return <>{children}</>;
};

export default AdminRoute;
