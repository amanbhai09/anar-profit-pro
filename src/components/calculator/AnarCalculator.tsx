import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Download, Calculator, TrendingUp, TrendingDown, Copy, Trash2, AlertTriangle, BarChart3, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/navigation/Header";
import { useCalculations } from "@/hooks/useCalculations";
import { HistoryTable } from "./HistoryTable";
import { GradeData, CalculationResult, CostSettings } from "@/types/calculator";
import { ProfitChart } from "./ProfitChart";
import { GradeRow } from "./GradeRow";
import { CostSettings as CostSettingsComponent } from "./CostSettings";
import { SummaryCards } from "./SummaryCards";
import { ContactInfo } from "./ContactInfo";
import { AlertSystem } from "./AlertSystem";

const defaultGrades: Omit<GradeData, 'id'>[] = [
  { note: '4 dana', boxes: 1, rate: 1890, gross: 1890 },
  { note: '10 dana', boxes: 1, rate: 1700, gross: 1700 },
  { note: '18 dana', boxes: 1, rate: 1650, gross: 1650 },
  { note: '30 dana', boxes: 1, rate: 1500, gross: 1500 },
  { note: 'small', boxes: 1, rate: 1300, gross: 1300 }
];

const defaultCostSettings: CostSettings = {
  commission: 6,
  transport: 75,
  packing: 75,
  labour: 0,
  miscellaneous: 0,
  farmerRateKg: 131,
  kgPerBox: 10,
};

export const AnarCalculator = () => {
  const { toast } = useToast();
  const { calculations, saveCalculation, deleteCalculation, loading: historyLoading } = useCalculations();
  
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [costSettings, setCostSettings] = useState<CostSettings>(defaultCostSettings);
  const [currentResult, setCurrentResult] = useState<CalculationResult | undefined>();
  const [showChart, setShowChart] = useState(false);
  
  // Contact and transaction info
  const [contactInfo, setContactInfo] = useState({
    farmerName: "",
    buyerName: "",
    farmerContact: "",
    buyerContact: "",
    tripId: "",
    notes: ""
  });

  // Initialize with default grades
  useEffect(() => {
    const initialGrades = defaultGrades.map((grade, index) => ({
      ...grade,
      id: `grade-${Date.now()}-${index}`,
    }));
    setGrades(initialGrades);
  }, []);

  const updateContactInfo = (field: string, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const addGrade = () => {
    const newGrade: GradeData = {
      id: `grade-${Date.now()}`,
      note: '',
      boxes: 0,
      rate: 0,
      gross: 0,
    };
    setGrades([...grades, newGrade]);
    toast({
      title: "Success",
      description: "New grade added!",
    });
  };

  const updateGrade = (updatedGrade: GradeData) => {
    setGrades(grades.map(grade => 
      grade.id === updatedGrade.id ? updatedGrade : grade
    ));
  };

  const removeGrade = (id: string) => {
    setGrades(grades.filter(grade => grade.id !== id));
    toast({
      title: "Success",
      description: "Grade removed!",
    });
  };

  const fillSampleData = () => {
    const sampleGrades = defaultGrades.map((grade, index) => ({
      ...grade,
      id: `grade-${Date.now()}-${index}`,
    }));
    setGrades(sampleGrades);
    toast({
      title: "Success",
      description: "Sample data loaded!",
    });
  };

  const clearAll = () => {
    setGrades([]);
    setCurrentResult(undefined);
    toast({
      title: "Info",
      description: "Calculator cleared!",
    });
  };

  const calculateResults = useCallback((): CalculationResult => {
    const totalBoxes = grades.reduce((sum, grade) => sum + grade.boxes, 0);
    const grossSale = grades.reduce((sum, grade) => sum + grade.gross, 0);
    
    const commissionAmt = grossSale * (costSettings.commission / 100);
    const netSale = grossSale - commissionAmt;
    
    const farmerPerBox = costSettings.farmerRateKg * costSettings.kgPerBox;
    const costPerBox = farmerPerBox + costSettings.transport + costSettings.packing + costSettings.labour + costSettings.miscellaneous;
    const totalCost = costPerBox * totalBoxes;
    
    const profit = netSale - totalCost;
    
    const totalTransportCost = costSettings.transport * totalBoxes;
    const totalPackingCost = costSettings.packing * totalBoxes;
    const totalLabourCost = costSettings.labour * totalBoxes;
    const totalUtilityCost = costSettings.miscellaneous * totalBoxes;
    
    // Add profit per box and margin % to grades
    const gradesWithMetrics = grades.map(grade => ({
      ...grade,
      profitPerBox: grade.boxes > 0 ? (grade.gross - (grade.boxes * costPerBox)) / grade.boxes : 0,
      marginPercent: grade.gross > 0 ? ((grade.gross - (grade.boxes * costPerBox)) / grade.gross) * 100 : 0
    }));

    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      farmerName: contactInfo.farmerName,
      buyerName: contactInfo.buyerName,
      farmerContact: contactInfo.farmerContact,
      buyerContact: contactInfo.buyerContact,
      tripId: contactInfo.tripId,
      notes: contactInfo.notes,
      grades: gradesWithMetrics,
      totalBoxes,
      grossSale,
      commissionAmt,
      netSale,
      totalCost,
      profit,
      totalTransportCost,
      totalPackingCost,
      totalLabourCost,
      totalUtilityCost,
      commission: costSettings.commission,
      transport: costSettings.transport,
      packing: costSettings.packing,
      labour: costSettings.labour,
      miscellaneous: costSettings.miscellaneous,
      farmerRateKg: costSettings.farmerRateKg,
      kgPerBox: costSettings.kgPerBox,
    };
  }, [grades, costSettings, contactInfo]);

  const calculate = () => {
    const result = calculateResults();
    setCurrentResult(result);
    
    toast({
      title: "Calculation Complete",
      description: `${result.profit >= 0 ? 'Profit' : 'Loss'}: ₹${Math.abs(result.profit).toLocaleString('en-IN')}`,
    });
  };

  const handleSaveCalculation = async () => {
    const result = calculateResults();
    const savedId = await saveCalculation(result);
    if (savedId) {
      setCurrentResult(result);
      toast({
        title: "Success",
        description: "Calculation saved to your history!",
      });
    }
  };

  const downloadCSV = () => {
    if (!currentResult) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please calculate first!",
      });
      return;
    }

    const headers = ['Grade', 'Boxes', 'Rate_per_box', 'Gross', 'Profit_per_box'];
    const rows = currentResult.grades.map(grade => [
      grade.note,
      grade.boxes,
      grade.rate,
      grade.gross,
      grade.profitPerBox?.toFixed(2) || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anar-calculation-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "CSV downloaded!",
    });
  };

  // Find highest and lowest grossing grades for highlighting
  const gradesByGross = [...grades].sort((a, b) => b.gross - a.gross);
  const highestGrade = gradesByGross[0];
  const lowestGrade = gradesByGross[gradesByGross.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <Header />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        <AlertSystem result={currentResult} grades={grades} />
        
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <CardHeader className="relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Anar Profit Calculator
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Professional pomegranate trading calculator with advanced analytics
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={addGrade} size="sm" className="shadow-elegant hover:shadow-glow transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Grade
                </Button>
                <Button onClick={fillSampleData} variant="outline" size="sm">
                  Fill Sample
                </Button>
                <Button onClick={clearAll} variant="outline" size="sm">
                  Clear All
                </Button>
                <Button onClick={calculate} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate
                </Button>
                <Button onClick={handleSaveCalculation} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  Save Calculation
                </Button>
                <Button onClick={downloadCSV} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Contact Information */}
            <ContactInfo
              farmerName={contactInfo.farmerName}
              buyerName={contactInfo.buyerName}
              farmerContact={contactInfo.farmerContact}
              buyerContact={contactInfo.buyerContact}
              tripId={contactInfo.tripId}
              notes={contactInfo.notes}
              onUpdate={updateContactInfo}
            />

            {/* Cost Settings */}
            <CostSettingsComponent 
              settings={costSettings}
              onUpdate={setCostSettings}
            />

            {/* Grades Table */}
            <Card className="shadow-card hover:shadow-elegant transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Grade Analysis
                  {grades.length > 0 && (
                    <Badge variant="secondary">{grades.length} grades</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Enter box quantities and rates for each pomegranate grade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {grades.map((grade) => (
                    <GradeRow
                      key={grade.id}
                      grade={grade}
                      onUpdate={updateGrade}
                      onRemove={removeGrade}
                      isHighest={highestGrade?.id === grade.id && grade.gross > 0}
                      isLowest={lowestGrade?.id === grade.id && grade.gross > 0 && grades.length > 1}
                    />
                  ))}
                </div>
                
                {grades.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No grades added yet</p>
                    <p className="text-sm">Click "Add Grade" or "Fill Sample" to start calculating</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profit Chart */}
            {showChart && calculations.length > 0 && (
              <ProfitChart data={calculations.slice(0, 10)} />
            )}

            {/* History Table */}
            <HistoryTable 
              calculations={calculations}
              onDelete={deleteCalculation}
              loading={historyLoading}
            />
          </div>

          <div className="space-y-6">
            {/* Summary Cards */}
            <SummaryCards result={currentResult} />

            {/* Instructions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                  <p>Sign in to save your calculations and access history</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                  <p>Enter farmer and buyer details for tracking</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                  <p>Add grade-wise boxes and broker rates per box</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                  <p>Configure cost settings (commission, transport, etc.)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">5</span>
                  <p>Click Calculate and Save to track your profits</p>
                </div>
              </CardContent>
            </Card>

            {/* Chart Toggle */}
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <Button 
                  onClick={() => setShowChart(!showChart)} 
                  variant="outline" 
                  className="w-full"
                  disabled={calculations.length === 0}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {showChart ? 'Hide Profit Chart' : 'Show Profit Chart'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};