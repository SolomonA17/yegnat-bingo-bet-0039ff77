
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, ArrowUp, ArrowDown, DollarSign, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NewTransaction {
  transaction_type: string;
  from_user: string | null;
  to_user: string | null;
  amount: number;
  purpose: string;
  notes: string;
  receipt_status: boolean;
}

const CreditReportsManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('sent_to_agent');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['credit-transactions', activeTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select(`
          *,
          from_user:profiles!credit_transactions_from_user_fkey(full_name, phone_number),
          to_user:profiles!credit_transactions_to_user_fkey(full_name, phone_number)
        `)
        .eq('transaction_type', activeTab)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: users } = useQuery({
    queryKey: ['users-for-credit'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone_number')
        .order('full_name');
      
      if (error) throw error;
      return data;
    }
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (newTransaction: NewTransaction) => {
      const { data, error } = await supabase
        .from('credit_transactions')
        .insert([newTransaction])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-transactions'] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Credit transaction recorded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createTransactionMutation.mutate({
      transaction_type: activeTab,
      from_user: (formData.get('fromUser') as string) || null,
      to_user: (formData.get('toUser') as string) || null,
      amount: parseFloat(formData.get('amount') as string),
      purpose: formData.get('purpose') as string,
      notes: formData.get('notes') as string,
      receipt_status: formData.get('receiptStatus') === 'true'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sent_to_agent':
      case 'sent_to_shop':
        return <ArrowUp className="w-4 h-4 text-red-500" />;
      case 'received':
        return <ArrowDown className="w-4 h-4 text-green-500" />;
      case 'recharge':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const tabConfig = [
    { value: 'sent_to_agent', label: 'Sent to Agent', icon: ArrowUp },
    { value: 'sent_to_shop', label: 'Sent to Shop', icon: ArrowUp },
    { value: 'received', label: 'Received', icon: ArrowDown },
    { value: 'recharge', label: 'Recharge', icon: CreditCard }
  ];

  if (isLoading) {
    return <div className="text-center py-4">Loading credit reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-ethiopian-dark">Credit Reports</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ethiopian-green hover:bg-ethiopian-green/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Credit Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Transaction Type</label>
                <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tabConfig.map((tab) => (
                      <SelectItem key={tab.value} value={tab.value}>
                        {tab.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {(activeTab === 'sent_to_agent' || activeTab === 'sent_to_shop') && (
                <div>
                  <label className="text-sm font-medium">To User</label>
                  <Select name="toUser">
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name} ({user.phone_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === 'received' && (
                <div>
                  <label className="text-sm font-medium">From User</label>
                  <Select name="fromUser">
                    <SelectTrigger>
                      <SelectValue placeholder="Select sender" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name} ({user.phone_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Amount (ETB)</label>
                <Input name="amount" type="number" step="0.01" required />
              </div>
              
              <div>
                <label className="text-sm font-medium">Purpose</label>
                <Input name="purpose" placeholder="Transaction purpose" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Input name="notes" placeholder="Additional notes" />
              </div>

              <div>
                <label className="text-sm font-medium">Receipt Status</label>
                <Select name="receiptStatus">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Received</SelectItem>
                    <SelectItem value="false">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-ethiopian-green hover:bg-ethiopian-green/90">
                Record Transaction
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          {tabConfig.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabConfig.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions?.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {transaction.from_user?.full_name || 'System'}
                        </TableCell>
                        <TableCell>
                          {transaction.to_user?.full_name || 'System'}
                        </TableCell>
                        <TableCell className="font-mono">
                          {getTransactionIcon(transaction.transaction_type)}
                          <span className="ml-2">{transaction.amount} ETB</span>
                        </TableCell>
                        <TableCell>{transaction.purpose || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.receipt_status ? 'default' : 'secondary'}>
                            {transaction.receipt_status ? 'Received' : 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CreditReportsManager;
