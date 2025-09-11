export interface GradeData {
  id: string;
  note: string;
  boxes: number;
  rate: number;
  gross: number;
  profitPerBox?: number;
  marginPercent?: number;
}

export interface CalculationResult {
  id: string;
  timestamp: Date;
  farmerName?: string;
  buyerName?: string;
  farmerContact?: string;
  buyerContact?: string;
  tripId?: string;
  notes?: string;
  grades: GradeData[];
  totalBoxes: number;
  grossSale: number;
  commissionAmt: number;
  netSale: number;
  totalCost: number;
  profit: number;
  totalTransportCost: number;
  totalPackingCost: number;
  totalLabourCost: number;
  totalUtilityCost: number;
  commission: number;
  transport: number;
  packing: number;
  labour: number;
  miscellaneous: number;
  farmerRateKg: number;
  kgPerBox: number;
}

export interface CostSettings {
  commission: number;
  transport: number;
  packing: number;
  labour: number;
  miscellaneous: number;
  farmerRateKg: number;
  kgPerBox: number;
}

export interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  grade?: string;
  farmerName?: string;
  buyerName?: string;
  profitOnly?: boolean;
}