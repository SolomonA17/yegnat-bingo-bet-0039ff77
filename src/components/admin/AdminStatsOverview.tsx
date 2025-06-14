
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  DollarSign,
  Trophy,
  Activity
} from 'lucide-react';

const AdminStatsOverview = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: totalAgents },
        { count: totalCartelas },
        { count: activeGames },
        { data: totalCredits },
        { count: pendingResults }
      ] = await Promise.all([
        supabase.from('agents').select('*', { count: 'exact', head: true }),
        supabase.from('bingo_cards').select('*', { count: 'exact', head: true }),
        supabase.from('game_results').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('credit_transactions').select('amount').eq('transaction_type', 'received'),
        supabase.from('game_results').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      const totalCreditAmount = totalCredits?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      return {
        totalAgents: totalAgents || 0,
        totalCartelas: totalCartelas || 0,
        activeGames: activeGames || 0,
        totalCredits: totalCreditAmount,
        pendingResults: pendingResults || 0
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Agents',
      value: stats?.totalAgents || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Cartelas',
      value: stats?.totalCartelas || 0,
      icon: CreditCard,
      color: 'text-ethiopian-green',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Games',
      value: stats?.activeGames || 0,
      icon: Activity,
      color: 'text-ethiopian-yellow',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total Credits (ETB)',
      value: `${(stats?.totalCredits || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Results',
      value: stats?.pendingResults || 0,
      icon: Trophy,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Growth',
      value: '+12%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-l-4 border-l-ethiopian-green">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-ethiopian-dark">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ethiopian-dark">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-ethiopian-green rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New game result published</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-ethiopian-yellow rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Credit transaction completed</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-ethiopian-red rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New agent registered</p>
                <p className="text-xs text-gray-500">10 minutes ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatsOverview;
