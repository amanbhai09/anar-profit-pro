import { useState, useCallback, useEffect } from "react";
import { Plus, Calculator, Download, RefreshCw, Save, BarChart3, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { GradeData, CalculationResult, CostSettings as CostSettingsType } from "@/types/calculator";
import { GradeRow } from "./GradeRow";
import { CostSettings } from "./CostSettings";
import { SummaryCards } from "./SummaryCards";
import { ContactInfo } from "./ContactInfo";
import { ProfitChart } from "./ProfitChart";
import { AlertSystem } from "./AlertSystem";

const defaultGrades: Omit<GradeData, 'id'>[] = [
  { note: '4 dana', boxes: 1, rate: 1890, gross: 1890 },
  { note: '10 dana', boxes: 1, rate: 1700, gross: 1700 },
  { note: '18 dana', boxes: 1, rate: 1650, gross: 1650 },
  { note: '30 dana', boxes: 1, rate: 1500, gross: 1500 },
  { note: 'small', boxes: 1, rate: 1300, gross: 1300 }
];

const defaultCostSettings: CostSettingsType = {
  commission: 6,
  transport: 75,
  packing: 75,
  labour: 0,
  miscellaneous: 0,
  farmerRateKg: 131,
  kgPerBox: 10,
};

export const AnarCalculator = () => {
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [costSettings, setCostSettings] = useState<CostSettingsType>(defaultCostSettings);
  const [currentResult, setCurrentResult] = useState<CalculationResult | undefined>();
  const [calculationHistory, setCalculationHistory] = useState<CalculationResult[]>([]);
  const [showChart, setShowChart] = useState(false);
  
  // Contact and transaction info
  const [farmerName, setFarmerName] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [farmerContact, setFarmerContact] = useState("");
  const [buyerContact, setBuyerContact] = useState("");
  const [tripId, setTripId] = useState("");
  const [notes, setNotes] = useState("");

  // Initialize with default grades
  useEffect(() => {
    const initialGrades = defaultGrades.map((grade, index) => ({
      ...grade,
      id: `grade-${Date.now()}-${index}`,
    }));
    setGrades(initialGrades);
  }, []);

  const updateContactInfo = (field: string, value: string) => {
    switch (field) {
      case 'farmerName': setFarmerName(value); break;
      case 'buyerName': setBuyerName(value); break;
      case 'farmerContact': setFarmerContact(value); break;
      case 'buyerContact': setBuyerContact(value); break;
      case 'tripId': setTripId(value); break;
      case 'notes': setNotes(value); break;
    }
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
    toast.success("New grade added!");
  };

  const updateGrade = (updatedGrade: GradeData) => {
    setGrades(grades.map(grade => 
      grade.id === updatedGrade.id ? updatedGrade : grade
    ));
  };

  const removeGrade = (id: string) => {
    setGrades(grades.filter(grade => grade.id !== id));
    toast.success("Grade removed!");
  };

  const fillSampleData = () => {
    const sampleGrades = defaultGrades.map((grade, index) => ({
      ...grade,
      id: `grade-${Date.now()}-${index}`,
    }));
    setGrades(sampleGrades);
    toast.success("Sample data loaded!");
  };

  const clearAll = () => {
    setGrades([]);
    setCurrentResult(undefined);
    toast.info("Calculator cleared!");
  };

  const calculate = useCallback(() => {
    const totalBoxes = grades.reduce((sum, grade) => sum + (Number(grade.boxes) || 0), 0);
    const grossSale = grades.reduce((sum, grade) => sum + (Number(grade.gross) || 0), 0);
    const commissionAmt = grossSale * (costSettings.commission / 100);
    const netSale = grossSale - commissionAmt;

    const farmerPerBox = costSettings.farmerRateKg * costSettings.kgPerBox;
    const costPerBox = farmerPerBox + costSettings.transport + costSettings.packing + 
                      costSettings.labour + costSettings.miscellaneous;
    const totalCost = costPerBox * totalBoxes;

    const profit = netSale - totalCost;

    const result: CalculationResult = {
      id: `calc-${Date.now()}`,
      timestamp: new Date(),
      farmerName: farmerName || undefined,
      buyerName: buyerName || undefined,
      farmerContact: farmerContact || undefined,
      buyerContact: buyerContact || undefined,
      tripId: tripId || undefined,
      notes: notes || undefined,
      grades: [...grades],
      totalBoxes,
      grossSale,
      commissionAmt,
      netSale,
      totalCost,
      profit,
      totalTransportCost: costSettings.transport * totalBoxes,
      totalPackingCost: costSettings.packing * totalBoxes,
      totalLabourCost: costSettings.labour * totalBoxes,
      totalUtilityCost: costSettings.miscellaneous * totalBoxes,
      ...costSettings,
    };

    setCurrentResult(result);
    setCalculationHistory(prev => [result, ...prev].slice(0, 50)); // Keep last 50 calculations
    
    toast.success(`Calculation complete! ${profit >= 0 ? 'Profit' : 'Loss'}: ₹${Math.abs(profit).toLocaleString('en-IN')}`);
  }, [grades, costSettings, farmerName, buyerName, farmerContact, buyerContact, tripId, notes]);

  const downloadCSV = () => {
    if (!currentResult) {
      toast.error("Please calculate first!");
      return;
    }

    const headers = ['Grade', 'Boxes', 'Rate_per_box', 'Gross'];
    const rows = currentResult.grades.map(grade => [
      grade.note,
      grade.boxes,
      grade.rate,
      grade.gross
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
    
    toast.success("CSV downloaded!");
  };

  // Find highest and lowest grossing grades for highlighting
  const gradesByGross = [...grades].sort((a, b) => b.gross - a.gross);
  const highestGrade = gradesByGross[0];
  const lowestGrade = gradesByGross[gradesByGross.length - 1];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-gradient-primary">
            Anar Profit Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional box-based pomegranate profit analysis with grade-wise tracking, 
            trend charts, and comprehensive reporting.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Button onClick={addGrade} className="btn-hero">
            <Plus className="w-4 h-4 mr-2" />
            Add Grade
          </Button>
          <Button onClick={calculate} className="btn-success">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate
          </Button>
          <Button onClick={fillSampleData} variant="outline" className="btn-ghost-elegant">
            <RefreshCw className="w-4 h-4 mr-2" />
            Fill Sample
          </Button>
          <Button onClick={downloadCSV} variant="outline" className="btn-ghost-elegant">
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
          <Button 
            onClick={() => setShowChart(!showChart)} 
            variant="outline" 
            className="btn-ghost-elegant"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showChart ? 'Hide Chart' : 'Show Chart'}
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* Contact Information */}
            <ContactInfo
              farmerName={farmerName}
              buyerName={buyerName}
              farmerContact={farmerContact}
              buyerContact={buyerContact}
              tripId={tripId}
              notes={notes}
              onUpdate={updateContactInfo}
            />

            {/* Cost Settings */}
            <CostSettings 
              settings={costSettings}
              onUpdate={setCostSettings}
            />

            {/* Grades Table */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Grade Analysis</CardTitle>
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
                    <p>No grades added yet. Click "Add Grade" to start.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profit Chart */}
            {showChart && calculationHistory.length > 0 && (
              <ProfitChart data={calculationHistory.slice(0, 10)} />
            )}
          </div>

          <div className="space-y-8">
            {/* Alerts */}
            <AlertSystem result={currentResult} grades={grades} />
            
            {/* Summary Cards */}
            <SummaryCards result={currentResult} />

            {/* Instructions */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                  <p>Enter farmer and buyer details for tracking.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                  <p>Add grade-wise boxes and broker rates per box.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                  <p>Configure cost settings (commission, transport, etc.).</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                  <p>Click Calculate to see profit analysis and trends.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            © 2025 ❤️ Aman Bhai @ All rights reserved ❤️
          </p>
        </div>
      </div>
    </div>
  );
};