
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
    if (user) {
      fetchAdminRole();
    } else {
      setAdminRole(null);
      setIsAdmin(false);
      setIsCashier(false);
      setIsSuperAdmin(false);
      setLoading(false);
    }
  }, [user]);

  const fetchAdminRole = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching admin role:', error);
        setAdminRole(null);
      } else if (data) {
        const mappedRole: AdminRole = {
          role: data.role,
          isActive: data.is_active
        };
        setAdminRole(mappedRole);
        setIsAdmin(data.role === 'admin' || data.role === 'super_admin');
        setIsCashier(data.role === 'cashier');
        setIsSuperAdmin(data.role === 'super_admin');
      } else {
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
    return isAdmin || isCashier || isSuperAdmin;
  };

  const canAccess = (requiredRoles: string[]) => {
    if (!adminRole) return false;
    return requiredRoles.includes(adminRole.role);
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
