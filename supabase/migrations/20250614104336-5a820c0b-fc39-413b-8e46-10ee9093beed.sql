
-- Create enum for card status
CREATE TYPE card_status AS ENUM ('active', 'expired', 'winner', 'checked');

-- Create bingo_cards table to store issued cards
CREATE TABLE public.bingo_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  card_data JSONB NOT NULL, -- Store the 5x5 grid
  game_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status card_status NOT NULL DEFAULT 'active',
  is_winner BOOLEAN NOT NULL DEFAULT false,
  matched_numbers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create card_verifications table to track all verification attempts
CREATE TABLE public.card_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_number TEXT NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  verification_result JSONB NOT NULL -- Store verification details
);

-- Function to generate unique card numbers
CREATE OR REPLACE FUNCTION public.generate_card_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'C-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 6));
END;
$$;

-- Enable RLS on bingo_cards
ALTER TABLE public.bingo_cards ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own cards
CREATE POLICY "Users can view their own cards" 
  ON public.bingo_cards 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own cards
CREATE POLICY "Users can create their own cards" 
  ON public.bingo_cards 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own cards
CREATE POLICY "Users can update their own cards" 
  ON public.bingo_cards 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Enable RLS on card_verifications (public read for verification feature)
ALTER TABLE public.card_verifications ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert verification attempts
CREATE POLICY "Anyone can create verification attempts" 
  ON public.card_verifications 
  FOR INSERT 
  WITH CHECK (true);

-- Policy to allow anyone to read verification results (for the check feature)
CREATE POLICY "Anyone can read verification results" 
  ON public.card_verifications 
  FOR SELECT 
  USING (true);

-- Add indexes for performance
CREATE INDEX idx_bingo_cards_card_number ON public.bingo_cards(card_number);
CREATE INDEX idx_bingo_cards_user_id ON public.bingo_cards(user_id);
CREATE INDEX idx_card_verifications_card_number ON public.card_verifications(card_number);
CREATE INDEX idx_card_verifications_verified_at ON public.card_verifications(verified_at);
