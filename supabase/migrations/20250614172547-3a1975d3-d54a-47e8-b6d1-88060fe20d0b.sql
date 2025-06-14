
-- Create enum for admin roles
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'admin', 'cashier');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role admin_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, role)
);

-- Create admin_actions table to log all admin activities
CREATE TABLE public.admin_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  action_type TEXT NOT NULL,
  target_type TEXT, -- 'user', 'transaction', 'card', etc.
  target_id TEXT,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_admin_role(_user_id UUID, _role admin_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
  )
$$;

-- Function to check if user has any admin role
CREATE OR REPLACE FUNCTION public.is_admin_user(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND is_active = true
  )
$$;

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy for viewing roles (admins can see all, users can see their own)
CREATE POLICY "Admins can view all roles, users can view their own" 
  ON public.user_roles 
  FOR SELECT 
  USING (
    public.has_admin_role(auth.uid(), 'super_admin') OR 
    public.has_admin_role(auth.uid(), 'admin') OR 
    user_id = auth.uid()
  );

-- Policy for inserting roles (only super_admins and admins)
CREATE POLICY "Only super_admins and admins can assign roles" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (
    public.has_admin_role(auth.uid(), 'super_admin') OR 
    public.has_admin_role(auth.uid(), 'admin')
  );

-- Policy for updating roles (only super_admins and admins)
CREATE POLICY "Only super_admins and admins can update roles" 
  ON public.user_roles 
  FOR UPDATE 
  USING (
    public.has_admin_role(auth.uid(), 'super_admin') OR 
    public.has_admin_role(auth.uid(), 'admin')
  );

-- Enable RLS on admin_actions
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Policy for viewing admin actions (admins only)
CREATE POLICY "Only admins can view admin actions" 
  ON public.admin_actions 
  FOR SELECT 
  USING (public.is_admin_user(auth.uid()));

-- Policy for logging admin actions (admins only)
CREATE POLICY "Only admins can log actions" 
  ON public.admin_actions 
  FOR INSERT 
  WITH CHECK (public.is_admin_user(auth.uid()));

-- Update bingo_cards policies to allow admin access
DROP POLICY IF EXISTS "Users can view their own cards" ON public.bingo_cards;
DROP POLICY IF EXISTS "Users can create their own cards" ON public.bingo_cards;
DROP POLICY IF EXISTS "Users can update their own cards" ON public.bingo_cards;

-- New policies for admin-controlled system
CREATE POLICY "Admins and cashiers can view all cards" 
  ON public.bingo_cards 
  FOR SELECT 
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins and cashiers can create cards" 
  ON public.bingo_cards 
  FOR INSERT 
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update all cards" 
  ON public.bingo_cards 
  FOR UPDATE 
  USING (
    public.has_admin_role(auth.uid(), 'super_admin') OR 
    public.has_admin_role(auth.uid(), 'admin')
  );

CREATE POLICY "Only admins can delete cards" 
  ON public.bingo_cards 
  FOR DELETE 
  USING (
    public.has_admin_role(auth.uid(), 'super_admin') OR 
    public.has_admin_role(auth.uid(), 'admin')
  );

-- Add indexes for performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX idx_admin_actions_created_at ON public.admin_actions(created_at);

-- Insert a default super admin (you'll need to change this email/phone to match your admin account)
-- This is commented out - you'll need to create this manually after setting up the first admin account
-- INSERT INTO public.user_roles (user_id, role, assigned_by) 
-- VALUES ('your-admin-user-id-here', 'super_admin', 'your-admin-user-id-here');
