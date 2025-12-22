// app/test-auth/page.tsx
// Test page to demonstrate authentication integration

"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TestAuthPage() {
  const { user, isAuthenticated, login, logout, register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/cabinet");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ full_name: fullName, email, password, phone });
      // After registration, switch to login form
      setIsRegistering(false);
      setError("Registration successful! Please login.");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  const handleLogout = async () => {
    await logout(true);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Authentication Test Page</h1>
        
        {isAuthenticated ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.full_name}!</h2>
            <div className="space-y-2 mb-6">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phone}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
            <a 
              href="/cabinet" 
              className="ml-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded inline-block"
            >
              Go to Cabinet
            </a>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {isRegistering ? (
              <>
                <h2 className="text-2xl font-semibold mb-4">Register</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="regEmail" className="block text-sm font-medium mb-1">Email</label>
                    <input
                      id="regEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="regPassword" className="block text-sm font-medium mb-1">Password</label>
                    <input
                      id="regPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Register
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setIsRegistering(false)}
                    className="text-emerald-600 hover:underline"
                  >
                    Already have an account? Login
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-4">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="loginEmail" className="block text-sm font-medium mb-1">Email</label>
                    <input
                      id="loginEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="loginPassword" className="block text-sm font-medium mb-1">Password</label>
                    <input
                      id="loginPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Login
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="text-emerald-600 hover:underline"
                  >
                    Don't have an account? Register
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}