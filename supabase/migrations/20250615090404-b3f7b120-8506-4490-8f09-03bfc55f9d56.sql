
-- Enable Row Level Security on the agents table if it's not already enabled
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Allow each user to insert their own agent record
CREATE POLICY "Authenticated users can insert their own agent record"
  ON public.agents
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow each user to update their own agent record
CREATE POLICY "Authenticated users can update their own agent record"
  ON public.agents
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow each user to select their own agent record
CREATE POLICY "Authenticated users can view their own agent record"
  ON public.agents
  FOR SELECT
  USING (auth.uid() = id);

-- Optionally allow super admins/admins to manage all agents (example only; comment out if not desired)
-- CREATE POLICY "Admins can manage all agents"
--   ON public.agents
--   FOR ALL
--   USING (EXISTS (
--     SELECT 1 FROM public.user_roles 
--     WHERE user_id = auth.uid() 
--       AND role IN ('super_admin', 'admin') 
--       AND is_active = true
--   ));
