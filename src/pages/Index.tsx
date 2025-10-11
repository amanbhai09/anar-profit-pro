import Home from "./Home";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to home page
    navigate("/home", { replace: true });
  }, [navigate]);

  return <Home />;
};

export default Index;
