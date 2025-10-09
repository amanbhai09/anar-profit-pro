import { useState } from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/ui/footer';
import { useRealTrades } from '@/hooks/useRealTrades';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, MapPin, User, Package, Weight, DollarSign, Trash2, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RealTrade = () => {
  const { trades, loading, stats, saveTrade, deleteTrade } = useRealTrades();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    location: '',
    broker_name: '',
    grade: 'A',
    kg_loaded: '',
    farmer_price_per_kg: '',
    broker_net_per_kg: '',
    notes: '',
  });

  const locations = ['Delhi', 'Jaipur', 'Mumbai', 'Bangalore', 'Pune', 'Ahmedabad'];
  const grades = ['A', 'B', 'C', 'D', 'Premium'];

  const calculateProfit = () => {
    const farmerPrice = parseFloat(formData.farmer_price_per_kg) || 0;
    const brokerNet = parseFloat(formData.broker_net_per_kg) || 0;
    const kg = parseFloat(formData.kg_loaded) || 0;
    const netPerKg = brokerNet - farmerPrice;
    const totalProfit = netPerKg * kg;
    return { netPerKg, totalProfit };
  };

  const { netPerKg, totalProfit } = calculateProfit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location || !formData.grade || !formData.kg_loaded || 
        !formData.farmer_price_per_kg || !formData.broker_net_per_kg) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields',
      });
      return;
    }

    await saveTrade({
      location: formData.location,
      broker_name: formData.broker_name || null,
      grade: formData.grade,
      kg_loaded: parseFloat(formData.kg_loaded),
      farmer_price_per_kg: parseFloat(formData.farmer_price_per_kg),
      broker_net_per_kg: parseFloat(formData.broker_net_per_kg),
      notes: formData.notes || null,
    });

    setFormData({
      location: '',
      broker_name: '',
      grade: 'A',
      kg_loaded: '',
      farmer_price_per_kg: '',
      broker_net_per_kg: '',
      notes: '',
    });
  };

  const shareStats = () => {
    const message = `🌟 Real Trade Stats\n\nTotal Trades: ${stats?.totalTrades}\nTotal Profit: ₹${stats?.totalProfit.toFixed(2)}\nTotal KG: ${stats?.totalKg.toFixed(2)}\nAvg Profit/KG: ₹${stats?.avgProfitPerKg.toFixed(2)}`;
    
    if (navigator.share) {
      navigator.share({ text: message });
    } else {
      navigator.clipboard.writeText(message);
      toast({ title: 'Copied to clipboard!' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gradient-primary">🌟 Real Trade</h1>
            <p className="text-muted-foreground mt-2">Advanced trade tracking and analytics</p>
          </div>
          {stats && (
            <Button onClick={shareStats} variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share Stats
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="card-premium">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalTrades}</div>
              </CardContent>
            </Card>
            <Card className={stats.totalProfit >= 0 ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center gap-2">
                  ₹{stats.totalProfit.toFixed(2)}
                  {stats.totalProfit >= 0 ? <TrendingUp className="text-green-500" /> : <TrendingDown className="text-red-500" />}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total KG</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalKg.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Profit/KG</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{stats.avgProfitPerKg.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Input Form */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>📝 Record New Trade</CardTitle>
            <CardDescription>Enter all trade details for accurate tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">📍 Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="broker_name">🧑‍💼 Broker Name</Label>
                  <Input
                    id="broker_name"
                    value={formData.broker_name}
                    onChange={(e) => setFormData({ ...formData, broker_name: e.target.value })}
                    placeholder="e.g., Singh Brokers"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">📦 Grade *</Label>
                  <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kg_loaded">⚖️ KG Loaded *</Label>
                  <Input
                    id="kg_loaded"
                    type="number"
                    step="0.01"
                    value={formData.kg_loaded}
                    onChange={(e) => setFormData({ ...formData, kg_loaded: e.target.value })}
                    placeholder="e.g., 1200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farmer_price">💰 Farmer Price (₹/kg) *</Label>
                  <Input
                    id="farmer_price"
                    type="number"
                    step="0.01"
                    value={formData.farmer_price_per_kg}
                    onChange={(e) => setFormData({ ...formData, farmer_price_per_kg: e.target.value })}
                    placeholder="e.g., 32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="broker_net">💸 Broker Net (₹/kg) *</Label>
                  <Input
                    id="broker_net"
                    type="number"
                    step="0.01"
                    value={formData.broker_net_per_kg}
                    onChange={(e) => setFormData({ ...formData, broker_net_per_kg: e.target.value })}
                    placeholder="e.g., 36"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">🧾 Notes / Remarks</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Quality slightly low today..."
                  rows={3}
                />
              </div>

              {/* Auto Calculations */}
              <Card className={totalProfit >= 0 ? "bg-green-500/10" : "bg-red-500/10"}>
                <CardHeader>
                  <CardTitle className="text-lg">🧮 Auto Calculations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Farmer–Broker Net:</span>
                    <span className="text-xl font-bold">₹{netPerKg.toFixed(2)}/kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Profit/Loss:</span>
                    <span className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ₹{totalProfit.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full btn-hero" size="lg">
                Save Trade Record
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {stats && stats.dailyStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.dailyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit (₹)" />
                      <Line type="monotone" dataKey="kg" stroke="#3b82f6" name="KG" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No daily data yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {stats && stats.weeklyStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.weeklyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="profit" fill="#10b981" name="Profit (₹)" />
                      <Bar dataKey="kg" fill="#3b82f6" name="KG" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No weekly data yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {stats && stats.monthlyStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.monthlyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="profit" fill="#10b981" name="Profit (₹)" />
                      <Bar dataKey="kg" fill="#3b82f6" name="KG" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No monthly data yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Trade History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Trade History</CardTitle>
          </CardHeader>
          <CardContent>
            {trades.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Broker</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>KG</TableHead>
                      <TableHead>Farmer ₹/kg</TableHead>
                      <TableHead>Broker ₹/kg</TableHead>
                      <TableHead>Net ₹/kg</TableHead>
                      <TableHead>Total P/L</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>{new Date(trade.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{trade.location}</TableCell>
                        <TableCell>{trade.broker_name || '-'}</TableCell>
                        <TableCell>{trade.grade}</TableCell>
                        <TableCell>{trade.kg_loaded}</TableCell>
                        <TableCell>₹{trade.farmer_price_per_kg}</TableCell>
                        <TableCell>₹{trade.broker_net_per_kg}</TableCell>
                        <TableCell>₹{trade.farmer_broker_net}</TableCell>
                        <TableCell className={Number(trade.total_profit_loss) >= 0 ? 'text-green-500' : 'text-red-500'}>
                          ₹{Number(trade.total_profit_loss).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTrade(trade.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No trades recorded yet</p>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default RealTrade;
