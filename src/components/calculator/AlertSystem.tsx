import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CalculationResult } from "@/types/calculator";

interface AlertSystemProps {
  result?: CalculationResult;
  grades: any[];
}

export const AlertSystem = ({ result, grades }: AlertSystemProps) => {
  const alerts = [];

  // Check for empty boxes or rates
  const emptyGrades = grades.filter(g => (!g.boxes || g.boxes === 0) || (!g.rate || g.rate === 0));
  if (emptyGrades.length > 0) {
    alerts.push({
      type: "warning",
      title: "Incomplete Grade Data",
      message: `${emptyGrades.length} grade(s) have missing boxes or rates. This may affect calculations.`,
      icon: AlertTriangle,
    });
  }

  // Check for loss
  if (result && result.profit < 0) {
    alerts.push({
      type: "error",
      title: "Loss Alert",
      message: `Net sale (₹${result.netSale.toLocaleString('en-IN')}) is less than total cost (₹${result.totalCost.toLocaleString('en-IN')}).`,
      icon: XCircle,
    });
  }

  // Check for high commission
  if (result && result.commission > 6) {
    alerts.push({
      type: "warning",
      title: "High Commission",
      message: `Commission rate of ${result.commission}% is above average. Consider negotiating with broker.`,
      icon: AlertTriangle,
    });
  }
  
  // Check for profit
  if (result && result.profit > 0) {
    alerts.push({
      type: "success",
      title: "Profitable Transaction",
      message: `Good profit of ₹${result.profit.toLocaleString('en-IN')} with ${((result.profit / result.netSale) * 100).toFixed(2)}% margin.`,
      icon: CheckCircle,
    });
  }

  // Check for high transport costs
  if (result && result.transport > 75) {
    alerts.push({
      type: "info",
      title: "High Transport Cost",
      message: `Transport cost of ₹${result.transport}/box is above average. Total: ₹${result.totalTransportCost.toLocaleString('en-IN')}`,
      icon: Info,
    });
  }

  // Check for high transport costs
  if (result && result.packing > 70) {
    alerts.push({
      type: "info",
      title: "High Packing cost",
      message: `Packing cost of ₹${result.packing}/box is above average. Total: ₹${result.totalPackingCost.toLocaleString('en-IN')}`,
      icon: Info,
    });
  }

  if (alerts.length === 0) {
    return null;
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "error": return "destructive";
      case "warning": return "default";
      case "success": return "default";
      case "info": return "default";
      default: return "default";
    }
  };

  const getAlertClass = (type: string) => {
    switch (type) {
      case "error": return "border-destructive/50 bg-destructive/5";
      case "warning": return "border-warning/50 bg-warning/5";
      case "success": return "border-success/50 bg-success/5";
      case "info": return "border-primary/50 bg-primary/5";
      default: return "";
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => {
        const IconComponent = alert.icon;
        return (
          <Alert key={index} variant={getAlertVariant(alert.type)} className={getAlertClass(alert.type)}>
            <IconComponent className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <span className="font-medium">{alert.title}:</span> {alert.message}
              </div>
              <Badge variant="outline" className="ml-2 text-xs">
                {alert.type.toUpperCase()}
              </Badge>
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
};
