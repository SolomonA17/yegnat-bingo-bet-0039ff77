
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransaction, PaymentMethod } from '@/contexts/TransactionContext';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Phone, Building2 } from 'lucide-react';

const DepositForm: React.FC = () => {
  const { createDeposit } = useTransaction();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('telebirr');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { value: 'telebirr', label: 'TeleBirr', icon: Phone, color: 'bg-blue-500' },
    { value: 'cbe', label: 'Commercial Bank of Ethiopia', icon: Building2, color: 'bg-green-600' },
    { value: 'awash', label: 'Awash Bank', icon: Building2, color: 'bg-orange-500' },
    { value: 'dashen', label: 'Dashen Bank', icon: Building2, color: 'bg-purple-600' },
    { value: 'bank_of_abyssinia', label: 'Bank of Abyssinia', icon: Building2, color: 'bg-red-600' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const depositAmount = parseFloat(amount);
    if (depositAmount <= 0 || depositAmount < 10) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is 10 ETB.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const result = await createDeposit(depositAmount, paymentMethod, phoneNumber);
    
    if (result.success) {
      setAmount('');
      setPhoneNumber('');
      toast({
        title: "Deposit Initiated",
        description: "Please check your phone for the confirmation code.",
      });
    } else {
      toast({
        title: "Deposit Failed",
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
          <CreditCard className="w-5 h-5 mr-2" />
          Deposit Money
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ethiopian-dark">Amount (ETB)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (minimum 10 ETB)"
              min="10"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ethiopian-dark mb-2 block">Payment Method</label>
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
            <label className="text-sm font-medium text-ethiopian-dark">Phone Number</label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {paymentMethod === 'telebirr' 
                ? 'Enter your TeleBirr registered phone number' 
                : 'Enter your phone number for confirmation'
              }
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-ethiopian-green hover:bg-ethiopian-green/90"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Deposit ${amount ? parseFloat(amount).toFixed(2) : '0.00'} ETB`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DepositForm;
