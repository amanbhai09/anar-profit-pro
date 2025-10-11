import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, Shield, FileText, History, BarChart3, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90 py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Anar Profit Calculator
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Professional pomegranate trading calculator with advanced analytics
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate profits, track trades, analyze trends, and make data-driven decisions 
              in the pomegranate market with our comprehensive trading solution.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {user ? (
                <>
                  <Button asChild size="lg" className="btn-hero gap-2">
                    <Link to="/calculator">
                      <Calculator className="w-5 h-5" />
                      Start Calculating
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link to="/real-trade">
                      <TrendingUp className="w-5 h-5" />
                      Real Trade
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="btn-hero gap-2">
                    <Link to="/auth">
                      Get Started Free
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2">
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

      {/* Features Section */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to succeed in pomegranate trading
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <Calculator className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Profit Calculator</CardTitle>
                <CardDescription>
                  Accurate profit and loss calculations with grade-wise analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Real Trade Tracking</CardTitle>
                <CardDescription>
                  Track actual trades with detailed statistics and performance metrics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <BarChart3 className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Average Calculator</CardTitle>
                <CardDescription>
                  Calculate weighted averages for multiple price points and quantities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <History className="w-10 h-10 text-primary mb-2" />
                <CardTitle>History & Analytics</CardTitle>
                <CardDescription>
                  Access complete history with charts, trends, and insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <FileText className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Export & Share</CardTitle>
                <CardDescription>
                  Export to PDF, Excel, or share via email and messaging apps
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <Shield className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Safe Buy Calculator</CardTitle>
                <CardDescription>
                  Calculate safe buying prices to ensure minimum profit margins
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-muted-foreground text-lg">
                Built by traders, for traders
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Easy to Use</h3>
                  <p className="text-muted-foreground">
                    Intuitive interface designed for quick calculations without complexity
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Accurate Calculations</h3>
                  <p className="text-muted-foreground">
                    Precise calculations including all costs and commission factors
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Data Security</h3>
                  <p className="text-muted-foreground">
                    Your trading data is encrypted and securely stored
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Mobile Friendly</h3>
                  <p className="text-muted-foreground">
                    Access from anywhere on any device with responsive design
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Real-time Updates</h3>
                  <p className="text-muted-foreground">
                    Get instant calculations and updates as you enter data
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Professional Reports</h3>
                  <p className="text-muted-foreground">
                    Generate detailed PDF and Excel reports for your records
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Optimize Your Trading?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join traders who are making smarter decisions with our calculator
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {user ? (
                <Button asChild size="lg" className="btn-hero gap-2">
                  <Link to="/calculator">
                    <Calculator className="w-5 h-5" />
                    Go to Calculator
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="btn-hero gap-2">
                    <Link to="/auth">
                      Sign Up Free
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2">
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
