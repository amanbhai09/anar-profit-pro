import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CostSettings as CostSettingsType } from "@/types/calculator";

interface CostSettingsProps {
  settings: CostSettingsType;
  onUpdate: (settings: CostSettingsType) => void;
}

export const CostSettings = ({ settings, onUpdate }: CostSettingsProps) => {
  const handleChange = (field: keyof CostSettingsType, value: number) => {
    onUpdate({ ...settings, [field]: value });
  };

  return (
    <Card className="card-elegant">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Cost Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="commission" className="text-sm font-medium">
              Broker Commission (%)
            </Label>
            <Input
              id="commission"
              type="number"
              value={settings.commission}
              onChange={(e) => handleChange('commission', Number(e.target.value))}
              className="bg-background/50"
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transport" className="text-sm font-medium">
              Transport (₹/box)
            </Label>
            <Input
              id="transport"
              type="number"
              value={settings.transport}
              onChange={(e) => handleChange('transport', Number(e.target.value))}
              className="bg-background/50"
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="packing" className="text-sm font-medium">
              Packing (₹/box)
            </Label>
            <Input
              id="packing"
              type="number"
              value={settings.packing}
              onChange={(e) => handleChange('packing', Number(e.target.value))}
              className="bg-background/50"
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="labour" className="text-sm font-medium">
              Labour (₹/box)
            </Label>
            <Input
              id="labour"
              type="number"
              value={settings.labour}
              onChange={(e) => handleChange('labour', Number(e.target.value))}
              className="bg-background/50"
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="miscellaneous" className="text-sm font-medium">
              Utility Expense (₹/box)
            </Label>
            <Input
              id="miscellaneous"
              type="number"
              value={settings.miscellaneous}
              onChange={(e) => handleChange('miscellaneous', Number(e.target.value))}
              className="bg-background/50"
              min="0"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="space-y-2">
            <Label htmlFor="farmerRateKg" className="text-sm font-medium">
              Farmer Purchase Rate (₹/kg)
            </Label>
            <Input
              id="farmerRateKg"
              type="number"
              value={settings.farmerRateKg}
              onChange={(e) => handleChange('farmerRateKg', Number(e.target.value))}
              className="bg-background/50"
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="kgPerBox" className="text-sm font-medium">
              Weight per Box (kg)
            </Label>
            <Input
              id="kgPerBox"
              type="number"
              value={settings.kgPerBox}
              onChange={(e) => handleChange('kgPerBox', Number(e.target.value))}
              className="bg-background/50"
              min="0.1"
              step="0.1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};