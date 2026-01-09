"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative flex flex-grow flex-col justify-center">
      {/* Background with Parallax Feel */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background-dark/90 z-10"></div>
        <img 
          alt="Misty pine forest landscape in mountains" 
          className="h-full w-full object-cover object-center" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg99ryJEKE-HA-QcHou8c1TEQvAxxF0bp1cIP69Ca7td9LyqC5PHFAgCV6kYjfa4k8UdLBdef1ZMItLJwvOYT-ZKSkKNsFisxEtCuVpQ0_aW9q_7zrUP6vdehplgpu0vL6ppPXL5nuJHBq-vntdnPIsO0VefALqBXWytaFlnVSasWjAwp4dIIoIaN2IlC2mwjyc7ccwRo4_nQZfysedQNRq5dD97K_PYACcbuuYaJSYsA6fSdBDI-xdL9OIYhYiSExgqcNuo5Djhvy" 
        />
      </div>
      
      {/* Content Container */}
      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
          <span className="material-symbols-outlined !text-[16px]">eco</span>
          <span>Экологическая инициатива Казахстана</span>
        </div>
        
        {/* Main Title */}
        <h1 className="mb-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Mukhatay Ormany — лесовосстановление и <span className="text-primary font-extrabold">посадка деревьев</span> в Казахстане
        </h1>
        
        {/* Subtitle */}
        <p className="mb-10 max-w-2xl text-base font-normal leading-relaxed text-white/80 sm:text-lg md:text-xl">
          Мы реализуем реальные экологические проекты на собственных территориях — от выращивания саженцев до высадки и долгосрочного ухода за лесами.
        </p>
        
        {/* Buttons */}
        <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link href="/donate">
            <Button 
              className="group relative flex h-14 min-w-[200px] w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 text-base font-bold text-background-dark transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(244,227,30,0.5)]"
            >
              <span className="material-symbols-outlined">yard</span>
              <span>Посадить дерево</span>
            </Button>
          </Link>
          <Link href="#locations">
            <Button 
              className="flex h-14 min-w-[200px] w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/50"
            >
              <span className="material-symbols-outlined">map</span>
              <span>Выбрать локацию</span>
            </Button>
          </Link>
        </div>
        
        {/* Stats Overlay (Desktop Floating / Mobile Stacked) */}
        <div className="mt-20 w-full max-w-5xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Stat 1 */}
            <div className="group flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md transition-colors hover:bg-black/30 hover:border-white/20">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined">forest</span>
              </div>
              <p className="text-3xl font-bold tracking-tight text-white">10,000+</p>
              <p className="text-sm font-medium text-white/60">Деревьев посажено</p>
            </div>
            {/* Stat 2 */}
            <div className="group flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md transition-colors hover:bg-black/30 hover:border-white/20">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined">landscape</span>
              </div>
              <p className="text-3xl font-bold tracking-tight text-white">50+</p>
              <p className="text-sm font-medium text-white/60">Гектаров восстановлено</p>
            </div>
            {/* Stat 3 */}
            <div className="group flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md transition-colors hover:bg-black/30 hover:border-white/20">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined">diversity_3</span>
              </div>
              <p className="text-3xl font-bold tracking-tight text-white">1,200</p>
              <p className="text-sm font-medium text-white/60">Волонтеров</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements (Simulated Particles via absolute divs) */}
      <div className="absolute bottom-10 left-10 hidden lg:block opacity-30">
        <span className="material-symbols-outlined text-6xl text-primary transform rotate-12">leaf_spark</span>
      </div>
      <div className="absolute top-32 right-20 hidden lg:block opacity-20">
        <span className="material-symbols-outlined text-4xl text-white transform -rotate-12">park</span>
      </div>
    </section>
  )
}
