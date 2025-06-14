
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CartelaGenerationParams {
  count: number;
  groupId: string | null;
  userName: string;
  userPhone: string;
}

const CartelasManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartelas, isLoading } = useQuery({
    queryKey: ['cartelas', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('bingo_cards')
        .select(`
          *,
          cartela_groups(group_name)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('card_number', `%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const { data: groups } = useQuery({
    queryKey: ['cartela-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cartela_groups')
        .select('*')
        .order('group_name');
      
      if (error) throw error;
      return data;
    }
  });

  const generateCartelasMutation = useMutation({
    mutationFn: async ({ count, groupId, userName, userPhone }: CartelaGenerationParams) => {
      const cartelas = [];
      
      for (let i = 0; i < count; i++) {
        // Generate bingo card data (5x5 grid with free space in center)
        const cardData = {
          B: Array.from({length: 5}, () => Math.floor(Math.random() * 15) + 1),
          I: Array.from({length: 5}, () => Math.floor(Math.random() * 15) + 16),
          N: [
            Math.floor(Math.random() * 15) + 31,
            Math.floor(Math.random() * 15) + 31,
            'FREE',
            Math.floor(Math.random() * 15) + 31,
            Math.floor(Math.random() * 15) + 31
          ],
          G: Array.from({length: 5}, () => Math.floor(Math.random() * 15) + 46),
          O: Array.from({length: 5}, () => Math.floor(Math.random() * 15) + 61)
        };

        cartelas.push({
          user_name: userName,
          user_phone: userPhone,
          card_data: cardData,
          group_id: groupId || null,
          user_id: '00000000-0000-0000-0000-000000000000' // placeholder
        });
      }

      const { data, error } = await supabase
        .from('bingo_cards')
        .insert(cartelas)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cartelas'] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: `Generated ${data.length} cartelas successfully`,
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
    
    generateCartelasMutation.mutate({
      count: parseInt(formData.get('count') as string),
      groupId: (formData.get('groupId') as string) || null,
      userName: formData.get('userName') as string,
      userPhone: formData.get('userPhone') as string
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'winner': return 'bg-yellow-100 text-yellow-800';
      case 'checked': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading cartelas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-ethiopian-dark">Cartelas Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ethiopian-green hover:bg-ethiopian-green/90">
              <Plus className="w-4 h-4 mr-2" />
              Generate Cartelas
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New Cartelas</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Number of Cartelas</label>
                <Input name="count" type="number" min="1" max="100" required />
              </div>
              <div>
                <label className="text-sm font-medium">User Name</label>
                <Input name="userName" placeholder="Enter user name" required />
              </div>
              <div>
                <label className="text-sm font-medium">User Phone</label>
                <Input name="userPhone" placeholder="+251XXXXXXXXX" required />
              </div>
              <div>
                <label className="text-sm font-medium">Assign to Group (Optional)</label>
                <Select name="groupId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups?.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.group_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-ethiopian-green hover:bg-ethiopian-green/90">
                Generate Cartelas
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by card number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="winner">Winner</SelectItem>
            <SelectItem value="checked">Checked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Card Number</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Matched</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartelas?.map((cartela) => (
              <TableRow key={cartela.id}>
                <TableCell className="font-mono text-sm">{cartela.card_number}</TableCell>
                <TableCell>{cartela.user_name}</TableCell>
                <TableCell>{cartela.user_phone}</TableCell>
                <TableCell>
                  {cartela.cartela_groups?.group_name || 'Unassigned'}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(cartela.status)}>
                    {cartela.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(cartela.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{cartela.matched_numbers}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CartelasManager;
