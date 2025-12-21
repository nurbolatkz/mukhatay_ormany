// components/auth/protected-route.tsx
// Component to protect routes that require authentication

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useAdmin } from "@/contexts/auth-context";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth();
  const isAdmin = useAdmin();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirecting, setRedirecting] = useState(false);
  
  console.log('ProtectedRoute: Received props - isAuthenticated:', isAuthenticated, 'user:', user, 'loading:', loading);

  useEffect(() => {
    console.log("ProtectedRoute: State update - isAuthenticated:", isAuthenticated, "loading:", loading);
    
    // If user is not authenticated and not loading, redirect to login page
    if (!isAuthenticated && !loading && !redirecting) {
      console.log("ProtectedRoute: Redirecting to login");
      setRedirecting(true);
      
      // Check if we're on the donate page
      const isDonatePage = window.location.pathname.includes('/donate');
      
      if (isDonatePage) {
        // For donate flow, redirect to login with return URL
        router.push(`/login?return=/donate`);
      } else {
        // For other protected routes, redirect to login
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, router, redirecting]);

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