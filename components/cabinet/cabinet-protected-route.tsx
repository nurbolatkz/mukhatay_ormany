// components/cabinet/cabinet-protected-route.tsx
// Component to protect cabinet routes that should only be accessible by non-admin users

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useAdmin } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

export function CabinetProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth();
  const isAdmin = useAdmin();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  
  console.log('CabinetProtectedRoute: Received props - isAuthenticated:', isAuthenticated, 'user:', user, 'loading:', loading);

  useEffect(() => {
    console.log("CabinetProtectedRoute: State update - isAuthenticated:", isAuthenticated, "loading:", loading, "user:", user, "isAdmin:", isAdmin);
    
    // If user is not authenticated and not loading, redirect to login page
    if (!isAuthenticated && !loading && !redirecting) {
      console.log("CabinetProtectedRoute: Redirecting to login");
      setRedirecting(true);
      router.push("/login?return=/cabinet");
      return;
    }
    
    // If user is authenticated and is an admin, redirect to admin page
    if (isAuthenticated && !loading && user && isAdmin) {
      console.log("CabinetProtectedRoute: User is admin, redirecting to admin panel");
      setRedirecting(true);
      router.push("/admin");
      return;
    }
  }, [isAuthenticated, loading, user, isAdmin, router, redirecting]);

  // If user is authenticated, is not an admin, and not loading, render children
  if (isAuthenticated && !loading && user && !isAdmin) {
    console.log("CabinetProtectedRoute: Rendering cabinet content");
    return <>{children}</>;
  }

  // Show loading state while checking authentication and role
  if (loading || (isAuthenticated && !user)) {
    console.log("CabinetProtectedRoute: Showing loading state");
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
  if (isAuthenticated && user && isAdmin) {
    console.log("CabinetProtectedRoute: Access denied - user is admin");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Доступ ограничен</h1>
          <p className="text-muted-foreground mb-6">
            Администраторы не могут получить доступ к личному кабинету. Пожалуйста, используйте панель администратора.
          </p>
          <Button onClick={() => router.push("/admin")} className="bg-emerald-600 hover:bg-emerald-700">
            Перейти в панель администратора
          </Button>
        </div>
      </div>
    );
  }

  // If not authenticated and not loading, render nothing (redirect will happen in useEffect)
  console.log("CabinetProtectedRoute: Rendering null (waiting for redirect)");
  return null;
}