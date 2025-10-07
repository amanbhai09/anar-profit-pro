-- Create table for average calculator history
CREATE TABLE public.average_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  entries JSONB NOT NULL,
  average_price NUMERIC NOT NULL,
  total_weight NUMERIC NOT NULL,
  total_value NUMERIC NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.average_calculations ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own average calculations" 
ON public.average_calculations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own average calculations" 
ON public.average_calculations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own average calculations" 
ON public.average_calculations 
FOR DELETE 
USING (auth.uid() = user_id);