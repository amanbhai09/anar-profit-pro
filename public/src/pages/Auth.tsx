import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { Calculator } from 'lucide-react';

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-elegant">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center mb-4">
            <Calculator className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-gradient-primary">
            Anar Profit Calculator
          </CardTitle>
          <CardDescription>
            {isLoginMode 
              ? 'Sign in to access your calculation history' 
              : 'Create an account to save and track your calculations'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoginMode ? (
            <LoginForm onToggleMode={() => setIsLoginMode(false)} />
          ) : (
            <SignupForm onToggleMode={() => setIsLoginMode(true)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;