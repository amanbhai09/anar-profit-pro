-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' NOT NULL;

-- Add check constraint for valid roles
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'));

-- Create index for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Update existing profiles to have user role (safe default)
UPDATE public.profiles SET role = 'user' WHERE role IS NULL;