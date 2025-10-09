import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface RealTrade {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  location: string;
  broker_name: string | null;
  grade: string;
  kg_loaded: number;
  farmer_price_per_kg: number;
  broker_net_per_kg: number;
  farmer_broker_net: number;
  total_profit_loss: number;
  notes: string | null;
}

export interface TradeStats {
  totalTrades: number;
  totalProfit: number;
  totalKg: number;
  avgProfitPerKg: number;
  dailyStats: { date: string; profit: number; kg: number }[];
  weeklyStats: { week: string; profit: number; kg: number }[];
  monthlyStats: { month: string; profit: number; kg: number }[];
}

export const useRealTrades = () => {
  const [trades, setTrades] = useState<RealTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TradeStats | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTrades = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('real_trades')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTrades(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching trades:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load trade history',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tradesData: RealTrade[]) => {
    const totalProfit = tradesData.reduce((sum, t) => sum + Number(t.total_profit_loss), 0);
    const totalKg = tradesData.reduce((sum, t) => sum + Number(t.kg_loaded), 0);
    
    // Group by date
    const dailyMap = new Map<string, { profit: number; kg: number }>();
    const weeklyMap = new Map<string, { profit: number; kg: number }>();
    const monthlyMap = new Map<string, { profit: number; kg: number }>();
    
    tradesData.forEach(trade => {
      const date = new Date(trade.created_at);
      const dateStr = date.toISOString().split('T')[0];
      const weekStr = `Week ${Math.ceil(date.getDate() / 7)}, ${date.toLocaleString('default', { month: 'short' })}`;
      const monthStr = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      // Daily
      if (!dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, { profit: 0, kg: 0 });
      }
      const daily = dailyMap.get(dateStr)!;
      daily.profit += Number(trade.total_profit_loss);
      daily.kg += Number(trade.kg_loaded);
      
      // Weekly
      if (!weeklyMap.has(weekStr)) {
        weeklyMap.set(weekStr, { profit: 0, kg: 0 });
      }
      const weekly = weeklyMap.get(weekStr)!;
      weekly.profit += Number(trade.total_profit_loss);
      weekly.kg += Number(trade.kg_loaded);
      
      // Monthly
      if (!monthlyMap.has(monthStr)) {
        monthlyMap.set(monthStr, { profit: 0, kg: 0 });
      }
      const monthly = monthlyMap.get(monthStr)!;
      monthly.profit += Number(trade.total_profit_loss);
      monthly.kg += Number(trade.kg_loaded);
    });
    
    setStats({
      totalTrades: tradesData.length,
      totalProfit,
      totalKg,
      avgProfitPerKg: totalKg > 0 ? totalProfit / totalKg : 0,
      dailyStats: Array.from(dailyMap.entries()).map(([date, data]) => ({ date, ...data })).slice(0, 7),
      weeklyStats: Array.from(weeklyMap.entries()).map(([week, data]) => ({ week, ...data })).slice(0, 4),
      monthlyStats: Array.from(monthlyMap.entries()).map(([month, data]) => ({ month, ...data })).slice(0, 12),
    });
  };

  useEffect(() => {
    fetchTrades();
  }, [user]);

  const saveTrade = async (tradeData: Omit<RealTrade, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'farmer_broker_net' | 'total_profit_loss'>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to save trades',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('real_trades')
        .insert({
          user_id: user.id,
          ...tradeData,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Trade saved successfully',
      });

      fetchTrades();
    } catch (error) {
      console.error('Error saving trade:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save trade',
      });
    }
  };

  const deleteTrade = async (id: string) => {
    try {
      const { error } = await supabase
        .from('real_trades')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Trade deleted successfully',
      });

      fetchTrades();
    } catch (error) {
      console.error('Error deleting trade:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete trade',
      });
    }
  };

  return {
    trades,
    loading,
    stats,
    saveTrade,
    deleteTrade,
    refetch: fetchTrades,
  };
};
