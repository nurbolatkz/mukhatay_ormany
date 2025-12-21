"use client"

export function StatsSection() {
  const stats = [
    { 
      icon: "forest", 
      value: "10,000+", 
      label: "Деревьев посажено" 
    },
    { 
      icon: "landscape", 
      value: "50+", 
      label: "Гектаров восстановлено" 
    },
    { 
      icon: "diversity_3", 
      value: "1,200", 
      label: "Волонтеров" 
    },
    { 
      icon: "handshake", 
      value: "50+", 
      label: "Партнеров" 
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-[#182014]/85 via-[#1E2A1A]/90 to-[#0F140C]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <span className="material-symbols-outlined text-primary/70 !text-xl">forest</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white leading-tight tracking-wide">Масштаб <span className="text-primary">проекта</span></h2>
          <p className="text-lg text-white/80 tracking-wide leading-relaxed">Реальные цифры нашей работы</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-black/30 hover:border-white/20 hover:shadow-[0_0_20px_rgba(249,245,6,0.1)]"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary transition-all duration-300 group-hover:bg-primary/30 group-hover:text-primary group-hover:shadow-[0_0_15px_rgba(249,245,6,0.3)]">
                <span className="material-symbols-outlined !text-2xl">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold tracking-tight text-white transition-all duration-300 group-hover:text-primary">{stat.value}</p>
              <p className="text-sm font-medium text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
