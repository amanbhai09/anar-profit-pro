import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { CalculationResult } from '@/types/calculator';
import { useToast } from '@/hooks/use-toast';

export const useCalculations = () => {
  const [calculations, setCalculations] = useState<CalculationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCalculations();
    } else {
      setCalculations([]);
      setLoading(false);
    }
  }, [user]);

  const fetchCalculations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Check if Supabase is properly configured
      if (!isSupabaseConfigured()) {
        console.log('Using local storage for calculations');
        const localData = localStorage.getItem('anar-calculations');
        if (localData) {
          const parsedData = JSON.parse(localData).map((calc: any) => ({
            ...calc,
            timestamp: new Date(calc.timestamp)
          }));
          setCalculations(parsedData);
        }
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('calculations')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const formattedCalculations: CalculationResult[] = (data || []).map((calc) => ({
        id: calc.id,
        timestamp: new Date(calc.timestamp),
        farmerName: calc.farmer_name,
        buyerName: calc.buyer_name,
        farmerContact: calc.farmer_contact,
        buyerContact: calc.buyer_contact,
        tripId: calc.trip_id,
        notes: calc.notes,
        grades: calc.grades,
        totalBoxes: calc.total_boxes,
        grossSale: calc.gross_sale,
        commissionAmt: calc.commission_amt,
        netSale: calc.net_sale,
        totalCost: calc.total_cost,
        profit: calc.profit,
        totalTransportCost: calc.total_transport_cost,
        totalPackingCost: calc.total_packing_cost,
        totalLabourCost: calc.total_labour_cost,
        totalUtilityCost: calc.total_utility_cost,
        commission: calc.commission,
        transport: calc.transport,
        packing: calc.packing,
        labour: calc.labour,
        miscellaneous: calc.miscellaneous,
        farmerRateKg: calc.farmer_rate_kg,
        kgPerBox: calc.kg_per_box,
      }));

      setCalculations(formattedCalculations);
    } catch (error) {
      console.error('Error fetching calculations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load calculation history.',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCalculation = async (calculation: Omit<CalculationResult, 'id'>) => {
    // If Supabase not configured, save to localStorage
    if (!isSupabaseConfigured()) {
      const calculationWithId = {
        ...calculation,
        id: crypto.randomUUID(),
      };
      
      const existing = localStorage.getItem('anar-calculations');
      const calculations = existing ? JSON.parse(existing) : [];
      calculations.unshift(calculationWithId);
      localStorage.setItem('anar-calculations', JSON.stringify(calculations));
      
      toast({
        title: 'Success',
        description: 'Calculation saved locally!',
      });
      
      await fetchCalculations();
      return calculationWithId.id;
    }

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please sign in to save calculations.',
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('calculations')
        .insert({
          user_id: user.id,
          timestamp: calculation.timestamp.toISOString(),
          farmer_name: calculation.farmerName,
          buyer_name: calculation.buyerName,
          farmer_contact: calculation.farmerContact,
          buyer_contact: calculation.buyerContact,
          trip_id: calculation.tripId,
          notes: calculation.notes,
          grades: calculation.grades,
          total_boxes: calculation.totalBoxes,
          gross_sale: calculation.grossSale,
          commission_amt: calculation.commissionAmt,
          net_sale: calculation.netSale,
          total_cost: calculation.totalCost,
          profit: calculation.profit,
          total_transport_cost: calculation.totalTransportCost,
          total_packing_cost: calculation.totalPackingCost,
          total_labour_cost: calculation.totalLabourCost,
          total_utility_cost: calculation.totalUtilityCost,
          commission: calculation.commission,
          transport: calculation.transport,
          packing: calculation.packing,
          labour: calculation.labour,
          miscellaneous: calculation.miscellaneous,
          farmer_rate_kg: calculation.farmerRateKg,
          kg_per_box: calculation.kgPerBox,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Calculation saved successfully!',
      });

      // Refresh the calculations list
      await fetchCalculations();
      
      return data.id;
    } catch (error) {
      console.error('Error saving calculation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save calculation.',
      });
      return null;
    }
  };

  const deleteCalculation = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('calculations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Calculation deleted successfully!',
      });

      // Refresh the calculations list
      await fetchCalculations();
      return true;
    } catch (error) {
      console.error('Error deleting calculation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete calculation.',
      });
      return false;
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