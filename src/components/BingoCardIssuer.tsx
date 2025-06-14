
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Ticket, Plus } from 'lucide-react';
import { useBingoCard } from '@/hooks/useBingoCard';
import BingoSlip from './BingoSlip';
import LoadingSpinner from './LoadingSpinner';

const BingoCardIssuer: React.FC = () => {
  const { loading, currentCard, issueNewCard, printCard } = useBingoCard();
  const [showSlip, setShowSlip] = useState(false);

  const handleGetCard = async () => {
    const newCard = await issueNewCard();
    if (newCard) {
      setShowSlip(true);
    }
  };

  return (
    <Card className="shadow-lg bg-gradient-to-br from-ethiopian-green/5 to-ethiopian-yellow/5">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-ethiopian-dark">
          <Ticket className="w-6 h-6" />
          Get Your Bingo Card
        </CardTitle>
        <p className="text-sm text-gray-600">
          Get a new Bingo card to join the next game
        </p>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        {loading ? (
          <LoadingSpinner text="Generating your card..." />
        ) : (
          <>
            <Button
              onClick={handleGetCard}
              className="bg-ethiopian-green hover:bg-ethiopian-green/90 text-white px-8 py-3"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Issue New Card
            </Button>
            
            <p className="text-xs text-gray-500">
              Each card costs 10 ETB and will be deducted from your wallet
            </p>
          </>
        )}

        {/* Show slip dialog */}
        <Dialog open={showSlip} onOpenChange={setShowSlip}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Your Bingo Card Slip</DialogTitle>
            </DialogHeader>
            {currentCard && (
              <div className="print-content">
                <BingoSlip
                  cardNumber={currentCard.cardNumber}
                  userName="Player" // Will be filled from user profile
                  userPhone="" // Will be filled from user profile
                  gameDate={currentCard.gameDate}
                  cardData={currentCard.cardData}
                  onPrint={printCard}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BingoCardIssuer;
