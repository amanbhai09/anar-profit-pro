import { AnarCalculator } from "@/components/calculator/AnarCalculator";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { UniversalShare } from "@/components/shared/UniversalShare";
import { useState } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90">
          <div className="max-w-md w-full mx-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gradient-primary mb-4">
                Anar Profit Calculator
              </h1>
              <p className="text-muted-foreground">
                Professional pomegranate trading calculator with advanced analytics
              </p>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full btn-hero py-3 px-6 rounded-lg font-semibold"
            >
              Sign In to Get Started
            </button>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    );
  }

  return <AnarCalculator />;
};

export default Index;
