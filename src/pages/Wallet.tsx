
import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import WalletDashboard from '@/components/WalletDashboard';

const Wallet = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
      <NavigationBar />
      <WalletDashboard />
    </div>
  );
};

export default Wallet;
