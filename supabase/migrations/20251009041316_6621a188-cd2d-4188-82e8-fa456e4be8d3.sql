-- Create real_trades table for advanced trade tracking
CREATE TABLE IF NOT EXISTS public.real_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  location TEXT NOT NULL,
  broker_name TEXT,
  grade TEXT NOT NULL,
  kg_loaded NUMERIC NOT NULL CHECK (kg_loaded > 0),
  farmer_price_per_kg NUMERIC NOT NULL CHECK (farmer_price_per_kg > 0),
  broker_net_per_kg NUMERIC NOT NULL CHECK (broker_net_per_kg > 0),
  farmer_broker_net NUMERIC GENERATED ALWAYS AS (broker_net_per_kg - farmer_price_per_kg) STORED,
  total_profit_loss NUMERIC GENERATED ALWAYS AS ((broker_net_per_kg - farmer_price_per_kg) * kg_loaded) STORED,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.real_trades ENABLE ROW LEVEL SECURITY;

-- RLS Policies for real_trades
CREATE POLICY "Users can view their own trades"
  ON public.real_trades
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trades"
  ON public.real_trades
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades"
  ON public.real_trades
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trades"
  ON public.real_trades
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all trades"
  ON public.real_trades
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete any trade"
  ON public.real_trades
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_real_trades_updated_at
  BEFORE UPDATE ON public.real_trades
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_real_trades_user_id ON public.real_trades(user_id);
CREATE INDEX idx_real_trades_created_at ON public.real_trades(created_at DESC);