
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransaction } from '@/contexts/TransactionContext';
import { useToast } from '@/hooks/use-toast';
import { Shield, CheckCircle } from 'lucide-react';

interface TransactionConfirmationProps {
  transactionId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TransactionConfirmation: React.FC<TransactionConfirmationProps> = ({
  transactionId,
  onSuccess,
  onCancel,
}) => {
  const { confirmTransaction } = useTransaction();
  const { toast } = useToast();
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confirmationCode) {
      toast({
        title: "Missing Code",
        description: "Please enter the confirmation code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const result = await confirmTransaction(transactionId, confirmationCode);
    
    if (result.success) {
      toast({
        title: "Transaction Confirmed",
        description: "Your transaction has been processed successfully.",
      });
      onSuccess?.();
    } else {
      toast({
        title: "Confirmation Failed",
        description: result.error || "Invalid confirmation code.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <Card className="shadow-lg max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-ethiopian-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Shield className="w-8 h-8 text-ethiopian-green" />
        </div>
        <CardTitle className="text-lg text-ethiopian-dark">
          Confirm Transaction
        </CardTitle>
        <p className="text-sm text-gray-600">
          Enter the confirmation code sent to your phone
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ethiopian-dark">Confirmation Code</label>
            <Input
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="text-center text-lg font-mono"
              required
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-ethiopian-green hover:bg-ethiopian-green/90"
              disabled={loading}
            >
              {loading ? 'Confirming...' : 'Confirm'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionConfirmation;
