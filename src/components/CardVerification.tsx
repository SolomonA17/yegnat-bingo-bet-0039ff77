
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Search, CheckCircle, XCircle, Trophy, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VerificationResult {
  isValid: boolean;
  isWinner: boolean;
  matchedNumbers: number;
  status: string;
  userName?: string;
  gameDate?: string;
}

const CardVerification: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();

  const verifyCard = async () => {
    if (!cardNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a card number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Check if card exists
      const { data: cardData, error: cardError } = await supabase
        .from('bingo_cards')
        .select('*')
        .eq('card_number', cardNumber.trim().toUpperCase())
        .single();

      if (cardError || !cardData) {
        setResult({
          isValid: false,
          isWinner: false,
          matchedNumbers: 0,
          status: 'invalid'
        });
      } else {
        setResult({
          isValid: true,
          isWinner: cardData.is_winner,
          matchedNumbers: cardData.matched_numbers,
          status: cardData.status,
          userName: cardData.user_name,
          gameDate: new Date(cardData.game_date).toLocaleDateString()
        });
      }

      // Log verification attempt
      await supabase
        .from('card_verifications')
        .insert({
          card_number: cardNumber.trim().toUpperCase(),
          verification_result: {
            found: !!cardData,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
          }
        });

    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: "Failed to verify card. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      verifyCard();
    }
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center bg-gradient-to-r from-ethiopian-green to-ethiopian-yellow text-white">
        <CardTitle className="flex items-center justify-center gap-2">
          <Search className="w-5 h-5" />
          Check Your Slip
        </CardTitle>
        <p className="text-sm opacity-90">Enter your card number to verify</p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
            Card Number
          </label>
          <div className="flex gap-2">
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="C-20250614-XYZ001"
              className="flex-1 font-mono"
              disabled={loading}
            />
            <Button 
              onClick={verifyCard}
              disabled={loading}
              className="bg-ethiopian-green hover:bg-ethiopian-green/90"
            >
              {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {result && (
          <div className="mt-6 p-4 rounded-lg border">
            {result.isValid ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Valid Card</span>
                </div>
                
                {result.userName && (
                  <p className="text-sm text-gray-600">
                    Card holder: {result.userName}
                  </p>
                )}
                
                {result.gameDate && (
                  <p className="text-sm text-gray-600">
                    Game date: {result.gameDate}
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-ethiopian-green">{result.matchedNumbers}</p>
                    <p className="text-xs text-gray-600">Numbers Matched</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold capitalize text-ethiopian-dark">{result.status}</p>
                    <p className="text-xs text-gray-600">Status</p>
                  </div>
                </div>

                {result.isWinner && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg text-center text-white">
                    <Trophy className="w-6 h-6 mx-auto mb-1" />
                    <p className="font-bold">🎉 WINNER! 🎉</p>
                    <p className="text-sm">Congratulations! Please claim your prize.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">Invalid Card</span>
                </div>
                <p className="text-sm text-gray-600">
                  This card number was not found in our system.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center text-xs text-gray-500 mt-4">
          <p>All verification attempts are logged for security.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardVerification;
