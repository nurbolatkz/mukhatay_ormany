// app/register/page.tsx
// Registration page for the Tree Donation Platform

import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9f5] dark:bg-[#182014]">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a3d2e] dark:text-white mb-2">Платформа посадки деревьев</h1>
          <p className="text-[#6b7280] dark:text-white/80">Создать новый аккаунт</p>
          <p className="text-sm text-[#6b7280] dark:text-white/70 mt-2">Email должен быть уникальным</p>
        </div>
        <RegisterForm />
        <div className="mt-6 text-center text-sm text-[#6b7280] dark:text-white/70">
          Уже есть аккаунт?{" "}
          <a href="/login" className="text-[#2d5a45] hover:text-primary dark:text-[#f4e31e] dark:hover:text-primary">
            Войти
          </a>
        </div>
      </div>
    </div>
  );
}