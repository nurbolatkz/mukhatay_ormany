"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Home, TreePine, History, Award, Settings, Menu, X, LogOut } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import type { CabinetView } from "@/app/cabinet/page"

interface CabinetLayoutProps {
  children: React.ReactNode
  currentView: CabinetView
  onViewChange: (view: CabinetView) => void
}

const navItems = [
  { id: "overview" as CabinetView, label: "Обзор", icon: Home },
  { id: "trees" as CabinetView, label: "Мои деревья", icon: TreePine },
  { id: "history" as CabinetView, label: "История", icon: History },
  { id: "certificates" as CabinetView, label: "Сертификаты", icon: Award },
  { id: "settings" as CabinetView, label: "Настройки", icon: Settings },
]

export function CabinetLayout({ children, currentView, onViewChange }: CabinetLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async (e?: any) => {
    // Prevent automatic triggering
    if (!e || (e && e.constructor && e.constructor.name === 'SyntheticBaseEvent')) {
      // This might be an automatic trigger, let's check if it's a real user interaction
      console.log('CabinetLayout: handleLogout called with event:', e);
      if (e && e.type !== 'click') {
        console.log('CabinetLayout: Skipping automatic logout trigger');
        return;
      }
    }
    
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    console.log('CabinetLayout: Executing logout');
    await logout(true)
  }

  return (
    <div className="min-h-screen bg-[#f8f9f5] dark:bg-[#182014]">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-xl font-bold text-[#1a3d2e] dark:text-white">Mukhatay Ormany</div>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm text-[#6b7280] dark:text-white/80">
                Добро пожаловать, <span className="font-medium text-[#1a3d2e] dark:text-white">{user?.full_name || "Пользователь"}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogout(e);
                }}
                className="text-[#2d5a45] hover:text-primary dark:text-[#f4e31e] dark:hover:text-primary"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      currentView === item.id
                        ? "bg-[#f4e31e] text-[#1a3d2e] font-semibold"
                        : "text-[#6b7280] hover:bg-[#e8ebe7] hover:text-[#1a3d2e] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
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
                  <div className="text-xl font-bold text-[#1a3d2e] dark:text-white">Меню</div>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X />
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
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                          currentView === item.id
                            ? "bg-[#f4e31e] text-[#1a3d2e] font-semibold"
                            : "text-[#6b7280] hover:bg-[#e8ebe7] hover:text-[#1a3d2e] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
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
