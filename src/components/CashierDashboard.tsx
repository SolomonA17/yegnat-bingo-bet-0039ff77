
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Wallet, Printer, Search } from 'lucide-react';
import BingoCardIssuer from './BingoCardIssuer';

const CashierDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ethiopian-dark">Cashier Dashboard</h1>
          <p className="text-gray-600">Handle card issuance and transactions</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cards Issued Today</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ethiopian-green">23</div>
            <p className="text-xs text-muted-foreground">230 ETB collected</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ethiopian-yellow">45</div>
            <p className="text-xs text-muted-foreground">15 deposits, 8 withdrawals</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Games</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ethiopian-red">3</div>
            <p className="text-xs text-muted-foreground">67 active players</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Issuer */}
        <div>
          <BingoCardIssuer />
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-ethiopian-green hover:bg-ethiopian-green/90"
              size="lg"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Process Deposit
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-ethiopian-yellow text-ethiopian-yellow hover:bg-ethiopian-yellow hover:text-white"
              size="lg"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Process Withdrawal
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-ethiopian-red text-ethiopian-red hover:bg-ethiopian-red hover:text-white"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Verify Card
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Today's Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Card C-20250614-XYZ789 issued</p>
                <p className="text-sm text-gray-600">Player: Ahmed Mohammed (+251912345678)</p>
              </div>
              <span className="text-green-600 font-semibold">10 ETB</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Deposit processed</p>
                <p className="text-sm text-gray-600">Player #456 - Cash deposit</p>
              </div>
              <span className="text-green-600 font-semibold">+500 ETB</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Withdrawal processed</p>
                <p className="text-sm text-gray-600">Player #123 - Cash withdrawal</p>
              </div>
              <span className="text-red-600 font-semibold">-200 ETB</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashierDashboard;
