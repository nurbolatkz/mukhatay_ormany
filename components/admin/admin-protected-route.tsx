// components/admin/admin-protected-route.tsx
// Component to protect admin routes that require admin role

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useAdmin } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth();
  const isAdmin = useAdmin();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  
  console.log('AdminProtectedRoute: Received props - isAuthenticated:', isAuthenticated, 'user:', user, 'loading:', loading);

  useEffect(() => {
    console.log("AdminProtectedRoute: State update - isAuthenticated:", isAuthenticated, "loading:", loading, "user:", user);
    
    // If user is not authenticated and not loading, redirect to login page
    if (!isAuthenticated && !loading && !redirecting) {
      console.log("AdminProtectedRoute: Redirecting to login");
      setRedirecting(true);
      router.push("/login?return=/admin");
      return;
    }
    
    // If user is authenticated but not an admin, redirect to appropriate page
    if (isAuthenticated && !loading && user && !isAdmin) {
      console.log("AdminProtectedRoute: User is not admin, redirecting to cabinet");
      setRedirecting(true);
      router.push("/cabinet");
      return;
    }
  }, [isAuthenticated, loading, user, router, redirecting]);

  // If user is authenticated, is an admin, and not loading, render children
  if (isAuthenticated && !loading && user && isAdmin) {
    console.log("AdminProtectedRoute: Rendering admin content");
    return <>{children}</>;
  }

  // Show loading state while checking authentication and role
  if (loading || (isAuthenticated && !user)) {
    console.log("AdminProtectedRoute: Showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Проверка прав доступа...</p>
        </div>
      </div>
    );
  }

  // If not authorized, show access denied message
  if (isAuthenticated && user && !isAdmin) {
    console.log("AdminProtectedRoute: Access denied - not an admin");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Доступ запрещен</h1>
          <p className="text-muted-foreground mb-6">
            У вас нет прав администратора для доступа к этой странице.
          </p>
          <Button onClick={() => router.push("/cabinet")} className="bg-emerald-600 hover:bg-emerald-700">
            Перейти в личный кабинет
          </Button>
        </div>
      </div>
    );
  }

  // If not authenticated and not loading, render nothing (redirect will happen in useEffect)
  console.log("AdminProtectedRoute: Rendering null (waiting for redirect)");
  return null;
}