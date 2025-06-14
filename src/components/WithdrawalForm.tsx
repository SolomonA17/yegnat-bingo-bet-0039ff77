
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransaction, PaymentMethod } from '@/contexts/TransactionContext';
import { useToast } from '@/hooks/use-toast';
import { Banknote, Phone, Building2 } from 'lucide-react';

const WithdrawalForm: React.FC = () => {
  const { createWithdrawal, balance } = useTransaction();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('telebirr');
  const [accountDetails, setAccountDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { value: 'telebirr', label: 'TeleBirr', icon: Phone, color: 'bg-blue-500', placeholder: 'TeleBirr phone number' },
    { value: 'cbe', label: 'Commercial Bank of Ethiopia', icon: Building2, color: 'bg-green-600', placeholder: 'CBE account number' },
    { value: 'awash', label: 'Awash Bank', icon: Building2, color: 'bg-orange-500', placeholder: 'Awash account number' },
    { value: 'dashen', label: 'Dashen Bank', icon: Building2, color: 'bg-purple-600', placeholder: 'Dashen account number' },
    { value: 'bank_of_abyssinia', label: 'Bank of Abyssinia', icon: Building2, color: 'bg-red-600', placeholder: 'BOA account number' },
  ];

  const selectedMethod = paymentMethods.find(m => m.value === paymentMethod);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !accountDetails) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const withdrawalAmount = parseFloat(amount);
    if (withdrawalAmount <= 0 || withdrawalAmount < 50) {
      toast({
        title: "Invalid Amount",
        description: "Minimum withdrawal amount is 50 ETB.",
        variant: "destructive",
      });
      return;
    }

    if (withdrawalAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You can only withdraw up to ${balance.toFixed(2)} ETB.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const result = await createWithdrawal(withdrawalAmount, paymentMethod, accountDetails);
    
    if (result.success) {
      setAmount('');
      setAccountDetails('');
      toast({
        title: "Withdrawal Initiated",
        description: "Your withdrawal request has been submitted for processing.",
      });
    } else {
      toast({
        title: "Withdrawal Failed",
        description: result.error || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg text-ethiopian-dark">
          <Banknote className="w-5 h-5 mr-2" />
          Withdraw Money
        </CardTitle>
        <p className="text-sm text-gray-600">
          Available Balance: <span className="font-semibold text-ethiopian-green">{balance.toFixed(2)} ETB</span>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ethiopian-dark">Amount (ETB)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (minimum 50 ETB)"
              min="50"
              max={balance}
              step="0.01"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum withdrawal: {balance.toFixed(2)} ETB
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-ethiopian-dark mb-2 block">Withdrawal Method</label>
            <div className="grid grid-cols-1 gap-2">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value as PaymentMethod)}
                    className={`flex items-center p-3 rounded-lg border transition-all ${
                      paymentMethod === method.value
                        ? 'border-ethiopian-green bg-green-50 text-ethiopian-green'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${method.color} flex items-center justify-center mr-3`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-ethiopian-dark">
              {paymentMethod === 'telebirr' ? 'Phone Number' : 'Account Number'}
            </label>
            <Input
              type="text"
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              placeholder={selectedMethod?.placeholder}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-ethiopian-red hover:bg-ethiopian-red/90"
            disabled={loading || balance < 50}
          >
            {loading ? 'Processing...' : `Withdraw ${amount ? parseFloat(amount).toFixed(2) : '0.00'} ETB`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WithdrawalForm;
