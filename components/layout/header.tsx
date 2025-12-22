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
      // Check if we're past the hero section (approximately first 100vh)
      const heroSection = document.querySelector('section.relative.flex.flex-grow');
      const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
      setIsScrolled(window.scrollY > heroHeight - 100);
    }
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [])

  const handleLogout = async () => {
    await logout(true)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
      <div className={`absolute inset-0 transition-all duration-300 ${isScrolled ? 'bg-[#182014] backdrop-blur-2xl border-b-2 border-primary/30 shadow-[0_8px_24px_rgba(0,0,0,0.35)]' : 'bg-gradient-to-b from-[#182014]/85 via-[#182014]/55 to-[#182014]/0 backdrop-blur-2xl border-b-2 border-primary/30'}`}></div>
      <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
        <div className="h-full w-full bg-primary animate-grow-from-left"></div>
      </div>
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className={`flex items-center justify-center rounded-full bg-primary text-background-dark transition-all duration-300 ${isScrolled ? 'h-8 w-8' : 'h-10 w-10'} hover:scale-105`}
          >
            <span className={`material-symbols-outlined ${isScrolled ? '!text-[20px]' : '!text-[24px]'}`}>forest</span>
          </Link>
          <Link 
            href="/" 
            className={`text-foreground font-extrabold leading-tight tracking-tight hidden sm:block transition-all duration-300 hover:text-primary ${isScrolled ? 'text-base' : 'text-lg'}`}
          >
            Mukhatay Ormany
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link className="relative text-white/70 hover:text-primary text-sm font-medium transition-all duration-300 hover:opacity-100" href="#locations">
            Локации
            <span className="absolute bottom-[-6px] left-0 w-full h-0.5 bg-primary rounded-full scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
          <Link className="relative text-white/70 hover:text-primary text-sm font-medium transition-all duration-300 hover:opacity-100" href="#how-it-works">
            Как это работает
            <span className="absolute bottom-[-6px] left-0 w-full h-0.5 bg-primary rounded-full scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
          <Link className="relative text-white/70 hover:text-primary text-sm font-medium transition-all duration-300 hover:opacity-100" href="#corporate">
            Для компаний
            <span className="absolute bottom-[-6px] left-0 w-full h-0.5 bg-primary rounded-full scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
          <div className="h-4 w-px bg-white/20"></div>
          <Link className="relative text-white/70 hover:text-primary text-sm font-medium transition-all duration-300 hover:opacity-100" href="#contact">
            Контакты
            <span className="absolute bottom-[-6px] left-0 w-full h-0.5 bg-primary rounded-full scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-white text-sm font-medium drop-shadow-lg">Привет, {user?.full_name || "Пользователь"}</span>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="hidden sm:flex group h-10 items-center justify-center rounded-full bg-white/8 px-5 text-sm font-medium text-[#EDEDED] backdrop-blur-sm transition-all hover:bg-white/15 border border-white/18"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
              <Link href="/cabinet">
                <Button 
                  variant="ghost"
                  className="hidden sm:flex group h-10 items-center justify-center rounded-full bg-white/8 px-5 text-sm font-medium text-[#EDEDED] backdrop-blur-sm transition-all hover:bg-white/15 border border-white/18"
                >
                  Личный кабинет
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button 
                variant="ghost"
                className="group h-10 items-center justify-center rounded-full bg-white/8 px-5 text-sm font-medium text-[#EDEDED] backdrop-blur-sm transition-all hover:bg-white/15 border border-white/18"
              >
                <span className="material-symbols-outlined !text-base mr-2">person</span>
                Войти
              </Button>
            </Link>
          )}
          <Link href="/donate">
            <Button 
              className="hidden sm:flex group h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-background-dark transition-all duration-300 hover:bg-primary/90 hover:-translate-y-0.5 border border-primary/20 shadow-[0_8px_20px_rgba(255,217,0,0.35)]"
            >
              <span className="material-symbols-outlined !text-base mr-2">forest</span>
              Посадить дерево
            </Button>
          </Link>
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-[#182014] backdrop-blur-3xl border-b-2 border-primary/30 shadow-[0_8px_24px_rgba(0,0,0,0.35)] py-4">
          <nav className="flex flex-col gap-4 px-4">
            <Link
              href="#locations"
              className="text-white hover:text-primary text-sm font-medium transition-colors py-2 drop-shadow-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Локации
            </Link>
            <Link
              href="#how-it-works"
              className="text-white hover:text-primary text-sm font-medium transition-colors py-2 drop-shadow-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Как это работает
            </Link>
            <Link
              href="#corporate"
              className="text-white hover:text-primary text-sm font-medium transition-colors py-2 drop-shadow-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Для компаний
            </Link>
            <Link
              href="#contact"
              className="text-white hover:text-primary text-sm font-medium transition-colors py-2 drop-shadow-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Контакты
            </Link>
                    
            <div className="flex flex-col gap-2 pt-4 border-t border-white/30">
              {isAuthenticated ? (
                <>
                  <div className="text-white text-sm py-2 drop-shadow-lg">Привет, {user?.full_name || "Пользователь"}</div>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="justify-start text-white hover:text-primary text-sm font-medium py-2 drop-shadow-lg"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </Button>
                  <Link href="/cabinet" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-white hover:text-primary text-sm font-medium py-2 drop-shadow-lg"
                    >
                      Личный кабинет
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-white hover:text-primary text-sm font-medium py-2 drop-shadow-lg"
                  >
                    Войти
                  </Button>
                </Link>
              )}
              <Link href="/donate" onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  className="w-full justify-center bg-primary text-background-dark hover:bg-primary/90 text-sm font-bold py-2 drop-shadow-lg"
                >
                  Посадить дерево
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
