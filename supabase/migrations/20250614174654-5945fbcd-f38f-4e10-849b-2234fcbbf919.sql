
-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('super_admin', 'admin', 'super_agent', 'shop');

-- Create enum for transaction types
CREATE TYPE public.credit_transaction_type AS ENUM ('sent_to_agent', 'sent_to_shop', 'received', 'recharge');

-- Create enum for cartela status
CREATE TYPE public.cartela_status AS ENUM ('active', 'used', 'void', 'sold');

-- Create enum for game result status
CREATE TYPE public.game_result_status AS ENUM ('pending', 'published', 'completed');

-- Create game_results table
CREATE TABLE public.game_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_date DATE NOT NULL,
  draw_number INTEGER NOT NULL,
  called_numbers INTEGER[] NOT NULL,
  winning_cards TEXT[],
  total_prize_pool DECIMAL(10,2) DEFAULT 0,
  status game_result_status DEFAULT 'pending',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(game_date, draw_number)
);

-- Create cartela_groups table
CREATE TABLE public.cartela_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_name TEXT NOT NULL,
  assigned_agent UUID REFERENCES auth.users(id),
  total_cartelas INTEGER DEFAULT 0,
  sold_cartelas INTEGER DEFAULT 0,
  won_cartelas INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credit_transactions table
CREATE TABLE public.credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_type credit_transaction_type NOT NULL,
  from_user UUID REFERENCES auth.users(id),
  to_user UUID REFERENCES auth.users(id),
  amount DECIMAL(10,2) NOT NULL,
  purpose TEXT,
  notes TEXT,
  receipt_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_accounts table for extended user info
CREATE TABLE public.user_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  user_type user_type NOT NULL,
  assigned_super_agent UUID REFERENCES auth.users(id),
  balance DECIMAL(10,2) DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  total_cartelas_handled INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Update bingo_cards table to include group assignment
ALTER TABLE public.bingo_cards 
ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.cartela_groups(id),
ADD COLUMN IF NOT EXISTS assigned_agent UUID REFERENCES auth.users(id);

-- Enable RLS on new tables
ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cartela_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;

-- RLS policies for game_results
CREATE POLICY "Admins can view all game results" 
  ON public.game_results 
  FOR SELECT 
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can create game results" 
  ON public.game_results 
  FOR INSERT 
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update game results" 
  ON public.game_results 
  FOR UPDATE 
  USING (public.is_admin_user(auth.uid()));

-- RLS policies for cartela_groups
CREATE POLICY "Admins can view all cartela groups" 
  ON public.cartela_groups 
  FOR SELECT 
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can manage cartela groups" 
  ON public.cartela_groups 
  FOR ALL 
  USING (public.is_admin_user(auth.uid()));

-- RLS policies for credit_transactions
CREATE POLICY "Admins can view all credit transactions" 
  ON public.credit_transactions 
  FOR SELECT 
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can create credit transactions" 
  ON public.credit_transactions 
  FOR INSERT 
  WITH CHECK (public.is_admin_user(auth.uid()));

-- RLS policies for user_accounts
CREATE POLICY "Admins can view all user accounts" 
  ON public.user_accounts 
  FOR SELECT 
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can manage user accounts" 
  ON public.user_accounts 
  FOR ALL 
  USING (public.is_admin_user(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_game_results_date ON public.game_results(game_date);
CREATE INDEX idx_cartela_groups_agent ON public.cartela_groups(assigned_agent);
CREATE INDEX idx_credit_transactions_type ON public.credit_transactions(transaction_type);
CREATE INDEX idx_credit_transactions_users ON public.credit_transactions(from_user, to_user);
CREATE INDEX idx_user_accounts_type ON public.user_accounts(user_type);
CREATE INDEX idx_bingo_cards_group ON public.bingo_cards(group_id);
