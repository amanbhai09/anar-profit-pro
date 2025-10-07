import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PriceEntry {
  price: number;
  weight: number;
}

interface AverageCalculation {
  id: string;
  created_at: string;
  entries: PriceEntry[];
  average_price: number;
  total_weight: number;
  total_value: number;
}

export const useAverageCalculations = () => {
  const [calculations, setCalculations] = useState<AverageCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCalculations = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('average_calculations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = (data || []).map(item => ({
        ...item,
        entries: item.entries as unknown as PriceEntry[]
      }));
      
      setCalculations(typedData);
    } catch (error) {
      console.error('Error fetching calculations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load calculation history',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, [user]);

  const saveCalculation = async (
    entries: PriceEntry[],
    averagePrice: number,
    totalWeight: number,
    totalValue: number
  ) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to save calculations',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('average_calculations')
        .insert({
          user_id: user.id,
          entries: entries as any,
          average_price: averagePrice,
          total_weight: totalWeight,
          total_value: totalValue,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Calculation saved successfully',
      });

      fetchCalculations();
    } catch (error) {
      console.error('Error saving calculation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save calculation',
      });
    }
  };

  const deleteCalculation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('average_calculations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Calculation deleted successfully',
      });

      fetchCalculations();
    } catch (error) {
      console.error('Error deleting calculation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete calculation',
      });
    }
  };

  return {
    calculations,
    loading,
    saveCalculation,
    deleteCalculation,
    refetch: fetchCalculations,
  };
};
