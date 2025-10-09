import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/ui/footer";
import { BackButton } from "@/components/ui/BackButton";
import { UniversalShare } from "@/components/shared/UniversalShare";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalculations } from "@/hooks/useCalculations";
import { ProfitChart } from "@/components/calculator/ProfitChart";
import { HistoryTable } from "@/components/calculator/HistoryTable";
import { Loader2 } from "lucide-react";

export const History = () => {
  const { calculations, deleteCalculation, loading } = useCalculations();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
        <Header />
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <BackButton />
            <UniversalShare />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your calculation history...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <BackButton />
          <UniversalShare />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <CardHeader className="relative">
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Calculation History & Progress
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              View your saved calculations, profit trends, and analytics
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Profit Trend Chart */}
        {calculations.length > 0 && (
          <ProfitChart data={calculations.slice(0, 20)} />
        )}

        {/* History Table */}
        <HistoryTable 
          calculations={calculations}
          onDelete={deleteCalculation}
          loading={loading}
        />

        {calculations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                No calculations saved yet. Start calculating to build your history!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default History;
