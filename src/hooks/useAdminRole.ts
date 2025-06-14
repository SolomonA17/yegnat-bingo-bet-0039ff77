
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AdminRole {
  role: 'super_admin' | 'admin' | 'cashier';
  isActive: boolean;
}

export const useAdminRole = () => {
  const { user } = useAuth();
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCashier, setIsCashier] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    console.log('useAdminRole - user changed:', user?.id);
    if (user) {
      fetchAdminRole();
    } else {
      console.log('useAdminRole - no user, resetting state');
      setAdminRole(null);
      setIsAdmin(false);
      setIsCashier(false);
      setIsSuperAdmin(false);
      setLoading(false);
    }
  }, [user]);

  const fetchAdminRole = async () => {
    if (!user) {
      console.log('fetchAdminRole - no user');
      return;
    }

    console.log('fetchAdminRole - fetching for user:', user.id);
    setLoading(true);

    try {
      // Use select() instead of single() to handle multiple roles
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true);

      console.log('fetchAdminRole - query result:', { data, error });

      if (error) {
        console.error('Error fetching admin role:', error);
        setAdminRole(null);
        setIsAdmin(false);
        setIsCashier(false);
        setIsSuperAdmin(false);
      } else if (data && data.length > 0) {
        // Take the highest priority role (super_admin > admin > cashier)
        const roleHierarchy = { 'super_admin': 3, 'admin': 2, 'cashier': 1 };
        const highestRole = data.reduce((prev, current) => {
          return roleHierarchy[current.role] > roleHierarchy[prev.role] ? current : prev;
        });

        console.log('fetchAdminRole - user has roles:', data, 'using highest:', highestRole.role);
        const mappedRole: AdminRole = {
          role: highestRole.role,
          isActive: highestRole.is_active
        };
        setAdminRole(mappedRole);
        setIsAdmin(highestRole.role === 'admin' || highestRole.role === 'super_admin');
        setIsCashier(highestRole.role === 'cashier');
        setIsSuperAdmin(highestRole.role === 'super_admin');
      } else {
        console.log('fetchAdminRole - no role found for user');
        setAdminRole(null);
        setIsAdmin(false);
        setIsCashier(false);
        setIsSuperAdmin(false);
      }
    } catch (error) {
      console.error('Error fetching admin role:', error);
      setAdminRole(null);
      setIsAdmin(false);
      setIsCashier(false);
      setIsSuperAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const hasAnyAdminRole = () => {
    const result = isAdmin || isCashier || isSuperAdmin;
    console.log('hasAnyAdminRole:', { isAdmin, isCashier, isSuperAdmin, result });
    return result;
  };

  const canAccess = (requiredRoles: string[]) => {
    if (!adminRole) {
      console.log('canAccess - no admin role');
      return false;
    }
    const result = requiredRoles.includes(adminRole.role);
    console.log('canAccess:', { requiredRoles, userRole: adminRole.role, result });
    return result;
  };

  return {
    adminRole,
    loading,
    isAdmin,
    isCashier,
    isSuperAdmin,
    hasAnyAdminRole,
    canAccess,
    refetch: fetchAdminRole
  };
};
