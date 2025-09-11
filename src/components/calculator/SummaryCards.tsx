import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Package, Truck, Wrench, Users } from "lucide-react";
import { CalculationResult } from "@/types/calculator";

interface SummaryCardsProps {
  result?: CalculationResult;
}

export const SummaryCards = ({ result }: SummaryCardsProps) => {
  if (!result) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="card-elegant animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted/20 rounded w-1/2"></div>
                <div className="h-6 bg-muted/20 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const summaryItems = [
    {
      title: "Total Boxes",
      value: result.totalBoxes.toLocaleString('en-IN'),
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Gross Sale",
      value: `₹${result.grossSale.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Commission",
      value: `₹${result.commissionAmt.toLocaleString('en-IN')}`,
      subtitle: `${result.commission}%`,
      icon: Users,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Net Sale",
      value: `₹${result.netSale.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Cost",
      value: `₹${result.totalCost.toLocaleString('en-IN')}`,
      icon: Package,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Transport Cost",
      value: `₹${result.totalTransportCost.toLocaleString('en-IN')}`,
      subtitle: `₹${result.transport}/box`,
      icon: Truck,
      color: "text-muted-foreground",
      bgColor: "bg-muted/10",
    },
    {
      title: "Packing Cost",
      value: `₹${result.totalPackingCost.toLocaleString('en-IN')}`,
      subtitle: `₹${result.packing}/box`,
      icon: Package,
      color: "text-muted-foreground",
      bgColor: "bg-muted/10",
    },
    {
      title: "Labour Cost",
      value: `₹${result.totalLabourCost.toLocaleString('en-IN')}`,
      subtitle: `₹${result.labour}/box`,
      icon: Users,
      color: "text-muted-foreground",
      bgColor: "bg-muted/10",
    },
  ];

  const profitItem = {
    title: "Profit / Loss",
    value: `₹${Math.abs(result.profit).toLocaleString('en-IN')}`,
    subtitle: `Margin: ${result.netSale > 0 ? ((result.profit / result.netSale) * 100).toFixed(2) : 0}%`,
    icon: result.profit >= 0 ? TrendingUp : TrendingDown,
    color: result.profit >= 0 ? "text-success" : "text-destructive",
    bgColor: result.profit >= 0 ? "bg-success/10" : "bg-destructive/10",
    isProfit: result.profit >= 0,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card key={index} className="card-elegant animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">{item.title}</p>
                    <p className="text-xl font-bold font-mono">{item.value}</p>
                    {item.subtitle && (
                      <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                    )}
                  </div>
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <IconComponent className={`w-5 h-5 ${item.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Profit/Loss Card - Highlighted */}
      <Card className={`${profitItem.isProfit ? 'card-profit' : 'card-loss'} animate-scale-in`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{profitItem.title}</h3>
                <Badge variant={profitItem.isProfit ? "default" : "destructive"} className="animate-pulse-glow">
                  {profitItem.isProfit ? "Profit" : "Loss"}
                </Badge>
              </div>
              <p className={`text-3xl font-bold font-mono ${profitItem.color}`}>
                {profitItem.isProfit ? "+" : "-"}{profitItem.value}
              </p>
              <p className="text-sm text-muted-foreground">{profitItem.subtitle}</p>
            </div>
            <div className={`p-3 rounded-xl ${profitItem.bgColor}`}>
              <profitItem.icon className={`w-8 h-8 ${profitItem.color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};