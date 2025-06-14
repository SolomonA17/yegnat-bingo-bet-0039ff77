
-- Make Solomon (user ID: de3df238-613f-4640-9c6d-047afaf366de) an admin
INSERT INTO public.user_roles (user_id, role, is_active)
VALUES ('de3df238-613f-4640-9c6d-047afaf366de', 'admin', true)
ON CONFLICT (user_id, role) DO UPDATE SET is_active = true;

-- Make Sarem (user ID: 7681f259-29a1-4d75-aab2-07d27ff0ba71) have no admin role (regular agent)
-- First, remove any existing admin roles for Sarem
DELETE FROM public.user_roles 
WHERE user_id = '7681f259-29a1-4d75-aab2-07d27ff0ba71';
