// components/auth/login-form.tsx
// Login form component that integrates with the backend API

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import apiService from "@/services/api";

// Separate component that uses useSearchParams
function LoginFormContent({}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDonationMessage, setShowDonationMessage] = useState(false);

  useEffect(() => {
    // Pre-fill email if provided in URL params
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
    
    // Check if there's pending donation data
    const pendingDonation = localStorage.getItem('pendingDonation');
    if (pendingDonation) {
      setShowDonationMessage(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Login using the AuthContext
      console.log("LoginForm: Attempting login with email:", email);
      await login(email, password);
      console.log("LoginForm: Login successful");
      
      // Get user profile directly from API to check role
      const userProfile = await apiService.getUserProfile();
      const isAdmin = userProfile && userProfile.role === 'admin';
      console.log("LoginForm: User profile fetched, isAdmin:", isAdmin);
      
      // Check if there's a return URL
      const returnUrl = searchParams.get('return');
      const step = searchParams.get('step');
      const isGuestDonation = searchParams.get('guest_donation') === 'true';
      
      if (returnUrl && returnUrl === '/donate') {
        // Redirect back to donation page
        console.log("LoginForm: Redirecting back to donation page");
        // Add a small delay to ensure auth state is updated
        setTimeout(() => {
          router.push("/donate");
        }, 100);
      } else if (returnUrl && returnUrl === '/donate' && step === 'complete') {
        // Check if there's pending donation data
        const pendingDonation = localStorage.getItem('pendingDonation');
        if (pendingDonation) {
          // Redirect back to donation page to complete the process
          console.log("LoginForm: Redirecting to complete donation");
          // Add a small delay to ensure auth state is updated
          setTimeout(() => {
            router.push("/donate?step=complete");
          }, 100);
        } else {
          // No pending donation, redirect based on user role
          if (isAdmin) {
            console.log("LoginForm: Redirecting admin to /admin");
            router.push("/admin");
          } else {
            console.log("LoginForm: Redirecting to /cabinet");
            router.push("/cabinet");
          }
        }
      } else if (isGuestDonation) {
        // For guest donations, redirect to cabinet to show donation history
        console.log("LoginForm: Redirecting guest donation to /cabinet");
        setTimeout(() => {
          router.push("/cabinet?view=history");
        }, 300);
      } else {
        // Redirect based on user role
        console.log("LoginForm: Redirecting based on user role");
        // Add a longer delay to ensure auth state is fully updated
        setTimeout(() => {
          if (isAdmin) {
            router.push("/admin");
          } else {
            router.push("/cabinet");
          }
        }, 300);
      }
      
      console.log("LoginForm: Redirect initiated");
    } catch (err: any) {
      console.error("LoginForm: Login error:", err);
      // Extract a user-friendly error message
      let errorMessage = err.message || "Не удалось войти. Пожалуйста, проверьте свои учетные данные.";
      
      // Handle specific error cases
      if (err.message.includes('Failed to connect')) {
        errorMessage = 'Невозможно подключиться к серверу. Пожалуйста, убедитесь, что бэкенд запущен.';
      } else if (err.message.includes('Invalid credentials')) {
        // Check if user might not be registered
        try {
          const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const emailExists = existingUsers.some((user: any) => user.email === email);
          
          if (!emailExists) {
            errorMessage = 'Неверные учетные данные. Если вы еще не зарегистрированы, пожалуйста, создайте аккаунт.';
          } else {
            errorMessage = 'Неверный пароль. Пожалуйста, проверьте свои учетные данные.';
          }
        } catch (storageErr) {
          // If localStorage check fails, use generic message
          errorMessage = 'Неверные учетные данные. Пожалуйста, проверьте email и пароль.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#1a3d2e]">Вход</CardTitle>
        <CardDescription className="text-[#6b7280]">
          Введите ваш email и пароль для входа в аккаунт
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showDonationMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800 text-sm">
              <strong>Внимание:</strong> У вас есть незавершенное пожертвование. После входа вы будете перенаправлены для завершения процесса.
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#1a3d2e] font-semibold">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-[#e8ebe7] rounded-xl py-5 text-base focus:border-[#f4e31e] focus:ring-4 focus:ring-[rgba(244,227,30,0.2)]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#1a3d2e] font-semibold">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10 border-2 border-[#e8ebe7] rounded-xl py-5 text-base focus:border-[#f4e31e] focus:ring-4 focus:ring-[rgba(244,227,30,0.2)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#f4e31e] text-[#1a3d2e] rounded-full py-5 font-semibold text-lg shadow-[0_4px_16px_rgba(244,227,30,0.3)] hover:scale-102 hover:shadow-[0_6px_24px_rgba(244,227,30,0.4)] hover:bg-[#ffd700] transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Вход..." : "Войти"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function LoginForm() {
  return <LoginFormContent />;
}