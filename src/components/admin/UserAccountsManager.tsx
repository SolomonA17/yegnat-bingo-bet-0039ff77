
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
import { Plus, Users, Building, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NewUserAccount {
  full_name: string;
  phone_number: string;
  password: string;
  user_type: string;
  assigned_super_agent: string | null;
  initial_balance: string;
}

const UserAccountsManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('super_agent');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userAccounts, isLoading } = useQuery({
    queryKey: ['user-accounts', activeTab, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('user_accounts')
        .select(`
          *,
          profiles(full_name, phone_number),
          assigned_super_agent:profiles!user_accounts_assigned_super_agent_fkey(full_name)
        `)
        .eq('user_type', activeTab)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        // This is a simplified search - in production you'd want to join with profiles
        query = query.ilike('profiles.full_name', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const { data: superAgents } = useQuery({
    queryKey: ['super-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('user_id, profiles(full_name)')
        .eq('user_type', 'super_agent')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  });

  const createUserAccountMutation = useMutation({
    mutationFn: async (newAccount: NewUserAccount) => {
      // First create the auth user (this would typically be done through a secure endpoint)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        phone: newAccount.phone_number,
        password: newAccount.password,
        user_metadata: {
          full_name: newAccount.full_name,
          phone_number: newAccount.phone_number
        }
      });

      if (authError) throw authError;

      // Then create the user account record
      const { data, error } = await supabase
        .from('user_accounts')
        .insert([{
          user_id: authData.user.id,
          user_type: newAccount.user_type,
          assigned_super_agent: newAccount.assigned_super_agent,
          balance: parseFloat(newAccount.initial_balance) || 0
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-accounts'] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "User account created successfully",
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
    
    createUserAccountMutation.mutate({
      full_name: formData.get('fullName') as string,
      phone_number: formData.get('phoneNumber') as string,
      password: formData.get('password') as string,
      user_type: activeTab,
      assigned_super_agent: (formData.get('assignedSuperAgent') as string) || null,
      initial_balance: (formData.get('initialBalance') as string) || '0'
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const userTypes = [
    { value: 'super_agent', label: 'Super Agents', icon: Users },
    { value: 'shop', label: 'Shops', icon: Building }
  ];

  if (isLoading) {
    return <div className="text-center py-4">Loading user accounts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-ethiopian-dark">User Accounts</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ethiopian-green hover:bg-ethiopian-green/90">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create User Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input name="fullName" placeholder="Enter full name" required />
              </div>
              
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <Input name="phoneNumber" placeholder="+251XXXXXXXXX" required />
              </div>
              
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input name="password" type="password" placeholder="Enter password" required />
              </div>

              <div>
                <label className="text-sm font-medium">User Type</label>
                <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {activeTab === 'shop' && (
                <div>
                  <label className="text-sm font-medium">Assign to Super Agent</label>
                  <Select name="assignedSuperAgent">
                    <SelectTrigger>
                      <SelectValue placeholder="Select super agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {superAgents?.map((agent) => (
                        <SelectItem key={agent.user_id} value={agent.user_id}>
                          {agent.profiles?.full_name || 'Unknown Agent'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Initial Balance (ETB)</label>
                <Input name="initialBalance" type="number" step="0.01" defaultValue="0" />
              </div>

              <Button type="submit" className="w-full bg-ethiopian-green hover:bg-ethiopian-green/90">
                Create User Account
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          {userTypes.map((type) => (
            <TabsTrigger key={type.value} value={type.value} className="flex items-center gap-2">
              <type.icon className="w-4 h-4" />
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {userTypes.map((type) => (
          <TabsContent key={type.value} value={type.value}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <type.icon className="w-5 h-5" />
                  {type.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>Cartelas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userAccounts?.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">
                          {account.profiles?.full_name || 'Unknown User'}
                        </TableCell>
                        <TableCell>{account.profiles?.phone_number || 'N/A'}</TableCell>
                        <TableCell className="font-mono">{account.balance} ETB</TableCell>
                        <TableCell>{account.total_transactions}</TableCell>
                        <TableCell>{account.total_cartelas_handled}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(account.is_active)}>
                            {account.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(account.created_at).toLocaleDateString()}
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

export default UserAccountsManager;
