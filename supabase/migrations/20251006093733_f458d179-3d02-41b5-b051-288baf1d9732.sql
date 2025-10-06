-- Create admin role for specific user
-- First, ensure the demo admin user exists in profiles
-- Update the role for the demo admin user (email: hacker@demo.com)

-- You'll need to create this user manually first through the Supabase auth UI
-- Then run this to set them as admin:

UPDATE public.profiles 
SET role = 'admin'
WHERE email = 'hacker@demo.com';

-- Insert profile if it doesn't exist (after user signs up)
-- This ensures the trigger creates the profile correctly