import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, Shield, FileText, History, BarChart3, CheckCircle, ArrowRight, Sparkles, Target, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const { user } = useAuth();

  const calculators = [
    {
      title: "Profit Calculator",
      description: "Calculate profits with grade-wise analysis, commission, and cost breakdowns",
      icon: Calculator,
      link: "/calculator",
      color: "from-blue-500 to-cyan-500",
      features: ["Grade-wise calculations", "Cost analysis", "Profit margins", "PDF exports"]
    },
    {
      title: "Real Trade Tracker",
      description: "Track actual trades with live statistics, profit/loss, and performance metrics",
      icon: TrendingUp,
      link: "/real-trade",
      color: "from-green-500 to-emerald-500",
      features: ["Live tracking", "Daily statistics", "Monthly reports", "Trade history"]
    },
    {
      title: "Average Calculator",
      description: "Calculate weighted averages for multiple price points and quantities instantly",
      icon: BarChart3,
      link: "/average-calculator",
      color: "from-purple-500 to-pink-500",
      features: ["Weighted averages", "Multiple entries", "Visual charts", "Quick calculations"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section - Mind Blowing */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-primary/10 py-16 md:py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <Badge className="mb-4 text-sm px-4 py-1" variant="secondary">
              <Sparkles className="w-3 h-3 mr-1" />
              Professional Trading Solution
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Anar Profit
              </span>
              <br />
              <span className="text-foreground">Calculator Suite</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Complete pomegranate trading platform with advanced analytics, 
              real-time tracking, and intelligent profit optimization
            </p>

            <div className="flex flex-wrap gap-6 justify-center items-center text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Real-time Calculations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Trade Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Export & Share</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>100% Free</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              {user ? (
                <>
                  <Button asChild size="lg" className="btn-hero gap-2 shadow-glow text-lg px-8 py-6">
                    <Link to="/calculator">
                      <Calculator className="w-5 h-5" />
                      Start Calculating Now
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2 text-lg px-8 py-6">
                    <Link to="/real-trade">
                      <TrendingUp className="w-5 h-5" />
                      Track Trades
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="btn-hero gap-2 shadow-glow text-lg px-8 py-6">
                    <Link to="/auth">
                      Get Started Free
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2 text-lg px-8 py-6">
                    <Link to="/about">
                      Learn More
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Cards - Prominent Display */}
      <section className="py-16 -mt-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {calculators.map((calc, index) => (
              <Card key={index} className="group hover:shadow-elegant hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 hover:border-primary/50">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${calc.color}`} />
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${calc.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <calc.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{calc.title}</CardTitle>
                  <CardDescription className="text-base">
                    {calc.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {calc.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Zap className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full btn-hero gap-2">
                    <Link to={calc.link}>
                      Open Calculator
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Tools */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">All Tools at Your Fingertips</h2>
            <p className="text-muted-foreground text-lg">
              Complete suite for professional pomegranate trading
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Link to="/history">
              <Card className="hover:shadow-elegant transition-all duration-300 hover:border-primary/50 cursor-pointer">
                <CardHeader className="text-center">
                  <History className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle className="text-lg">History & Analytics</CardTitle>
                  <CardDescription>
                    View all calculations and track your trading history
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/calculator">
              <Card className="hover:shadow-elegant transition-all duration-300 hover:border-primary/50 cursor-pointer">
                <CardHeader className="text-center">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle className="text-lg">Safe Buy Calculator</CardTitle>
                  <CardDescription>
                    Calculate safe buying prices for guaranteed profits
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/calculator">
              <Card className="hover:shadow-elegant transition-all duration-300 hover:border-primary/50 cursor-pointer">
                <CardHeader className="text-center">
                  <FileText className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle className="text-lg">Export & Reports</CardTitle>
                  <CardDescription>
                    Generate PDF, Excel reports and share via email
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/real-trade">
              <Card className="hover:shadow-elegant transition-all duration-300 hover:border-primary/50 cursor-pointer">
                <CardHeader className="text-center">
                  <Target className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle className="text-lg">Live Statistics</CardTitle>
                  <CardDescription>
                    Real-time profit/loss and performance tracking
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-primary">100%</div>
              <div className="text-muted-foreground">Free to Use</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-primary">3</div>
              <div className="text-muted-foreground">Calculator Types</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-primary">∞</div>
              <div className="text-muted-foreground">Calculations</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need for successful pomegranate trading
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Calculator, title: "Grade-wise Analysis", desc: "Separate calculations for each pomegranate grade" },
              { icon: TrendingUp, title: "Profit Tracking", desc: "Track profits and losses in real-time" },
              { icon: BarChart3, title: "Visual Charts", desc: "Beautiful charts and graphs for data visualization" },
              { icon: FileText, title: "PDF Export", desc: "Export detailed reports as professional PDFs" },
              { icon: History, title: "Complete History", desc: "Access all your past calculations anytime" },
              { icon: Shield, title: "Safe Buy Prices", desc: "Calculate minimum prices for guaranteed profits" },
              { icon: Users, title: "Contact Management", desc: "Save farmer and buyer contact information" },
              { icon: Target, title: "Cost Breakdown", desc: "Detailed analysis of all costs and commissions" },
              { icon: Zap, title: "Instant Results", desc: "Get calculations instantly as you type" }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300 group">
                <CardHeader>
                  <feature.icon className="w-10 h-10 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Maximize Your Profits?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join successful traders who make data-driven decisions with our professional calculator suite
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              {user ? (
                <>
                  <Button asChild size="lg" className="btn-hero gap-2 shadow-glow text-lg px-8 py-6">
                    <Link to="/calculator">
                      <Calculator className="w-5 h-5" />
                      Start Calculating
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8 py-6">
                    <Link to="/history">
                      <History className="w-5 h-5" />
                      View History
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="btn-hero gap-2 shadow-glow text-lg px-8 py-6">
                    <Link to="/auth">
                      Sign Up Free
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2 text-lg px-8 py-6">
                    <Link to="/contact">
                      Contact Us
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
