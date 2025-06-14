
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const GameResultsManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: gameResults, isLoading } = useQuery({
    queryKey: ['game-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_results')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createResultMutation = useMutation({
    mutationFn: async (newResult) => {
      const { data, error } = await supabase
        .from('game_results')
        .insert([newResult])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-results'] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Game result created successfully",
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

  const publishResultMutation = useMutation({
    mutationFn: async (resultId) => {
      const { data, error } = await supabase
        .from('game_results')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', resultId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-results'] });
      toast({
        title: "Success",
        description: "Game result published successfully",
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const calledNumbers = formData.get('calledNumbers')
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n));

    const newResult = {
      game_date: formData.get('gameDate'),
      draw_number: parseInt(formData.get('drawNumber')),
      called_numbers: calledNumbers,
      winning_cards: formData.get('winningCards') ? 
        formData.get('winningCards').split(',').map(c => c.trim()) : [],
      total_prize_pool: parseFloat(formData.get('prizePool')) || 0,
      status: 'pending'
    };

    createResultMutation.mutate(newResult);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading game results...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Game Results</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ethiopian-green hover:bg-ethiopian-green/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Result
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Game Result</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Game Date</label>
                <Input name="gameDate" type="date" required />
              </div>
              <div>
                <label className="text-sm font-medium">Draw Number</label>
                <Input name="drawNumber" type="number" required />
              </div>
              <div>
                <label className="text-sm font-medium">Called Numbers (comma separated)</label>
                <Input name="calledNumbers" placeholder="1,5,12,25,..." required />
              </div>
              <div>
                <label className="text-sm font-medium">Winning Cards (comma separated)</label>
                <Input name="winningCards" placeholder="C-20241214-ABC123,..." />
              </div>
              <div>
                <label className="text-sm font-medium">Prize Pool (ETB)</label>
                <Input name="prizePool" type="number" step="0.01" />
              </div>
              <Button type="submit" className="w-full bg-ethiopian-green hover:bg-ethiopian-green/90">
                Create Result
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Game Date</TableHead>
              <TableHead>Draw #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prize Pool</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gameResults?.map((result) => (
              <TableRow key={result.id}>
                <TableCell>{new Date(result.game_date).toLocaleDateString()}</TableCell>
                <TableCell>{result.draw_number}</TableCell>
                <TableCell>
                  <Badge variant={result.status === 'published' ? 'default' : 'secondary'}>
                    {result.status}
                  </Badge>
                </TableCell>
                <TableCell>{result.total_prize_pool} ETB</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {result.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => publishResultMutation.mutate(result.id)}
                        className="bg-ethiopian-green hover:bg-ethiopian-green/90"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GameResultsManager;
