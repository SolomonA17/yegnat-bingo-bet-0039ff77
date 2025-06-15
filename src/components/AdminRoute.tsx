
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

  if (!hasAnyAdminRole()) {
    console.log('AdminRoute - user has no admin role, showing access denied');
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-ethiopian-dark mb-4">Setting Up Your Access</h1>
          <p className="text-gray-600 mb-4">
            Your account is being configured with the appropriate permissions. 
            Please contact your administrator or try refreshing the page.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Account: {user.phone || user.email}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-ethiopian-green text-white rounded hover:bg-ethiopian-green/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (requiredRoles.length > 0 && !canAccess(requiredRoles)) {
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
