// components/auth/register-form.tsx
// Registration form component that integrates with the backend API

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    full_name: "",
    email: searchParams.get('email') || "",
    password: "",
    phone: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Get return URL parameter
  const returnUrl = searchParams.get('return');
  const step = searchParams.get('step');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Get guest_user_id from localStorage if it exists
      const guestUserId = localStorage.getItem('guestUserId');
      
      // Register using the auth context
      await register({
        ...formData,
        guest_user_id: guestUserId || undefined
      } as any);
      
      // Clear guestUserId
      localStorage.removeItem('guestUserId');
      
      // Show success message
      setSuccess(true);
      
      // Redirect to cabinet donations history
      setTimeout(() => {
        router.push("/cabinet?view=history");
      }, 1500);
    } catch (err: any) {
      // Extract a user-friendly error message
      let errorMessage = err.message || "Не удалось зарегистрироваться. Пожалуйста, попробуйте снова.";
      
      // Handle specific error cases
      if (err.message.includes('Failed to connect')) {
        errorMessage = 'Невозможно подключиться к серверу. Пожалуйста, убедитесь, что бэкенд запущен.';
      } else if (err.message.includes('User with this email already exists') || err.message.includes('Пользователь с таким email уже существует')) {
        errorMessage = 'Пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в существующий аккаунт.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#1a3d2e]">Регистрация</CardTitle>
        <CardDescription className="text-[#6b7280]">
          Создайте новый аккаунт, чтобы начать сажать деревья
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-green-500 text-sm bg-green-50 p-4 rounded-lg text-center">
            Аккаунт успешно создан! Перенаправление на страницу входа...
          </div>
        ) : (
          <>
            {returnUrl && step && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm">
                  <strong>Внимание:</strong> После регистрации вам нужно будет войти в систему для завершения процесса пожертвования.
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
              <Label htmlFor="full_name" className="text-[#1a3d2e] font-semibold">Полное имя</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Введите ваше полное имя"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="border-2 border-[#e8ebe7] rounded-xl py-5 text-base focus:border-[#f4e31e] focus:ring-4 focus:ring-[rgba(244,227,30,0.2)]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1a3d2e] font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
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
                  placeholder="Создайте пароль"
                  value={formData.password}
                  onChange={handleChange}
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
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#1a3d2e] font-semibold">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (701) 234-56-78"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border-2 border-[#e8ebe7] rounded-xl py-5 text-base focus:border-[#f4e31e] focus:ring-4 focus:ring-[rgba(244,227,30,0.2)]"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#f4e31e] text-[#1a3d2e] rounded-full py-5 font-semibold text-lg shadow-[0_4px_16px_rgba(244,227,30,0.3)] hover:scale-102 hover:shadow-[0_6px_24px_rgba(244,227,30,0.4)] hover:bg-[#ffd700] transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Создание аккаунта..." : "Создать аккаунт"}
            </Button>
          </form>
          </>
        )}
      </CardContent>
    </Card>
  );
}