import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Search,
  Database,
  Calendar,
  IndianRupee,
  Package,
  Trash2,
  Download,
  Shield,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/navigation/Header";
import { CalculationResult } from "@/types/calculator";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

interface AdminStats {
  totalUsers: number;
  totalCalculations: number;
  totalProfit: number;
  totalLoss: number;
  avgProfitPerCalculation: number;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, isAdmin } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [calculations, setCalculations] = useState<CalculationResult[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !profileLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      if (!isAdmin()) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
        });
        navigate('/');
        return;
      }

      fetchAdminData();
    }
  }, [user, authLoading, profileLoading, isAdmin, navigate]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Access Required
            </CardTitle>
            <CardDescription>
              Please sign in to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch all calculations with user info
      const { data: calculationsData, error: calcError } = await supabase
        .from('calculations')
        .select('*')
        .order('timestamp', { ascending: false });

      if (calcError) throw calcError;

      // Fetch all users to match with calculations
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

      const formattedCalculations: CalculationResult[] = (calculationsData || []).map((calc) => {
        const userProfile = profilesMap.get(calc.user_id);
        return {
          id: calc.id,
          timestamp: new Date(calc.timestamp),
          farmerName: calc.farmer_name,
          buyerName: calc.buyer_name,
          farmerContact: calc.farmer_contact,
          buyerContact: calc.buyer_contact,
          tripId: calc.trip_id,
          notes: calc.notes,
          grades: calc.grades as any,
          totalBoxes: calc.total_boxes,
          grossSale: calc.gross_sale,
          commissionAmt: calc.commission_amt,
          netSale: calc.net_sale,
          totalCost: calc.total_cost,
          profit: calc.profit,
          totalTransportCost: calc.total_transport_cost,
          totalPackingCost: calc.total_packing_cost,
          totalLabourCost: calc.total_labour_cost,
          totalUtilityCost: calc.total_utility_cost,
          commission: calc.commission,
          transport: calc.transport,
          packing: calc.packing,
          labour: calc.labour,
          miscellaneous: calc.miscellaneous,
          farmerRateKg: calc.farmer_rate_kg,
          kgPerBox: calc.kg_per_box,
          userEmail: userProfile?.email,
          userName: userProfile?.full_name,
        };
      });

      setCalculations(formattedCalculations);

      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Calculate stats
      const totalProfit = formattedCalculations
        .filter(calc => calc.profit > 0)
        .reduce((sum, calc) => sum + calc.profit, 0);
      
      const totalLoss = Math.abs(formattedCalculations
        .filter(calc => calc.profit < 0)
        .reduce((sum, calc) => sum + calc.profit, 0));

      const avgProfit = formattedCalculations.length > 0 
        ? formattedCalculations.reduce((sum, calc) => sum + calc.profit, 0) / formattedCalculations.length
        : 0;

      setStats({
        totalUsers: usersData?.length || 0,
        totalCalculations: formattedCalculations.length,
        totalProfit,
        totalLoss,
        avgProfitPerCalculation: avgProfit,
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load admin data.',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCalculation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('calculations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Calculation deleted successfully!',
      });

      fetchAdminData();
    } catch (error) {
      console.error('Error deleting calculation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete calculation.',
      });
    }
  };

  const exportData = () => {
    const headers = [
      'Date', 'User', 'Email', 'Farmer', 'Buyer', 'Trip ID', 
      'Total Boxes', 'Gross Sale', 'Net Sale', 'Total Cost', 'Profit'
    ];
    
    const rows = filteredCalculations.map(calc => [
      calc.timestamp.toLocaleDateString(),
      calc.userName || 'Unknown',
      calc.userEmail || 'Unknown',
      calc.farmerName || 'Unknown',
      calc.buyerName || 'Unknown',
      calc.tripId || 'N/A',
      calc.totalBoxes,
      calc.grossSale,
      calc.netSale,
      calc.totalCost,
      calc.profit
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-calculations-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Admin data exported successfully!",
    });
  };

  const filteredCalculations = calculations.filter(calc =>
    calc.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.tripId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Admin Access Required
              </CardTitle>
              <CardDescription>
                Please sign in to access the admin panel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/auth')} className="w-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <Header />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <CardHeader className="relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Admin Dashboard
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Manage client calculations and view system analytics
                </CardDescription>
              </div>
              <Button onClick={exportData} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calculator className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Calculations</p>
                    <p className="text-2xl font-bold">{stats.totalCalculations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Profit</p>
                    <p className="text-2xl font-bold text-success">₹{stats.totalProfit.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Loss</p>
                    <p className="text-2xl font-bold text-destructive">₹{stats.totalLoss.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <IndianRupee className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Profit</p>
                    <p className="text-2xl font-bold">₹{stats.avgProfitPerCalculation.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filter */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by farmer, buyer, trip ID, user name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calculations Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Client Database History
              <Badge variant="secondary">{filteredCalculations.length} records</Badge>
            </CardTitle>
            <CardDescription>
              Complete history of all client calculations and transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading admin data...</p>
              </div>
            ) : filteredCalculations.length === 0 ? (
              <div className="text-center py-8">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No calculations found</p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No calculations have been created yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCalculations.map((calc) => (
                  <div key={calc.id} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="gap-1">
                          <Calendar className="w-3 h-3" />
                          {calc.timestamp.toLocaleDateString()}
                        </Badge>
                        <Badge variant="outline">
                          {calc.userEmail || 'Unknown User'}
                        </Badge>
                        {calc.tripId && (
                          <Badge variant="secondary">Trip: {calc.tripId}</Badge>
                        )}
                      </div>
                      <Button
                        onClick={() => deleteCalculation(calc.id)}
                        variant="outline"
                        size="sm"
                        className="gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Farmer</p>
                        <p className="font-medium">{calc.farmerName || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Buyer</p>
                        <p className="font-medium">{calc.buyerName || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Boxes</p>
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          <span className="font-medium">{calc.totalBoxes}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gross Sale</p>
                        <p className="font-medium">₹{calc.grossSale.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Net Sale</p>
                        <p className="font-medium">₹{calc.netSale.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Cost</p>
                        <p className="font-medium">₹{calc.totalCost.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Profit/Loss</p>
                        <div className="flex items-center gap-1">
                          {calc.profit >= 0 ? (
                            <TrendingUp className="w-3 h-3 text-success" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-destructive" />
                          )}
                          <span className={`font-bold ${calc.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                            ₹{Math.abs(calc.profit).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">User</p>
                        <p className="font-medium">{calc.userName || calc.userEmail || 'Unknown'}</p>
                      </div>
                    </div>
                    
                    {calc.notes && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-muted-foreground text-sm mb-1">Notes</p>
                          <p className="text-sm">{calc.notes}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;