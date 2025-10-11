import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/ui/BackButton";
import { UniversalShare } from "@/components/shared/UniversalShare";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
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
            <CardTitle className="text-3xl">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Get in Touch</h2>
              <p className="text-muted-foreground mb-6">
                Have questions, suggestions, or need assistance? We're here to help! 
                Reach out to us through any of the following channels.
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Telegram</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Quick support via Telegram
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('https://t.me/aman25gt', '_blank')}
                      >
                        Chat on Telegram
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Send us an email
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = 'mailto:support@anarcalculator.com'}
                      >
                        Email Us
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <section className="pt-4">
              <h2 className="text-2xl font-semibold mb-3">Business Hours</h2>
              <p className="text-muted-foreground">
                Monday - Saturday: 9:00 AM - 6:00 PM IST<br />
                Sunday: Closed
              </p>
            </section>

            <section className="pt-4">
              <h2 className="text-2xl font-semibold mb-3">Support</h2>
              <p className="text-muted-foreground">
                For technical support or feature requests, please reach out via Telegram or email. 
                We typically respond within 24 hours during business days.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
