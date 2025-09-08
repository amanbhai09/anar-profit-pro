// Use the integrated Supabase client
export { supabase } from '@/integrations/supabase/client';

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true; // Always configured with integrated client
};

export type Database = {
  public: {
    Tables: {
      calculations: {
        Row: {
          id: string;
          user_id: string;
          timestamp: string;
          farmer_name: string | null;
          buyer_name: string | null;
          farmer_contact: string | null;
          buyer_contact: string | null;
          trip_id: string | null;
          notes: string | null;
          grades: any;
          total_boxes: number;
          gross_sale: number;
          commission_amt: number;
          net_sale: number;
          total_cost: number;
          profit: number;
          total_transport_cost: number;
          total_packing_cost: number;
          total_labour_cost: number;
          total_utility_cost: number;
          commission: number;
          transport: number;
          packing: number;
          labour: number;
          miscellaneous: number;
          farmer_rate_kg: number;
          kg_per_box: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          timestamp?: string;
          farmer_name?: string | null;
          buyer_name?: string | null;
          farmer_contact?: string | null;
          buyer_contact?: string | null;
          trip_id?: string | null;
          notes?: string | null;
          grades: any;
          total_boxes: number;
          gross_sale: number;
          commission_amt: number;
          net_sale: number;
          total_cost: number;
          profit: number;
          total_transport_cost: number;
          total_packing_cost: number;
          total_labour_cost: number;
          total_utility_cost: number;
          commission: number;
          transport: number;
          packing: number;
          labour: number;
          miscellaneous: number;
          farmer_rate_kg: number;
          kg_per_box: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          timestamp?: string;
          farmer_name?: string | null;
          buyer_name?: string | null;
          farmer_contact?: string | null;
          buyer_contact?: string | null;
          trip_id?: string | null;
          notes?: string | null;
          grades?: any;
          total_boxes?: number;
          gross_sale?: number;
          commission_amt?: number;
          net_sale?: number;
          total_cost?: number;
          profit?: number;
          total_transport_cost?: number;
          total_packing_cost?: number;
          total_labour_cost?: number;
          total_utility_cost?: number;
          commission?: number;
          transport?: number;
          packing?: number;
          labour?: number;
          miscellaneous?: number;
          farmer_rate_kg?: number;
          kg_per_box?: number;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};