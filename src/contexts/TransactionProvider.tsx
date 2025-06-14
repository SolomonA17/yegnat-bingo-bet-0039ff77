
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface TransactionContextType {
  balance: number;
  loading: boolean;
  refreshBalance: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshBalance = async () => {
    // This would fetch balance from Supabase in a real implementation
    // For now, just mock it
    setLoading(true);
    setTimeout(() => {
      setBalance(1000); // Mock balance
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (user) {
      refreshBalance();
    }
  }, [user]);

  const value = {
    balance,
    loading,
    refreshBalance,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
