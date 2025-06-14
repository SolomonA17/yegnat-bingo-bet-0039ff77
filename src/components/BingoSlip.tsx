
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Calendar, User, Phone } from 'lucide-react';

interface BingoSlipProps {
  cardNumber: string;
  userName: string;
  userPhone: string;
  gameDate: string;
  cardData: (number | null)[][];
  onPrint: () => void;
}

const BingoSlip: React.FC<BingoSlipProps> = ({
  cardNumber,
  userName,
  userPhone,
  gameDate,
  cardData,
  onPrint
}) => {
  const headers = ['B', 'I', 'N', 'G', 'O'];

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-lg border-2 border-ethiopian-green/20">
        <CardHeader className="text-center bg-gradient-to-r from-ethiopian-green via-ethiopian-yellow to-ethiopian-red text-white">
          <CardTitle className="text-lg">Ethiopian Bingo Card</CardTitle>
          <p className="text-sm opacity-90">Official Game Slip</p>
        </CardHeader>
        
        <CardContent className="p-4 space-y-4">
          {/* Card Information */}
          <div className="space-y-2 border-b pb-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ethiopian-dark">Card Number:</span>
              <span className="font-mono text-lg text-ethiopian-green">{cardNumber}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-ethiopian-green" />
              <span className="text-sm">{userName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-ethiopian-green" />
              <span className="text-sm">{userPhone}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-ethiopian-green" />
              <span className="text-sm">{gameDate}</span>
            </div>
          </div>

          {/* Bingo Card Grid */}
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-5 bg-gradient-to-r from-ethiopian-green via-ethiopian-yellow to-ethiopian-red">
              {headers.map((letter, index) => (
                <div 
                  key={index}
                  className="h-8 flex items-center justify-center text-white font-bold text-sm border-r border-white/20 last:border-r-0"
                >
                  {letter}
                </div>
              ))}
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-5">
              {cardData.map((row, rowIndex) =>
                row.map((number, colIndex) => {
                  const isFreeSpace = rowIndex === 2 && colIndex === 2;
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        h-10 flex items-center justify-center text-sm font-semibold
                        border border-gray-200
                        ${isFreeSpace ? 'bg-ethiopian-yellow text-white' : 'bg-white'}
                      `}
                    >
                      {isFreeSpace ? '★' : number}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 border-t pt-3">
            <p>Keep this slip safe. Present it to claim your prize.</p>
            <p>Valid for today's game only.</p>
          </div>

          {/* Print Button */}
          <Button 
            onClick={onPrint}
            className="w-full bg-ethiopian-green hover:bg-ethiopian-green/90"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Slip
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BingoSlip;
