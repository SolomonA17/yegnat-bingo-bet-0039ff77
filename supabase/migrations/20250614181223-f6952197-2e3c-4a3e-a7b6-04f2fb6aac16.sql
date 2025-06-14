
-- Drop the trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function (now it should work)
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Rename the profiles table to agents
ALTER TABLE public.profiles RENAME TO agents;

-- Recreate the function with the new table name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.agents (id, phone_number, full_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
