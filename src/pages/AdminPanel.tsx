
import React from 'react';
import { useAdminRole } from '@/hooks/useAdminRole';
import AdminNavigation from '@/components/AdminNavigation';
import AdminMainPanel from '@/components/admin/AdminMainPanel';
import CashierDashboard from '@/components/CashierDashboard';

const AdminPanel = () => {
  const { isCashier, isAdmin, isSuperAdmin } = useAdminRole();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
      <AdminNavigation />
      <div className="pt-16"> {/* Account for fixed navigation */}
        {isCashier && !isAdmin && !isSuperAdmin ? (
          <CashierDashboard />
        ) : (
          <AdminMainPanel />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
