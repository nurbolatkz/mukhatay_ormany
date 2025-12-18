// components/auth/register-form.tsx
// Registration form component that integrates with the backend API

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiService from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
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

    // Client-side validation for email uniqueness
    try {
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const emailExists = existingUsers.some((user: any) => user.email === formData.email);
      
      if (emailExists) {
        throw new Error('Пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в существующий аккаунт.');
      }
    } catch (err) {
      // If there's an error parsing localStorage, we'll just skip client-side validation
      console.log('Could not perform client-side email validation');
    }

    try {
      // Register using the API service
      await apiService.register(formData);
      
      // Save user to localStorage for client-side email uniqueness check
      try {
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        existingUsers.push({
          email: formData.email,
          registeredAt: new Date().toISOString()
        });
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      } catch (err) {
        // If there's an error saving to localStorage, it's not critical
        console.log('Could not save user to localStorage for email validation');
      }
      
      // Show success message
      setSuccess(true);
      
      // Redirect to login page after a delay, preserving return URL if present
      setTimeout(() => {
        if (returnUrl && step) {
          router.push(`/login?return=${returnUrl}&step=${step}`);
        } else {
          router.push("/login");
        }
      }, 2000);
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
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Регистрация</CardTitle>
        <CardDescription>
          Создайте новый аккаунт, чтобы начать сажать деревья
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-green-500 text-sm bg-green-50 p-4 rounded text-center">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
            
            <div className="space-y-2">
              <Label htmlFor="full_name">Полное имя</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Введите ваше полное имя"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pr-10"
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
              <Label htmlFor="phone">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (701) 234-56-78"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
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