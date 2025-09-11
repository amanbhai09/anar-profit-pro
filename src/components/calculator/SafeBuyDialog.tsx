import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, TrendingDown, Calculator } from "lucide-react";
import { CalculationResult } from "@/types/calculator";

interface SafeBuyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  calculation: CalculationResult | undefined;
}

export const SafeBuyDialog = ({ isOpen, onClose, calculation }: SafeBuyDialogProps) => {
  const [safeBuyPrice, setSafeBuyPrice] = useState<number>(0);
  const [breakEvenPrice, setBreakEvenPrice] = useState<number>(0);

  useEffect(() => {
    if (calculation && isOpen) {
      calculateSafeBuy();
    }
  }, [calculation, isOpen]);

  const calculateSafeBuy = () => {
    if (!calculation) return;

    const totalBoxes = calculation.totalBoxes;
    const grossSale = calculation.grossSale;
    const commissionAmt = calculation.commissionAmt;
    const netSale = grossSale - commissionAmt;
    
    const otherCostsPerBox = calculation.transport + calculation.packing + calculation.labour + calculation.miscellaneous;
    const totalOtherCosts = otherCostsPerBox * totalBoxes;
    
    // For break-even: Net Sale = Total Cost
    // Net Sale = Farmer Cost + Other Costs
    // Farmer Cost = safeBuyPrice * kgPerBox * totalBoxes
    const availableForFarmerCost = netSale - totalOtherCosts;
    const breakEvenFarmerRatePerKg = availableForFarmerCost / (calculation.kgPerBox * totalBoxes);
    
    // Safe buy should be 5% lower than break-even to ensure profit
    const safeFarmerRatePerKg = breakEvenFarmerRatePerKg * 0.95;
    
    setSafeBuyPrice(Math.max(0, safeFarmerRatePerKg));
    setBreakEvenPrice(Math.max(0, breakEvenFarmerRatePerKg));
  };

  if (!calculation) return null;

  const currentLoss = calculation.profit < 0 ? Math.abs(calculation.profit) : 0;
  const potentialProfit = calculation.totalBoxes * calculation.kgPerBox * (calculation.farmerRateKg - safeBuyPrice);
  const savingsPerKg = calculation.farmerRateKg - safeBuyPrice;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            Safe Buy Analysis
          </DialogTitle>
          <DialogDescription>
            Calculate the optimal farmer rate to avoid losses and ensure profitability
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-green-700 dark:text-green-300">Safe Buy Price</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₹{safeBuyPrice.toFixed(2)}/kg
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  5% buffer for guaranteed profit
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-amber-700 dark:text-amber-300">Break-Even Price</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  ₹{breakEvenPrice.toFixed(2)}/kg
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  No profit, no loss point
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Impact Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium text-muted-foreground">Current Status</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Current Rate:</span>
                    <span className="font-semibold">₹{calculation.farmerRateKg}/kg</span>
                  </div>
                  {currentLoss > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Current Loss:</span>
                      <span className="font-semibold">₹{currentLoss.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-muted-foreground">Safe Buy Benefits</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-green-600">
                    <span>Savings/kg:</span>
                    <span className="font-semibold">₹{savingsPerKg.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Total Savings:</span>
                    <span className="font-semibold">₹{(savingsPerKg * calculation.totalBoxes * calculation.kgPerBox).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-muted-foreground">Recommendations</p>
                <div className="space-y-1">
                  {calculation.farmerRateKg > safeBuyPrice ? (
                    <Badge variant="destructive" className="text-xs">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Reduce farmer rate
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Current rate is safe
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">How it works:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Safe Buy Price ensures 5% profit margin above break-even</li>
              <li>• Break-Even Price is calculated considering all costs and commission</li>
              <li>• Buying below Safe Buy Price guarantees profitability</li>
              <li>• Consider market conditions and farmer relationships when negotiating</li>
            </ul>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Close Analysis
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};