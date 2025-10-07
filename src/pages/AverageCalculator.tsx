import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Plus, Trash2, Download, Save, History } from "lucide-react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/ui/footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAverageCalculations } from "@/hooks/useAverageCalculations";
import { exportAverageToPDF } from "@/utils/averagePdfExport";

interface PriceEntry {
  id: string;
  price: number;
  weight: number;
}

interface ConversionState {
  kg: number;
  percent: number;
  totalKg: number;
}

export const AverageCalculator = () => {
  const [entries, setEntries] = useState<PriceEntry[]>([
    { id: '1', price: 0, weight: 0 }
  ]);
  const [averagePrice, setAveragePrice] = useState<number>(0);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [conversion, setConversion] = useState<ConversionState>({
    kg: 0,
    percent: 0,
    totalKg: 100
  });
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { calculations, loading, saveCalculation, deleteCalculation } = useAverageCalculations();

  const addEntry = () => {
    const newEntry: PriceEntry = {
      id: Date.now().toString(),
      price: 0,
      weight: 0
    };
    setEntries([...entries, newEntry]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const updateEntry = (id: string, field: 'price' | 'weight', value: number) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const calculateAverage = () => {
    const validEntries = entries.filter(entry => entry.price > 0 && entry.weight > 0);
    
    if (validEntries.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter valid price and weight values",
      });
      return;
    }

    const calcTotalValue = validEntries.reduce((sum, entry) => sum + (entry.price * entry.weight), 0);
    const calcTotalWeight = validEntries.reduce((sum, entry) => sum + entry.weight, 0);
    
    const average = calcTotalValue / calcTotalWeight;
    setAveragePrice(average);
    setTotalWeight(calcTotalWeight);
    setTotalValue(calcTotalValue);

    toast({
      title: "Success",
      description: `Weighted average price calculated: ₹${average.toFixed(2)}`,
    });
  };

  const handleSave = async () => {
    if (averagePrice === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please calculate average first",
      });
      return;
    }

    const validEntries = entries
      .filter(entry => entry.price > 0 && entry.weight > 0)
      .map(({ price, weight }) => ({ price, weight }));

    await saveCalculation(validEntries, averagePrice, totalWeight, totalValue);
  };

  const handleExportPDF = () => {
    if (averagePrice === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please calculate average first",
      });
      return;
    }

    const validEntries = entries
      .filter(entry => entry.price > 0 && entry.weight > 0)
      .map(({ price, weight }) => ({ price, weight }));

    exportAverageToPDF({
      entries: validEntries,
      averagePrice,
      totalWeight,
      totalValue,
      createdAt: new Date().toISOString(),
    });

    toast({
      title: "Success",
      description: "PDF exported successfully",
    });
  };

  const handleKgChange = (kg: number) => {
    const percent = conversion.totalKg > 0 ? (kg / conversion.totalKg) * 100 : 0;
    setConversion({ ...conversion, kg, percent });
  };

  const handlePercentChange = (percent: number) => {
    const kg = (percent / 100) * conversion.totalKg;
    setConversion({ ...conversion, kg, percent });
  };

  const handleTotalKgChange = (totalKg: number) => {
    const percent = totalKg > 0 ? (conversion.kg / totalKg) * 100 : 0;
    setConversion({ ...conversion, totalKg, percent });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <Header />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <CardHeader className="relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Average Price Calculator
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Calculate weighted average prices for multiple entries
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={addEntry} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
                <Button onClick={calculateAverage} size="sm" className="btn-hero">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate
                </Button>
                {user && averagePrice > 0 && (
                  <>
                    <Button onClick={handleSave} size="sm" variant="outline">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleExportPDF} size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </>
                )}
                {user && (
                  <Button onClick={() => setShowHistory(!showHistory)} size="sm" variant="outline">
                    <History className="w-4 h-4 mr-2" />
                    {showHistory ? 'Hide' : 'Show'} History
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price Entries</CardTitle>
            <CardDescription>
              Enter price per kg and weight for each lot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {entries.map((entry, index) => (
              <div key={entry.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor={`price-${entry.id}`}>Price per kg (₹)</Label>
                  <Input
                    id={`price-${entry.id}`}
                    type="number"
                    placeholder="0"
                    value={entry.price || ''}
                    onChange={(e) => updateEntry(entry.id, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="flex-1">
                  <Label htmlFor={`weight-${entry.id}`}>Weight (kg)</Label>
                  <Input
                    id={`weight-${entry.id}`}
                    type="number"
                    placeholder="0"
                    value={entry.weight || ''}
                    onChange={(e) => updateEntry(entry.id, 'weight', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="flex-1">
                  <Label>Total Value</Label>
                  <div className="text-lg font-semibold text-muted-foreground">
                    ₹{(entry.price * entry.weight).toLocaleString('en-IN')}
                  </div>
                </div>

                {entries.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {averagePrice > 0 && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300">
                Weighted Average Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                ₹{averagePrice.toFixed(2)} per kg
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Entries</p>
                  <p className="font-semibold">{entries.filter(e => e.price > 0 && e.weight > 0).length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Weight</p>
                  <p className="font-semibold">{totalWeight.toFixed(2)} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Value</p>
                  <p className="font-semibold">₹{totalValue.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showHistory && user && (
          <Card>
            <CardHeader>
              <CardTitle>Calculation History</CardTitle>
              <CardDescription>
                Your saved average calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground text-center py-4">Loading...</p>
              ) : calculations.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No saved calculations yet</p>
              ) : (
                <div className="space-y-4">
                  {calculations.map((calc) => (
                    <div key={calc.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(calc.created_at).toLocaleString('en-IN')}
                          </p>
                          <p className="text-2xl font-bold text-primary mt-1">
                            ₹{Number(calc.average_price).toFixed(2)}/kg
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              exportAverageToPDF({
                                entries: calc.entries,
                                averagePrice: Number(calc.average_price),
                                totalWeight: Number(calc.total_weight),
                                totalValue: Number(calc.total_value),
                                createdAt: calc.created_at,
                              });
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteCalculation(calc.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Entries</p>
                          <p className="font-semibold">{calc.entries.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Weight</p>
                          <p className="font-semibold">{Number(calc.total_weight).toFixed(2)} kg</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Value</p>
                          <p className="font-semibold">₹{Number(calc.total_value).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Kg ⇄ Percent Converter</CardTitle>
            <CardDescription>
              Convert between kilograms and percentage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="total-kg">Total Kg (Base)</Label>
                <Input
                  id="total-kg"
                  type="number"
                  placeholder="100"
                  value={conversion.totalKg || ''}
                  onChange={(e) => handleTotalKgChange(parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="kg-input">Kilograms (Kg)</Label>
                <Input
                  id="kg-input"
                  type="number"
                  placeholder="0"
                  value={conversion.kg || ''}
                  onChange={(e) => handleKgChange(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="percent-input">Percentage (%)</Label>
                <Input
                  id="percent-input"
                  type="number"
                  placeholder="0"
                  value={conversion.percent || ''}
                  onChange={(e) => handlePercentChange(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                {conversion.kg > 0 ? (
                  <>
                    <span className="font-semibold text-foreground">{conversion.kg.toFixed(2)} kg</span> is{' '}
                    <span className="font-semibold text-foreground">{conversion.percent.toFixed(2)}%</span> of{' '}
                    <span className="font-semibold text-foreground">{conversion.totalKg} kg</span>
                  </>
                ) : (
                  "Enter values to see conversion"
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
              <p>Enter the price per kilogram for each lot or purchase</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
              <p>Enter the corresponding weight for each entry</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
              <p>Add more entries using the "Add Entry" button</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
              <p>Click "Calculate Average" to get the weighted average price</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AverageCalculator;