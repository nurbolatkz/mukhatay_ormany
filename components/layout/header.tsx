"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-emerald-600">Mukhatay Ormany</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#locations"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Локации
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Как это работает
            </Link>
            <Link
              href="#corporate"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Для компаний
            </Link>
            <Link
              href="#transparency"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Отчёты
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Контакты
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground hidden lg:inline">
                  Привет, {user?.full_name || "Пользователь"}
                </span>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Выйти
                </Button>
                <Link href="/cabinet">
                  <Button variant="ghost">Личный кабинет</Button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost">Войти</Button>
              </Link>
            )}
            <Link href="/donate">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Посадить дерево</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link
                href="#locations"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Локации
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Как это работает
              </Link>
              <Link
                href="#corporate"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Для компаний
              </Link>
              <Link
                href="#transparency"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Отчёты
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Контакты
              </Link>
              
              <div className="flex flex-col gap-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" onClick={handleLogout} className="justify-start">
                      <LogOut className="h-4 w-4 mr-2" />
                      Выйти
                    </Button>
                    <Link href="/cabinet" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Личный кабинет
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Войти
                    </Button>
                  </Link>
                )}
                <Link href="/donate" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white justify-start">Посадить дерево</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
