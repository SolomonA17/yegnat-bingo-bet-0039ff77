
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export type TransactionType = 'deposit' | 'withdrawal' | 'bet' | 'win' | 'refund';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type PaymentMethod = 'telebirr' | 'cbe' | 'awash' | 'dashen' | 'bank_of_abyssinia';

export interface Transaction {
  id: string;
  user_id: string;
  transaction_id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  payment_method?: PaymentMethod;
  status: TransactionStatus;
  phone_number?: string;
  account_number?: string;
  confirmation_code?: string;
  reference_number?: string;
  description?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

interface TransactionContextType {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  createDeposit: (amount: number, paymentMethod: PaymentMethod, phoneNumber: string) => Promise<{ success: boolean; error?: string; transactionId?: string }>;
  createWithdrawal: (amount: number, paymentMethod: PaymentMethod, accountDetails: string) => Promise<{ success: boolean; error?: string; transactionId?: string }>;
  confirmTransaction: (transactionId: string, confirmationCode: string) => Promise<{ success: boolean; error?: string }>;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
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
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshBalance = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      setBalance(data?.balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const refreshTransactions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const createDeposit = async (amount: number, paymentMethod: PaymentMethod, phoneNumber: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const confirmationCode = Math.random().toString().substr(2, 6);
      
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_id: transactionId,
          type: 'deposit',
          amount,
          currency: 'ETB',
          payment_method: paymentMethod,
          status: 'pending',
          phone_number: phoneNumber,
          confirmation_code: confirmationCode,
          description: `Deposit via ${paymentMethod.toUpperCase()}`,
          metadata: {
            payment_method_name: getPaymentMethodName(paymentMethod),
            phone_number: phoneNumber
          }
        })
        .select()
        .single();
      
      if (error) throw error;
      
      await refreshTransactions();
      
      toast({
        title: "Deposit Initiated",
        description: `Confirmation code sent to ${phoneNumber}: ${confirmationCode}`,
      });
      
      return { success: true, transactionId: data.transaction_id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const createWithdrawal = async (amount: number, paymentMethod: PaymentMethod, accountDetails: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    if (amount > balance) {
      return { success: false, error: 'Insufficient balance' };
    }
    
    try {
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const confirmationCode = Math.random().toString().substr(2, 6);
      
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_id: transactionId,
          type: 'withdrawal',
          amount,
          currency: 'ETB',
          payment_method: paymentMethod,
          status: 'pending',
          account_number: accountDetails,
          confirmation_code: confirmationCode,
          description: `Withdrawal via ${paymentMethod.toUpperCase()}`,
          metadata: {
            payment_method_name: getPaymentMethodName(paymentMethod),
            account_details: accountDetails
          }
        })
        .select()
        .single();
      
      if (error) throw error;
      
      await refreshTransactions();
      
      toast({
        title: "Withdrawal Initiated",
        description: `Confirmation code: ${confirmationCode}`,
      });
      
      return { success: true, transactionId: data.transaction_id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const confirmTransaction = async (transactionId: string, confirmationCode: string) => {
    try {
      const { data: transaction, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('transaction_id', transactionId)
        .eq('confirmation_code', confirmationCode)
        .single();
      
      if (fetchError || !transaction) {
        return { success: false, error: 'Invalid confirmation code or transaction not found' };
      }
      
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ status: 'completed' })
        .eq('id', transaction.id);
      
      if (updateError) throw updateError;
      
      await refreshBalance();
      await refreshTransactions();
      
      toast({
        title: "Transaction Confirmed",
        description: `${transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'} of ${transaction.amount} ETB completed successfully.`,
      });
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    if (user) {
      refreshBalance();
      refreshTransactions();
      setLoading(false);
    } else {
      setBalance(0);
      setTransactions([]);
      setLoading(false);
    }
  }, [user]);

  const value = {
    balance,
    transactions,
    loading,
    createDeposit,
    createWithdrawal,
    confirmTransaction,
    refreshBalance,
    refreshTransactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

const getPaymentMethodName = (method: PaymentMethod): string => {
  const names = {
    telebirr: 'TeleBirr',
    cbe: 'Commercial Bank of Ethiopia',
    awash: 'Awash Bank',
    dashen: 'Dashen Bank',
    bank_of_abyssinia: 'Bank of Abyssinia'
  };
  return names[method];
};
