
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminRole } from '@/hooks/useAdminRole';
import GameResultsManager from './GameResultsManager';
import CartelasManager from './CartelasManager';
import CartelaGroupsManager from './CartelaGroupsManager';
import CreditReportsManager from './CreditReportsManager';
import UserAccountsManager from './UserAccountsManager';
import AdminStatsOverview from './AdminStatsOverview';
import { 
  Trophy, 
  CreditCard, 
  Users, 
  DollarSign, 
  BarChart3,
  Settings
} from 'lucide-react';

const AdminMainPanel = () => {
  const { isSuperAdmin, isAdmin, isCashier } = useAdminRole();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ethiopian-dark mb-2">
            Ethiopian Bingo Admin Panel
          </h1>
          <p className="text-gray-600">
            Manage your bingo operations, users, and transactions
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Data
            </TabsTrigger>
            <TabsTrigger value="credits" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Credits
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="cartelas" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Cartelas
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <AdminStatsOverview />
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-ethiopian-green">Game Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <GameResultsManager />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-ethiopian-yellow">Cartela Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <CartelaGroupsManager />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Credit Reports Tab */}
          <TabsContent value="credits">
            <CreditReportsManager />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            {(isSuperAdmin || isAdmin) ? (
              <UserAccountsManager />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">Access denied. Administrator privileges required.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Cartelas Tab */}
          <TabsContent value="cartelas">
            <CartelasManager />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            {(isSuperAdmin || isAdmin) ? (
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">System configuration options will be available here.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">Access denied. Administrator privileges required.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminMainPanel;
