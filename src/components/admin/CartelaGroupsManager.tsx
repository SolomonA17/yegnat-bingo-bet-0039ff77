
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, TrendingUp } from 'lucide-react';

const CartelaGroupsManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery({
    queryKey: ['cartela-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cartela_groups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createGroupMutation = useMutation({
    mutationFn: async (newGroup) => {
      const { data, error } = await supabase
        .from('cartela_groups')
        .insert([newGroup])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartela-groups'] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Group created successfully",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    createGroupMutation.mutate({
      group_name: formData.get('groupName'),
      total_cartelas: parseInt(formData.get('totalCartelas')) || 0
    });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading groups...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Cartela Groups</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ethiopian-yellow hover:bg-ethiopian-yellow/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Add Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Cartela Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Group Name</label>
                <Input name="groupName" placeholder="Enter group name" required />
              </div>
              <div>
                <label className="text-sm font-medium">Total Cartelas</label>
                <Input name="totalCartelas" type="number" min="0" />
              </div>
              <Button type="submit" className="w-full bg-ethiopian-yellow hover:bg-ethiopian-yellow/90 text-black">
                Create Group
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group Name</TableHead>
              <TableHead>Total Cartelas</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Won</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups?.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">{group.group_name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    {group.total_cartelas}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {group.sold_cartelas}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-yellow-600">
                    {group.won_cartelas}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(group.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CartelaGroupsManager;
