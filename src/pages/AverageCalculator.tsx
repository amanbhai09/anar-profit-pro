import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Plus, Trash2 } from "lucide-react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/ui/footer";
import { useToast } from "@/hooks/use-toast";

interface PriceEntry {
  id: string;
  price: number;
  weight: number;
}

export const AverageCalculator = () => {
  const [entries, setEntries] = useState<PriceEntry[]>([
    { id: '1', price: 0, weight: 0 }
  ]);
  const [averagePrice, setAveragePrice] = useState<number>(0);
  const { toast } = useToast();

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

    const totalValue = validEntries.reduce((sum, entry) => sum + (entry.price * entry.weight), 0);
    const totalWeight = validEntries.reduce((sum, entry) => sum + entry.weight, 0);
    
    const average = totalValue / totalWeight;
    setAveragePrice(average);

    toast({
      title: "Success",
      description: `Weighted average price calculated: ₹${average.toFixed(2)}`,
    });
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
                <Button onClick={addEntry} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
                <Button onClick={calculateAverage} size="sm" className="btn-hero">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Average
                </Button>
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
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                ₹{averagePrice.toFixed(2)} per kg
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                Based on {entries.filter(e => e.price > 0 && e.weight > 0).length} valid entries
              </p>
            </CardContent>
          </Card>
        )}

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