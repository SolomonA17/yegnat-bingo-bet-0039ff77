
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BingoCardData {
  cardNumber: string;
  cardData: (number | null)[][];
  gameDate: string;
  userName: string;
  userPhone: string;
}

export const useBingoCard = () => {
  const [loading, setLoading] = useState(false);
  const [currentCard, setCurrentCard] = useState<BingoCardData | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const generateCard = (): (number | null)[][] => {
    const card: (number | null)[][] = Array(5).fill(null).map(() => Array(5).fill(null));
    
    const columns = [
      Array.from({ length: 15 }, (_, i) => i + 1),  // B: 1-15
      Array.from({ length: 15 }, (_, i) => i + 16), // I: 16-30
      Array.from({ length: 15 }, (_, i) => i + 31), // N: 31-45
      Array.from({ length: 15 }, (_, i) => i + 46), // G: 46-60
      Array.from({ length: 15 }, (_, i) => i + 61), // O: 61-75
    ];

    for (let col = 0; col < 5; col++) {
      const shuffled = [...columns[col]].sort(() => Math.random() - 0.5);
      for (let row = 0; row < 5; row++) {
        if (row === 2 && col === 2) {
          card[row][col] = null; // Free space
        } else {
          card[row][col] = shuffled[row];
        }
      }
    }

    return card;
  };

  const issueNewCard = async (playerName?: string, playerPhone?: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to issue Bingo cards",
        variant: "destructive"
      });
      return null;
    }

    // For admin system, we need player details
    if (!playerName || !playerPhone) {
      toast({
        title: "Error",
        description: "Player name and phone number are required",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      // Generate card number
      const { data: cardNumberData, error: cardNumberError } = await supabase
        .rpc('generate_card_number');

      if (cardNumberError) throw cardNumberError;

      const cardData = generateCard();
      const gameDate = new Date().toISOString();

      // Insert card into database
      const { error: insertError } = await supabase
        .from('bingo_cards')
        .insert({
          card_number: cardNumberData,
          user_id: user.id,
          user_name: playerName,
          user_phone: playerPhone,
          card_data: cardData,
          game_date: gameDate
        });

      if (insertError) throw insertError;

      const newCard: BingoCardData = {
        cardNumber: cardNumberData,
        cardData,
        gameDate: new Date(gameDate).toLocaleString(),
        userName: playerName,
        userPhone: playerPhone
      };

      setCurrentCard(newCard);
      
      toast({
        title: "Success",
        description: `Bingo card ${cardNumberData} has been issued!`,
      });

      return newCard;

    } catch (error) {
      console.error('Error issuing card:', error);
      toast({
        title: "Error",
        description: "Failed to issue Bingo card. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const printCard = () => {
    window.print();
  };

  return {
    loading,
    currentCard,
    issueNewCard,
    printCard
  };
};
