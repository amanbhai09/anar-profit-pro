import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Only throw error in production if variables are missing
if ((!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) && import.meta.env.PROD) {
  console.warn('Supabase not configured. Database features will be disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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