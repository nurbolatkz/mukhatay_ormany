// app/test-donation/page.tsx
// Test page to demonstrate the complete donation flow

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestDonationPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [pendingDonation, setPendingDonation] = useState<any>(null);

  useEffect(() => {
    // Check for pending donation data
    const pendingData = localStorage.getItem('pendingDonation');
    if (pendingData) {
      try {
        const data = JSON.parse(pendingData);
        setPendingDonation(data);
      } catch (error) {
        console.error('Error parsing pending donation data:', error);
      }
    }
  }, []);

  const handleStartDonation = () => {
    router.push('/donate');
  };

  const handleClearPending = () => {
    localStorage.removeItem('pendingDonation');
    setPendingDonation(null);
  };

  const handleLogin = () => {
    if (pendingDonation) {
      router.push('/login?return=/donate&step=complete');
    } else {
      router.push('/login');
    }
  };

  const handleRegister = () => {
    if (pendingDonation) {
      router.push('/register?return=/donate&step=complete');
    } else {
      router.push('/register');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Тестирование процесса пожертвования</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* User Status Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Статус пользователя</CardTitle>
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-800">Вы вошли в систему</p>
                    <p className="text-sm text-green-700">Привет, {user?.full_name}!</p>
                  </div>
                  <Button 
                    onClick={() => router.push('/cabinet')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Перейти в кабинет
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="font-medium text-yellow-800">Вы не вошли в систему</p>
                    <p className="text-sm text-yellow-700">Вам нужно войти для завершения пожертвования</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleLogin}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      Вход
                    </Button>
                    <Button 
                      onClick={handleRegister}
                      variant="outline"
                      className="flex-1"
                    >
                      Регистрация
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Donation Status Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Статус пожертвования</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingDonation ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">Незавершенное пожертвование</p>
                    <p className="text-sm text-blue-700 mt-2">
                      Деревьев: {pendingDonation.donationData?.treeCount || 0}<br/>
                      Сумма: {pendingDonation.donationData?.amount?.toLocaleString() || 0} ₸
                    </p>
                  </div>
                  <Button 
                    onClick={handleStartDonation}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Завершить пожертвование
                  </Button>
                  <Button 
                    onClick={handleClearPending}
                    variant="outline"
                    className="w-full"
                  >
                    Очистить данные
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800">Нет незавершенных пожертвований</p>
                    <p className="text-sm text-gray-600">Начните новый процесс пожертвования</p>
                  </div>
                  <Button 
                    onClick={handleStartDonation}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Начать пожертвование
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="border-2 mt-6">
          <CardHeader>
            <CardTitle>Инструкции по тестированию</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Начните процесс пожертвования, нажав кнопку "Начать пожертвование"</li>
              <li>Заполните форму донора и дойдите до шага оплаты</li>
              <li>На шаге оплаты вы будете перенаправлены на страницу входа, если не авторизованы</li>
              <li>После входа в систему вы автоматически вернетесь к завершению пожертвования</li>
              <li>После завершения пожертвования данные будут сохранены в вашем кабинете</li>
              <li>Проверьте историю пожертвований и раздел "Мои деревья" в кабинете</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}