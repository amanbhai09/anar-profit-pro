-- Create calculations table for the Anar Profit Calculator
CREATE TABLE public.calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  farmer_name TEXT,
  buyer_name TEXT,
  farmer_contact TEXT,
  buyer_contact TEXT,
  trip_id TEXT,
  notes TEXT,
  grades JSONB NOT NULL,
  total_boxes INTEGER NOT NULL,
  gross_sale DECIMAL(12,2) NOT NULL,
  commission_amt DECIMAL(12,2) NOT NULL,
  net_sale DECIMAL(12,2) NOT NULL,
  total_cost DECIMAL(12,2) NOT NULL,
  profit DECIMAL(12,2) NOT NULL,
  total_transport_cost DECIMAL(12,2) NOT NULL,
  total_packing_cost DECIMAL(12,2) NOT NULL,
  total_labour_cost DECIMAL(12,2) NOT NULL,
  total_utility_cost DECIMAL(12,2) NOT NULL,
  commission DECIMAL(5,2) NOT NULL,
  transport DECIMAL(10,2) NOT NULL,
  packing DECIMAL(10,2) NOT NULL,
  labour DECIMAL(10,2) NOT NULL,
  miscellaneous DECIMAL(10,2) NOT NULL,
  farmer_rate_kg DECIMAL(10,2) NOT NULL,
  kg_per_box DECIMAL(8,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for calculations
CREATE POLICY "Users can view their own calculations" 
ON public.calculations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calculations" 
ON public.calculations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calculations" 
ON public.calculations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calculations" 
ON public.calculations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_calculations_updated_at
  BEFORE UPDATE ON public.calculations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_calculations_user_id ON public.calculations(user_id);
CREATE INDEX idx_calculations_timestamp ON public.calculations(timestamp DESC);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);