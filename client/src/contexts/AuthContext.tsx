import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface User {
  id: string;
  phoneNumber: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        // Demo mode: auto-login with demo user
        setUser({
          id: "demo-user-1",
          phoneNumber: "+919876543210",
          name: "Demo User"
        });
      }
    } catch (error) {
      // Demo mode: auto-login with demo user on network error
      setUser({
        id: "demo-user-1",
        phoneNumber: "+919876543210",
        name: "Demo User"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      setUser(null);
      queryClient.clear();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
