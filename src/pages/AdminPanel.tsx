
import React from 'react';
import { useAdminRole } from '@/hooks/useAdminRole';
import AdminNavigation from '@/components/AdminNavigation';
import AdminDashboard from '@/components/AdminDashboard';
import CashierDashboard from '@/components/CashierDashboard';

const AdminPanel = () => {
  const { isCashier, isAdmin, isSuperAdmin } = useAdminRole();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
      <AdminNavigation />
      <div className="container mx-auto px-4 py-8">
        {isCashier && !isAdmin && !isSuperAdmin ? (
          <CashierDashboard />
        ) : (
          <AdminDashboard />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
