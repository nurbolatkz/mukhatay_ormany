"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard,
  Heart,
  Users,
  MapPin,
  FileText,
  Award,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type { AdminView } from "@/app/admin/page"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
interface AdminLayoutProps {
  children: React.ReactNode
  currentView: AdminView
  onViewChange: (view: AdminView) => void
}

const navItems = [
  { id: "dashboard" as AdminView, label: "Главная", icon: LayoutDashboard },
  { id: "donations" as AdminView, label: "Пожертвования", icon: Heart },
  { id: "users" as AdminView, label: "Пользователи", icon: Users },
  { id: "locations" as AdminView, label: "Локации", icon: MapPin },
  { id: "content" as AdminView, label: "Контент", icon: FileText },
  { id: "news" as AdminView, label: "Новости", icon: FileText },
  { id: "certificates" as AdminView, label: "Сертификаты", icon: Award },
  { id: "reports" as AdminView, label: "Аналитика", icon: BarChart3 },
  { id: "settings" as AdminView, label: "Настройки", icon: Settings },
]

export function AdminLayout({ children, currentView, onViewChange }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { logout, user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-background dark:from-slate-950/20 dark:to-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="text-xl font-bold text-emerald-600">Mukhatay Ormany</div>
              </Link>
              <div className="hidden md:block text-sm text-muted-foreground">Админ-панель</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Администратор</span>
              </div>
              <button onClick={handleLogout}>
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Выйти
                </Button>
              </button>
              <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <nav className="sticky top-24 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      currentView === item.id
                        ? "bg-emerald-600 text-white"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-lg">
              <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-xl font-bold text-emerald-600">Меню</div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-md hover:bg-muted"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onViewChange(item.id)
                          setIsMobileMenuOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          currentView === item.id
                            ? "bg-emerald-600 text-white"
                            : "text-foreground/80 hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>
          )}
          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
