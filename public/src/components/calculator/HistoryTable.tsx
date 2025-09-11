import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Trash2, Filter, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { CalculationResult, FilterOptions } from '@/types/calculator';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface HistoryTableProps {
  calculations: CalculationResult[];
  onDelete: (id: string) => Promise<boolean>;
  loading: boolean;
}

export const HistoryTable = ({ calculations, onDelete, loading }: HistoryTableProps) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  const handleDelete = async (id: string) => {
    const success = await onDelete(id);
    if (success) {
      toast({
        title: 'Deleted',
        description: 'Calculation removed from history',
      });
    }
  };

  const filteredCalculations = calculations.filter((calc) => {
    const matchesSearch =
      !searchTerm ||
      calc.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.tripId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.grades.some(grade => grade.note.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGrade = !filters.grade || calc.grades.some(grade => grade.note === filters.grade);
    const matchesFarmer = !filters.farmerName || calc.farmerName === filters.farmerName;
    const matchesBuyer = !filters.buyerName || calc.buyerName === filters.buyerName;
    const matchesProfit = !filters.profitOnly || calc.profit > 0;

    const matchesDateRange =
      (!filters.startDate || calc.timestamp >= filters.startDate) &&
      (!filters.endDate || calc.timestamp <= filters.endDate);

    return matchesSearch && matchesGrade && matchesFarmer && matchesBuyer && matchesProfit && matchesDateRange;
  });

  const getBestWorstGrades = () => {
    const allGrades = calculations.flatMap(calc => calc.grades);
    if (allGrades.length === 0) return { best: null, worst: null };

    const bestGrade = allGrades.reduce((best, current) => 
      (current.profitPerBox || 0) > (best.profitPerBox || 0) ? current : best
    );

    const worstGrade = allGrades.reduce((worst, current) => 
      (current.profitPerBox || 0) < (worst.profitPerBox || 0) ? current : worst
    );

    return { best: bestGrade, worst: worstGrade };
  };

  const { best, worst } = getBestWorstGrades();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calculation History</CardTitle>
          <CardDescription>Loading your saved calculations...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Calculation History
            </CardTitle>
            <CardDescription>
              Your saved calculations with advanced filtering and analytics
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">
            {calculations.length} calculations
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by farmer, buyer, trip ID, or grade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Select value={filters.grade || ''} onValueChange={(value) => 
                setFilters(prev => ({ ...prev, grade: value || undefined }))
              }>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Grades</SelectItem>
                  {Array.from(new Set(calculations.flatMap(calc => calc.grades.map(g => g.note))))
                    .sort()
                    .map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                variant={filters.profitOnly ? 'default' : 'outline'}
                onClick={() => setFilters(prev => ({ ...prev, profitOnly: !prev.profitOnly }))}
                size="sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                Profitable Only
              </Button>
            </div>
          </div>

          {/* Best/Worst Grade Highlights */}
          {best && worst && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                Best Grade: {best.note} (₹{best.profitPerBox?.toFixed(2)}/box)
              </Badge>
              <Badge className="bg-red-100 text-red-800 border-red-200">
                <TrendingDown className="w-3 h-3 mr-1" />
                Worst Grade: {worst.note} (₹{worst.profitPerBox?.toFixed(2)}/box)
              </Badge>
            </div>
          )}
        </div>

        {/* History Table */}
        {filteredCalculations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {calculations.length === 0 
              ? "No calculations saved yet. Start calculating to build your history!"
              : "No calculations match your current filters."
            }
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Trip ID</TableHead>
                  <TableHead>Total Boxes</TableHead>
                  <TableHead>Gross Sale</TableHead>
                  <TableHead>Profit/Loss</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalculations.map((calc) => (
                  <TableRow key={calc.id}>
                    <TableCell className="font-medium">
                      {format(calc.timestamp, 'MMM dd, yyyy')}
                      <div className="text-xs text-muted-foreground">
                        {format(calc.timestamp, 'HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{calc.farmerName || 'N/A'}</div>
                        {calc.farmerContact && (
                          <div className="text-xs text-muted-foreground">{calc.farmerContact}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{calc.buyerName || 'N/A'}</div>
                        {calc.buyerContact && (
                          <div className="text-xs text-muted-foreground">{calc.buyerContact}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{calc.tripId || 'No ID'}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {calc.totalBoxes.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{calc.grossSale.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={calc.profit >= 0 ? 'default' : 'destructive'}
                        className={calc.profit >= 0 ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {calc.profit >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        ₹{Math.abs(calc.profit).toLocaleString('en-IN')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(
                            `Date: ${format(calc.timestamp, 'MMM dd, yyyy')}\nFarmer: ${calc.farmerName || 'N/A'}\nBuyer: ${calc.buyerName || 'N/A'}\nTrip ID: ${calc.tripId || 'N/A'}\nTotal Boxes: ${calc.totalBoxes}\nGross Sale: ₹${calc.grossSale.toLocaleString('en-IN')}\nProfit: ₹${calc.profit.toLocaleString('en-IN')}\nGrades: ${calc.grades.map(g => `${g.note}: ${g.boxes} boxes @ ₹${g.rate}`).join(', ')}`,
                            'Calculation details'
                          )}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(calc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};