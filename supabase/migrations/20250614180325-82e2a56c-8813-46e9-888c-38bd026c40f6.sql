
-- Insert admin role for the existing user
INSERT INTO public.user_roles (user_id, role, is_active)
VALUES ('de3df238-613f-4640-9c6d-047afaf366de', 'super_admin', true)
ON CONFLICT (user_id, role) DO UPDATE SET is_active = true;
