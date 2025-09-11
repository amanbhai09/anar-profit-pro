import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by</span>
            <span className="font-semibold text-primary">Aman Bhai</span>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Anar Profit Calculator. Professional pomegranate trading solution.
          </div>
        </div>
      </div>
    </footer>
  );
};