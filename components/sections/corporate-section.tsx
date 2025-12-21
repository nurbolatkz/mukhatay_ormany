const benefits = [
  {
    icon: "business_center",
    title: "Корпоративные посадки",
    description: "Организуем посадку любого масштаба для вашей компании",
  },
  {
    icon: "badge",
    title: "Именные участки",
    description: "Ваш именной лес с табличкой и координатами",
  },
  {
    icon: "analytics",
    title: "ESG / CSR отчётность",
    description: "Полная документация для корпоративной отчётности",
  },
]

export function CorporateSection() {
  return (
    <section id="corporate" className="py-20 bg-[#1a3d2e] relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a3d2e] via-[#22553a] to-[#1a3d2e]"></div>
      
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(255,255,255,0.1) 0%, transparent 20%), radial-gradient(circle at 85% 30%, rgba(255,255,255,0.1) 0%, transparent 20%)' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Для компаний и <span className="text-primary">организаций</span></h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">ESG и CSR программы</p>
        </div>

        {/* Benefits Cards: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white p-12 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.18)] border border-white/10 max-w-sm mx-auto"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-[0_4px_16px_rgba(244,227,30,0.25)] transition-all duration-300 hover:rotate-6 hover:scale-110">
                <span className="material-symbols-outlined text-background !text-5xl">{benefit.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{benefit.title}</h3>
              <p className="text-base text-gray-500 leading-[1.65]">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Formats List: 2 columns */}
        <div className="mb-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Форматы сотрудничества</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-1 !text-xl">check_circle</span>
              <span className="text-white">Корпоративные посадки для сотрудников</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-1 !text-xl">check_circle</span>
              <span className="text-white">Именные леса и аллеи</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-1 !text-xl">check_circle</span>
              <span className="text-white">Спонсорство конкретных участков</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-1 !text-xl">check_circle</span>
              <span className="text-white">Долгосрочные ESG/CSR программы</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-1 !text-xl">check_circle</span>
              <span className="text-white">Образовательные и волонтерские программы</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-1 !text-xl">check_circle</span>
              <span className="text-white">Совместные экологические инициативы</span>
            </div>
          </div>
        </div>

        {/* CTA Section (Centered) */}
        <div className="text-center">
          <button className="bg-primary text-background font-bold text-lg px-10 py-5 rounded-full mb-6 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            Стать партнёром
          </button>
          <p className="text-white cursor-pointer hover:text-primary transition-colors duration-300">Скачать презентацию для партнеров</p>
        </div>
      </div>
    </section>
  )
}
