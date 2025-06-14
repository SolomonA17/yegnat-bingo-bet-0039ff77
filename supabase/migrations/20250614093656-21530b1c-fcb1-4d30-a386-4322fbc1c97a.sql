
-- Create enum for transaction types
CREATE TYPE public.transaction_type AS ENUM ('deposit', 'withdrawal', 'bet', 'win', 'refund');

-- Create enum for transaction status
CREATE TYPE public.transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- Create enum for payment methods
CREATE TYPE public.payment_method AS ENUM ('telebirr', 'cbe', 'awash', 'dashen', 'bank_of_abyssinia');

-- Add balance and currency fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN balance DECIMAL(15,2) DEFAULT 0.00,
ADD COLUMN currency TEXT DEFAULT 'ETB';

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id TEXT UNIQUE NOT NULL,
  type transaction_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'ETB',
  payment_method payment_method,
  status transaction_status DEFAULT 'pending',
  phone_number TEXT,
  account_number TEXT,
  confirmation_code TEXT,
  reference_number TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create transaction logs table for audit trail
CREATE TABLE public.transaction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  status transaction_status NOT NULL,
  message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
  ON public.transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for transaction logs (users can only view)
CREATE POLICY "Users can view their transaction logs" 
  ON public.transaction_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.transactions 
      WHERE transactions.id = transaction_logs.transaction_id 
      AND transactions.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX idx_transaction_logs_transaction_id ON public.transaction_logs(transaction_id);

-- Function to generate unique transaction ID
CREATE OR REPLACE FUNCTION public.generate_transaction_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'TXN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8));
END;
$$;

-- Function to update balance
CREATE OR REPLACE FUNCTION public.update_user_balance(
  p_user_id UUID,
  p_amount DECIMAL,
  p_transaction_type transaction_type
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_transaction_type IN ('deposit', 'win', 'refund') THEN
    UPDATE public.profiles 
    SET balance = balance + p_amount,
        updated_at = NOW()
    WHERE id = p_user_id;
  ELSIF p_transaction_type IN ('withdrawal', 'bet') THEN
    UPDATE public.profiles 
    SET balance = balance - p_amount,
        updated_at = NOW()
    WHERE id = p_user_id
    AND balance >= p_amount;
    
    IF NOT FOUND THEN
      RETURN FALSE; -- Insufficient balance
    END IF;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Function to log transaction status changes
CREATE OR REPLACE FUNCTION public.log_transaction_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.transaction_logs (transaction_id, status, message, metadata)
  VALUES (
    NEW.id,
    NEW.status,
    CASE 
      WHEN OLD.status IS NULL THEN 'Transaction created'
      WHEN OLD.status != NEW.status THEN 'Status changed from ' || OLD.status || ' to ' || NEW.status
      ELSE 'Transaction updated'
    END,
    jsonb_build_object(
      'old_status', OLD.status,
      'new_status', NEW.status,
      'updated_at', NOW()
    )
  );
  
  -- Update balance when transaction is completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    PERFORM public.update_user_balance(NEW.user_id, NEW.amount, NEW.type);
    UPDATE public.transactions 
    SET completed_at = NOW() 
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for transaction logging
CREATE TRIGGER transaction_status_log_trigger
  AFTER INSERT OR UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_transaction_status();
