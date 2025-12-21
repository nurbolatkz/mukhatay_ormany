// contexts/auth-context.tsx
// Authentication context for managing user authentication state

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import apiService from "@/services/api";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  role: string;
  created_at: string;
  last_login: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: { full_name: string; email: string; password: string; phone: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('AuthProvider: Mounting');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log('AuthProvider: Initial state - isAuthenticated:', isAuthenticated, 'loading:', loading);

  useEffect(() => {
    // Check if user is already authenticated
    console.log("AuthContext: Checking authentication status");
    
    // Add a small delay to ensure token is available
    const initAuth = async () => {
      // Small delay to ensure localStorage is ready
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const token = apiService.getToken();
      console.log("AuthContext: Token found:", token);
      if (token) {
        console.log("AuthContext: Token exists, fetching user profile");
        fetchUserProfile();
      } else {
        console.log("AuthContext: No token found, setting loading to false");
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const fetchUserProfile = async () => {
    try {
      console.log("AuthContext: Fetching user profile");
      const userData = await apiService.getUserProfile();
      console.log("AuthContext: User profile received:", userData);
      setUser(userData);
      setIsAuthenticated(true);
      console.log("AuthContext: Authentication state set to true");
    } catch (error) {
      console.error("AuthContext: Error fetching user profile:", error);
      // Token might be invalid, clear it
      apiService.logout();
      setUser(null);
      setIsAuthenticated(false);
      console.log("AuthContext: Authentication state set to false");
    } finally {
      setLoading(false);
      console.log("AuthContext: Loading state set to false");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("AuthContext: Attempting login with email:", email);
      await apiService.login(email, password);
      console.log("AuthContext: Login successful, fetching user profile");
      const userData = await apiService.getUserProfile();
      console.log("AuthContext: User profile received:", userData);
      setUser(userData);
      setIsAuthenticated(true);
      console.log("AuthContext: Authentication state set to true");
      console.log("AuthContext: Login process completed");
      return userData;
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      // Token might be invalid, clear it
      apiService.logout();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    console.log('AuthContext: Logout called');
    await apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData: { full_name: string; email: string; password: string; phone: string }) => {
    try {
      await apiService.register(userData);
    } catch (error) {
      throw error;
    }
  };

  const isAdmin = user ? user.role === 'admin' : false;
  
  const value = {
    user,
    isAuthenticated,
    loading,
    isAdmin,
    login,
    logout,
    register
  };
  
  console.log('AuthProvider: Providing value - isAuthenticated:', isAuthenticated, 'user:', user, 'loading:', loading);

  // Don't render loading indicator here, let components handle it themselves
  // This prevents flickering when components want to show their own loading states

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAdmin() {
  const { isAdmin } = useAuth();
  return isAdmin;
}