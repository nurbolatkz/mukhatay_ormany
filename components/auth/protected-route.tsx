// components/auth/protected-route.tsx
// Component to protect routes that require authentication

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [loginProcessed, setLoginProcessed] = useState(false);
  
  console.log('ProtectedRoute: Received props - isAuthenticated:', isAuthenticated, 'user:', user, 'loading:', loading);

  useEffect(() => {
    console.log("ProtectedRoute: State update - isAuthenticated:", isAuthenticated, "loading:", loading, "justLoggedIn:", justLoggedIn, "loginProcessed:", loginProcessed);
    
    // Check if we're coming from a login redirect
    const returnUrl = searchParams.get('return');
    const step = searchParams.get('step');
    
    if (returnUrl && step) {
      console.log("ProtectedRoute: Detected donation return URL");
      setJustLoggedIn(true);
      // Give a small delay to ensure auth state is updated
      const timer = setTimeout(() => {
        setJustLoggedIn(false);
        setLoginProcessed(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isAuthenticated && !loginProcessed) {
      console.log("ProtectedRoute: Handling general login case");
      // Handle general login case
      setLoginProcessed(true);
      setJustLoggedIn(true);
      const timer = setTimeout(() => {
        setJustLoggedIn(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, isAuthenticated, loginProcessed, loading]);

  useEffect(() => {
    console.log("ProtectedRoute: Redirect check - isAuthenticated:", isAuthenticated, "loading:", loading, "justLoggedIn:", justLoggedIn);
    
    // If user is not authenticated and not loading, redirect to login page
    // But don't redirect if we just logged in (give some time for state to update)
    if (!isAuthenticated && !loading && !justLoggedIn) {
      console.log("ProtectedRoute: Redirecting to login");
      router.push("/login");
    }
  }, [isAuthenticated, loading, router, justLoggedIn]);

  // If user is authenticated and not loading, render children
  if (isAuthenticated && !loading) {
    console.log("ProtectedRoute: Rendering protected content");
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (loading) {
    console.log("ProtectedRoute: Showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not loading, render nothing (redirect will happen in useEffect)
  console.log("ProtectedRoute: Rendering null (waiting for redirect)");
  return null;
}