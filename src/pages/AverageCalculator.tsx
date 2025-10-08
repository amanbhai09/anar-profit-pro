import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Plus, Trash2, Download, Save, History, Upload, Clipboard, Mic, MicOff, Sparkles, MessageSquare, TrendingUp, Share2 } from "lucide-react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/ui/footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAverageCalculations } from "@/hooks/useAverageCalculations";
import { exportAverageToPDF } from "@/utils/averagePdfExport";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const [isListening, setIsListening] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
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

  const clearForm = () => {
    setEntries([{ id: '1', price: 0, weight: 0 }]);
    setAveragePrice(0);
    setTotalWeight(0);
    setTotalValue(0);
    toast({
      title: "Form Cleared",
      description: "All entries have been reset",
    });
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header row, expect columns: price,weight
      const newEntries: PriceEntry[] = [];
      
      lines.slice(1).forEach((line, index) => {
        const [priceStr, weightStr] = line.split(',');
        const price = parseFloat(priceStr?.trim() || '0');
        const weight = parseFloat(weightStr?.trim() || '0');
        
        if (price > 0 && weight > 0) {
          newEntries.push({
            id: (Date.now() + index).toString(),
            price,
            weight
          });
        }
      });

      if (newEntries.length > 0) {
        setEntries(newEntries);
        toast({
          title: "CSV Imported Successfully",
          description: `Imported ${newEntries.length} entries`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "No valid entries found. Expected format: price,weight",
        });
      }
    };
    
    reader.readAsText(file);
  };

  const copySummary = () => {
    if (averagePrice === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please calculate average first",
      });
      return;
    }

    const summary = `Average Price Calculator Summary
==============================
Weighted Average Price: ₹${averagePrice.toFixed(2)} per kg
Total Weight: ${totalWeight.toFixed(2)} kg
Total Value: ₹${totalValue.toLocaleString('en-IN')}
Number of Entries: ${entries.filter(e => e.price > 0 && e.weight > 0).length}

Generated on: ${new Date().toLocaleDateString('en-IN')}`;

    navigator.clipboard.writeText(summary).then(() => {
      toast({
        title: "Summary Copied",
        description: "Summary copied to clipboard",
      });
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Failed to copy summary to clipboard",
      });
    });
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Voice input is not supported in your browser",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Say: 'Price 100 weight 50' or just numbers",
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Voice input:', transcript);
      
      // Extract numbers from speech
      const numbers = transcript.match(/\d+\.?\d*/g);
      
      if (numbers && numbers.length >= 2) {
        const price = parseFloat(numbers[0]);
        const weight = parseFloat(numbers[1]);
        
        const newEntry: PriceEntry = {
          id: Date.now().toString(),
          price,
          weight
        };
        
        setEntries([...entries, newEntry]);
        
        toast({
          title: "Entry Added",
          description: `Price: ₹${price}, Weight: ${weight}kg`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Could not parse",
          description: "Please say price and weight clearly",
        });
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Voice input failed. Please try again.",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const getAIAnalysis = async () => {
    if (averagePrice === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please calculate average first",
      });
      return;
    }

    setIsAnalyzing(true);
    setShowAnalysis(true);

    try {
      const validEntries = entries
        .filter(entry => entry.price > 0 && entry.weight > 0)
        .map(({ price, weight }) => ({ price, weight }));

      const { data, error } = await supabase.functions.invoke('analyze-prices', {
        body: {
          entries: validEntries,
          averagePrice,
          totalWeight,
          totalValue
        }
      });

      if (error) {
        if (error.message?.includes('Rate limit')) {
          toast({
            variant: "destructive",
            title: "Rate Limited",
            description: "Too many requests. Please wait a moment.",
          });
        } else if (error.message?.includes('credits')) {
          toast({
            variant: "destructive",
            title: "Credits Exhausted",
            description: "Please add AI credits to your workspace.",
          });
        } else {
          throw error;
        }
        setShowAnalysis(false);
        return;
      }

      setAiAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "AI insights generated successfully",
      });
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not generate AI insights",
      });
      setShowAnalysis(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const shareToWhatsApp = () => {
    if (averagePrice === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please calculate average first",
      });
      return;
    }

    const message = `📊 *Average Price Calculator*%0A%0A` +
      `💰 *Weighted Average:* ₹${averagePrice.toFixed(2)}/kg%0A` +
      `⚖️ *Total Weight:* ${totalWeight.toFixed(2)} kg%0A` +
      `💵 *Total Value:* ₹${totalValue.toLocaleString('en-IN')}%0A` +
      `📦 *Entries:* ${entries.filter(e => e.price > 0 && e.weight > 0).length}%0A%0A` +
      `Generated via Anar Profit Calculator`;

    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareViaEmail = () => {
    if (averagePrice === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please calculate average first",
      });
      return;
    }

    const subject = `Average Price Calculator Report - ${new Date().toLocaleDateString('en-IN')}`;
    const body = `Average Price Calculator Summary%0A%0A` +
      `Weighted Average Price: ₹${averagePrice.toFixed(2)} per kg%0A` +
      `Total Weight: ${totalWeight.toFixed(2)} kg%0A` +
      `Total Value: ₹${totalValue.toLocaleString('en-IN')}%0A` +
      `Number of Entries: ${entries.filter(e => e.price > 0 && e.weight > 0).length}%0A%0A` +
      `Generated on: ${new Date().toLocaleString('en-IN')}`;

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Chart data
  const chartData = entries
    .filter(e => e.price > 0 && e.weight > 0)
    .map((entry, index) => ({
      name: `Entry ${index + 1}`,
      value: entry.price * entry.weight,
      price: entry.price,
      weight: entry.weight
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

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
                <Button onClick={clearForm} size="sm" variant="outline">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleImportCSV}
                />
                <Button onClick={triggerImport} size="sm" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
                <Button onClick={copySummary} size="sm" variant="outline">
                  <Clipboard className="w-4 h-4 mr-2" />
                  Copy Summary
                </Button>
                <Button 
                  onClick={startVoiceInput} 
                  size="sm" 
                  variant={isListening ? "default" : "outline"}
                  disabled={isListening}
                >
                  {isListening ? <Mic className="w-4 h-4 mr-2 animate-pulse" /> : <MicOff className="w-4 h-4 mr-2" />}
                  {isListening ? "Listening..." : "Voice"}
                </Button>
                {averagePrice > 0 && (
                  <>
                    <Button onClick={getAIAnalysis} size="sm" variant="outline" disabled={isAnalyzing}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {isAnalyzing ? "Analyzing..." : "AI Insights"}
                    </Button>
                    <Button onClick={shareToWhatsApp} size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button onClick={shareViaEmail} size="sm" variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </>
                )}
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
          <>
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

            {chartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Price Distribution
                  </CardTitle>
                  <CardDescription>
                    Visual breakdown of your purchases by total value
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {chartData.map((entry, index) => (
                      <div key={index} className="flex justify-between items-center text-sm p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span>{entry.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{entry.value.toLocaleString('en-IN')}</div>
                          <div className="text-xs text-muted-foreground">
                            ₹{entry.price}/kg × {entry.weight}kg
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {showAnalysis && (
              <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Sparkles className="w-5 h-5" />
                    AI Price Analysis
                  </CardTitle>
                  <CardDescription>
                    Intelligent insights powered by AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <span className="ml-3 text-muted-foreground">Analyzing your prices...</span>
                    </div>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-foreground">{aiAnalysis}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
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
