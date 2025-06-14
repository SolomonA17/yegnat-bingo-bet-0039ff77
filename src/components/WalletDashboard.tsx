import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTransaction } from '@/contexts/TransactionContext';
import DepositForm from './DepositForm';
import WithdrawalForm from './WithdrawalForm';
import TransactionHistory from './TransactionHistory';
import { Wallet, Plus, Minus, RefreshCw } from 'lucide-react';

type ActiveTab = 'overview' | 'deposit' | 'withdraw' | 'history';

const WalletDashboard: React.FC = () => {
  const { balance, refreshBalance, loading } = useTransaction();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Handle URL parameters for direct navigation
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['deposit', 'withdraw', 'history'].includes(tab)) {
      setActiveTab(tab as ActiveTab);
    }
  }, [searchParams]);

  const handleRefresh = () => {
    refreshBalance();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'deposit':
        return <DepositForm />;
      case 'withdraw':
        return <WithdrawalForm />;
      case 'history':
        return <TransactionHistory />;
      default:
        return (
          <div className="space-y-6">
            <Card className="shadow-lg bg-gradient-to-r from-ethiopian-green to-ethiopian-yellow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm opacity-90">Your Balance</p>
                    <p className="text-3xl font-bold">{balance.toFixed(2)} ETB</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleRefresh}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      disabled={loading}
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Wallet className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setActiveTab('deposit')}
                className="h-24 bg-green-600 hover:bg-green-700 text-white flex-col"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-lg">Deposit Money</span>
              </Button>
              
              <Button
                onClick={() => setActiveTab('withdraw')}
                variant="outline"
                className="h-24 border-red-600 text-red-600 hover:bg-red-50 flex-col"
                disabled={balance < 50}
              >
                <Minus className="w-8 h-8 mb-2" />
                <span className="text-lg">Withdraw Money</span>
              </Button>
            </div>

            <TransactionHistory />
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ethiopian-dark flex items-center">
          <Wallet className="w-6 h-6 mr-2" />
          My Wallet
        </h1>
        
        {activeTab !== 'overview' && (
          <Button
            onClick={() => setActiveTab('overview')}
            variant="outline"
            size="sm"
          >
            Back to Overview
          </Button>
        )}
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 border-b">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'deposit', label: 'Deposit' },
            { key: 'withdraw', label: 'Withdraw' },
            { key: 'history', label: 'History' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as ActiveTab)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-ethiopian-green text-ethiopian-green'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default WalletDashboard;
