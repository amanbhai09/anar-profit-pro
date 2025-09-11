import { Heart, Calculator, MessageCircle, TrendingUp, Shield, FileText, BookOpen } from "lucide-react";
import { Button } from "./button";

export const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          
          {/* Footer Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open('https://cienma4u.xo.je/profit2', '_blank')}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Avg Calculator
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open('https://t.me/aman25gt', '_blank')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Support
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open('https://www.youtube.com/shorts/4Dl03usMTB0', '_blank')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Guide
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open('#', '_blank')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open('#', '_blank')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Security
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open('#', '_blank')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </Button>
          </div>

          {/* Made by section */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by</span>
            <span className="font-semibold text-primary">Aman Bhai</span>
          </div>

          {/* Copyright */}
          <div className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Anar Profit Calculator. Professional pomegranate trading solution.
          </div>
        </div>
      </div>
    </footer>
  );
};
