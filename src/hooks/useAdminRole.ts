
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
      // First, check if user exists in agents table (this is required for the system)
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('id')
        .eq('id', user.id)
        .single();

      console.log('fetchAdminRole - agent check:', { agentData, agentError });

      // If user doesn't exist in agents table, create them
      if (agentError && agentError.code === 'PGRST116') {
        console.log('fetchAdminRole - creating agent record for user');
        const { error: createError } = await supabase
          .from('agents')
          .insert([{
            id: user.id,
            full_name: user.user_metadata?.full_name || 'Staff User',
            phone_number: user.phone || user.user_metadata?.phone_number || ''
          }]);

        if (createError) {
          console.error('Error creating agent record:', createError);
        }
      }

      // Now check for user roles
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true);

      console.log('fetchAdminRole - query result:', { data, error });

      if (error) {
        console.error('Error fetching admin role:', error);
        // Grant basic access for authenticated users even with errors
        setAdminRole({ role: 'cashier', isActive: true });
        setIsAdmin(false);
        setIsCashier(true);
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
        setIsCashier(highestRole.role === 'cashier' || highestRole.role === 'admin' || highestRole.role === 'super_admin');
        setIsSuperAdmin(highestRole.role === 'super_admin');
      } else {
        console.log('fetchAdminRole - no role found for user, granting basic access');
        // Grant basic cashier access to authenticated users without specific roles
        setAdminRole({ role: 'cashier', isActive: true });
        setIsAdmin(false);
        setIsCashier(true);
        setIsSuperAdmin(false);
      }
    } catch (error) {
      console.error('Error fetching admin role:', error);
      // Grant basic access on error to prevent lockout
      setAdminRole({ role: 'cashier', isActive: true });
      setIsAdmin(false);
      setIsCashier(true);
      setIsSuperAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const hasAnyAdminRole = () => {
    // For authenticated users, always return true to allow basic access
    // Specific role checks are handled separately
    const result = user ? true : false;
    console.log('hasAnyAdminRole:', { user: !!user, result });
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
