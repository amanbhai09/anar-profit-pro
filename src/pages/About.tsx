import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/ui/BackButton";
import { UniversalShare } from "@/components/shared/UniversalShare";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <BackButton />
          <UniversalShare />
        </div>
        
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">About Anar Profit Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
              <p className="text-muted-foreground">
                Anar Profit Calculator is a professional pomegranate trading solution designed to help traders, 
                farmers, and brokers make informed decisions in the pomegranate market. Our goal is to provide 
                accurate, real-time calculations and insights to maximize profitability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">What We Offer</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Real-time profit and loss calculations</li>
                <li>Grade-wise analysis and pricing</li>
                <li>Historical trade tracking</li>
                <li>Average price calculations</li>
                <li>Comprehensive reporting and export features</li>
                <li>Secure data management</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Why Choose Us</h2>
              <p className="text-muted-foreground">
                With years of experience in the pomegranate trading industry, we understand the complexities 
                and challenges traders face. Our calculator is built with precision, reliability, and ease of 
                use in mind, ensuring you can focus on what matters most - your business.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Our Commitment</h2>
              <p className="text-muted-foreground">
                We are committed to continuously improving our platform based on user feedback and industry 
                trends. Your success is our success, and we strive to provide the best tools and support 
                for pomegranate traders worldwide.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default About;
