import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Capacitor } from '@capacitor/core';

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

// Check if running in native Capacitor app
const isNativeApp = Capacitor.isNativePlatform();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoSession, setIsDemoSession] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsDemoSession(false);
      } else {
        // Backend responded but user not authenticated - normal flow
        setUser(null);
        setIsDemoSession(false);
      }
    } catch (error) {
      // Network error - backend truly unavailable
      // Only auto-login in native app (APK) when backend unreachable
      if (isNativeApp) {
        console.log("Backend unavailable in native app, using demo mode");
        setUser({
          id: "demo-user-1",
          phoneNumber: "+919876543210",
          name: "Demo User"
        });
        setIsDemoSession(true);
      } else {
        setUser(null);
        setIsDemoSession(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsDemoSession(false);
  };

  const logout = async () => {
    try {
      // Only skip backend logout if in demo session
      // Real sessions in native app should call backend logout
      if (!isDemoSession) {
        await apiRequest("POST", "/api/auth/logout");
      }
      setUser(null);
      setIsDemoSession(false);
      queryClient.clear();
    } catch (error) {
      // Even if logout fails, clear local state
      setUser(null);
      setIsDemoSession(false);
      queryClient.clear();
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
