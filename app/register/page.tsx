// app/register/page.tsx
// Registration page for the Tree Donation Platform

import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-background dark:from-emerald-950/20 dark:to-background">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">Платформа посадки деревьев</h1>
          <p className="text-muted-foreground">Создать новый аккаунт</p>
          <p className="text-sm text-muted-foreground mt-2">Email должен быть уникальным</p>
        </div>
        <RegisterForm />
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
          <a href="/login" className="text-emerald-600 hover:underline dark:text-emerald-400">
            Войти
          </a>
        </div>
      </div>
    </div>
  );
}