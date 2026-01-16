"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, User, Settings, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      // Check if we're past the hero section (approximately first 100vh)
      const heroSection = document.querySelector('section.relative.flex.flex-grow') as HTMLElement;
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
        <div className="flex items-center gap-2 sm:gap-3">
          <Link 
            href="/" 
            className={`flex items-center justify-center rounded-full bg-primary text-background-dark transition-all duration-300 ${isScrolled ? 'h-7 w-7' : 'h-9 w-9'} hover:scale-105 shadow-lg shadow-primary/20`}
          >
            <span className={`material-symbols-outlined ${isScrolled ? '!text-[18px]' : '!text-[22px]'}`}>forest</span>
          </Link>
          <Link 
            href="/" 
            className={`font-black leading-tight tracking-tighter hidden sm:block transition-all duration-300 ${isScrolled ? 'text-sm text-white' : 'text-base text-white'}`}
          >
            Mukhatay Ormany
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <Link className="relative text-white/90 hover:text-primary text-sm font-bold uppercase tracking-wider transition-all duration-300" href="#locations">
            Локации
          </Link>
          <Link className="relative text-white/90 hover:text-primary text-sm font-bold uppercase tracking-wider transition-all duration-300" href="#how-it-works">
            Как это работает
          </Link>
          <Link className="relative text-white/90 hover:text-primary text-sm font-bold uppercase tracking-wider transition-all duration-300" href="#corporate">
            Для компаний
          </Link>
          <Link className="relative text-white/90 hover:text-primary text-sm font-bold uppercase tracking-wider transition-all duration-300" href="#contact">
            Контакты
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 outline-none group">
                  <span className="hidden lg:inline text-white/90 text-sm font-bold transition-colors group-hover:text-primary">
                    Здравствуйте, {user?.full_name?.split(' ')[0] || "Пользователь"}
                  </span>
                  <Avatar className="h-8 w-8 border-2 border-primary/30 transition-all group-hover:border-primary">
                    <AvatarImage src={(user as any)?.avatar_url} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold uppercase">
                      {user?.full_name?.substring(0, 2) || "US"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#182014] border-primary/20 text-white">
                <DropdownMenuLabel className="font-bold text-primary/70 uppercase text-[10px] tracking-widest px-3 py-2">
                  Меню пользователя
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem asChild>
                  <Link href="/cabinet" className="cursor-pointer flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Личный кабинет</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cabinet/settings" className="cursor-pointer flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors">
                    <Settings className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Настройки</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-400/10 focus:bg-red-400/10 focus:text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium text-sm">Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button 
                variant="ghost"
                className="h-9 px-4 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/5 transition-all"
              >
                Войти
              </Button>
            </Link>
          )}
          
          <Link href="/donate">
            <Button 
              className="hidden sm:flex h-9 px-5 rounded-full bg-primary text-[11px] font-black uppercase tracking-tighter text-background-dark transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] shadow-lg shadow-primary/10 active:scale-95"
            >
              <span className="material-symbols-outlined !text-sm mr-1.5">forest</span>
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#182014]/95 backdrop-blur-3xl border-b border-primary/20 shadow-2xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-6 space-y-1">
            <DropdownMenuLabel className="px-0 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/50">
              Навигация
            </DropdownMenuLabel>
            <Link
              href="#locations"
              className="flex items-center justify-between text-white hover:text-primary text-base font-bold py-3 border-b border-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Локации
              <span className="material-symbols-outlined !text-sm">chevron_right</span>
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center justify-between text-white hover:text-primary text-base font-bold py-3 border-b border-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Как это работает
              <span className="material-symbols-outlined !text-sm">chevron_right</span>
            </Link>
            <Link
              href="#corporate"
              className="flex items-center justify-between text-white hover:text-primary text-base font-bold py-3 border-b border-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Для компаний
              <span className="material-symbols-outlined !text-sm">chevron_right</span>
            </Link>
            <Link
              href="#contact"
              className="flex items-center justify-between text-white hover:text-primary text-base font-bold py-3 border-b border-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Контакты
              <span className="material-symbols-outlined !text-sm">chevron_right</span>
            </Link>
                    
            <div className="pt-8 space-y-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                    <Avatar className="h-10 w-10 border border-primary/30">
                      <AvatarImage src={(user as any)?.avatar_url} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold uppercase">
                        {user?.full_name?.substring(0, 2) || "US"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-bold">{user?.full_name}</span>
                      <span className="text-white/40 text-[10px] uppercase tracking-tighter">Личный кабинет</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/cabinet" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-center border-white/10 text-white font-bold h-11 rounded-xl">
                        Кабинет
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="w-full justify-center text-red-400 font-bold h-11 rounded-xl hover:bg-red-400/10"
                    >
                      Выйти
                    </Button>
                  </div>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center border-primary/30 text-white font-bold h-12 rounded-2xl"
                  >
                    Войти в аккаунт
                  </Button>
                </Link>
              )}
              
              <Link href="/donate" onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  className="w-full h-14 bg-primary text-background-dark hover:bg-primary/90 text-lg font-black uppercase tracking-tighter shadow-xl shadow-primary/20 rounded-2xl"
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
