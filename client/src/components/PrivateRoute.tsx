import { Route, Redirect } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { ComponentType } from "react";

interface PrivateRouteProps {
  path: string;
  component: ComponentType<any>;
}

export default function PrivateRoute({ path, component: Component }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Route path={path}>
      {(params) => {
        if (isLoading) {
          return (
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          );
        }

        if (!isAuthenticated) {
          return <Redirect to="/auth/login" />;
        }

        return <Component {...params} />;
      }}
    </Route>
  );
}
