import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="card-elegant max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-destructive/10">
              <AlertTriangle className="w-12 h-12 text-destructive" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold font-mono">404</h1>
            <h2 className="text-xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <Button asChild className="btn-hero w-full">
            <a href="/" className="flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Return to Calculator
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
