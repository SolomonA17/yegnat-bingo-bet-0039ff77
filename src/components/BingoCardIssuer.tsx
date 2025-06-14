
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Ticket, Plus, User, Phone } from 'lucide-react';
import { useBingoCard } from '@/hooks/useBingoCard';
import BingoSlip from './BingoSlip';
import LoadingSpinner from './LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

const BingoCardIssuer: React.FC = () => {
  const { loading, currentCard, issueNewCard, printCard } = useBingoCard();
  const [showSlip, setShowSlip] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerPhone, setPlayerPhone] = useState('');
  const { toast } = useToast();

  const handleIssueCard = async () => {
    if (!playerName.trim() || !playerPhone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both player name and phone number",
        variant: "destructive"
      });
      return;
    }

    if (!playerPhone.startsWith('+')) {
      toast({
        title: "Invalid Phone Number",
        description: "Please include country code (e.g., +251 for Ethiopia)",
        variant: "destructive"
      });
      return;
    }

    const newCard = await issueNewCard(playerName, playerPhone);
    if (newCard) {
      setShowSlip(true);
      setShowIssueForm(false);
      setPlayerName('');
      setPlayerPhone('');
    }
  };

  return (
    <Card className="shadow-lg bg-gradient-to-br from-ethiopian-green/5 to-ethiopian-yellow/5">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-ethiopian-dark">
          <Ticket className="w-6 h-6" />
          Issue Bingo Card
        </CardTitle>
        <p className="text-sm text-gray-600">
          Generate new Bingo cards for players
        </p>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        {loading ? (
          <LoadingSpinner text="Generating card..." />
        ) : (
          <Dialog open={showIssueForm} onOpenChange={setShowIssueForm}>
            <DialogTrigger asChild>
              <Button
                className="bg-ethiopian-green hover:bg-ethiopian-green/90 text-white px-8 py-3"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Issue New Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Player Information</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Player Name
                  </label>
                  <Input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter player's full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number
                  </label>
                  <Input
                    value={playerPhone}
                    onChange={(e) => setPlayerPhone(e.target.value)}
                    placeholder="+251XXXXXXXXX"
                  />
                </div>
                <Button
                  onClick={handleIssueCard}
                  className="w-full bg-ethiopian-green hover:bg-ethiopian-green/90"
                  disabled={loading}
                >
                  Generate Card
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <p className="text-xs text-gray-500">
          Each card costs 10 ETB
        </p>

        {/* Show slip dialog */}
        <Dialog open={showSlip} onOpenChange={setShowSlip}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Bingo Card Slip</DialogTitle>
            </DialogHeader>
            {currentCard && (
              <div className="print-content">
                <BingoSlip
                  cardNumber={currentCard.cardNumber}
                  userName={currentCard.userName}
                  userPhone={currentCard.userPhone}
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
