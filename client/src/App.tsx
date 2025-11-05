import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import Login from "@/pages/auth/Login";
import OTPVerification from "@/pages/auth/OTPVerification";
import Home from "@/pages/Home";
import Transactions from "@/pages/Transactions";
import Investments from "@/pages/Investments";
import Goals from "@/pages/Goals";
import GoalDetail from "@/pages/GoalDetail";
import Communities from "@/pages/Communities";
import Insights from "@/pages/Insights";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";

function AuthenticatedRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Switch>
        {/* Public Routes */}
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/verify-otp" component={OTPVerification} />
        
        {/* Protected Routes */}
        <PrivateRoute path="/" component={Home} />
        <PrivateRoute path="/transactions" component={Transactions} />
        <PrivateRoute path="/investments" component={Investments} />
        <PrivateRoute path="/goals" component={Goals} />
        <PrivateRoute path="/goals/:id" component={GoalDetail} />
        <PrivateRoute path="/communities" component={Communities} />
        <PrivateRoute path="/insights" component={Insights} />
        <PrivateRoute path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      
      {/* Only show bottom nav when authenticated */}
      {isAuthenticated && <BottomNav />}
    </>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AuthenticatedRouter />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
