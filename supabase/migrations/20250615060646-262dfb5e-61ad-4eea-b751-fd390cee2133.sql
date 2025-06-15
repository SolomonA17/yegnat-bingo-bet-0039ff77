
-- First, let's check if we need to add any additional user types
-- Add 'agent' and 'cashier' to the user_type enum if they don't exist
DO $$ 
BEGIN
    -- Check if 'agent' exists in the enum, if not add it
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'agent' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_type')) THEN
        ALTER TYPE user_type ADD VALUE 'agent';
    END IF;
    
    -- Check if 'cashier' exists in the enum, if not add it
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'cashier' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_type')) THEN
        ALTER TYPE user_type ADD VALUE 'cashier';
    END IF;
END $$;

-- Create a function to assign user roles when creating user accounts
CREATE OR REPLACE FUNCTION public.assign_user_role(
    p_user_id UUID,
    p_role admin_role,
    p_assigned_by UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert the role assignment
    INSERT INTO public.user_roles (user_id, role, assigned_by, is_active)
    VALUES (p_user_id, p_role, p_assigned_by, true)
    ON CONFLICT (user_id, role) 
    DO UPDATE SET 
        is_active = true,
        assigned_by = p_assigned_by,
        assigned_at = NOW();
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;
