export function MissionSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Image Side */}
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden">
              {/* High-quality photo of team planting */}
              <img 
                src="/Восстановление лесов Казахстана-mission.jpg" 
                alt="Восстановление лесов Казахстана"
                className="w-full h-full object-cover aspect-video"
              />
              
              {/* Optional stat badges */}
              <div className="absolute top-4 right-4 bg-primary text-background px-3 py-1 rounded-full text-sm font-medium">
                10 лет опыта
              </div>
            </div>
          </div>
          
          {/* Text Side */}
          <div className="w-full lg:w-1/2">
            <div className="max-w-md">
              {/* Overline */}
              <div className="text-xs uppercase text-primary tracking-[2px] font-bold mb-4">НАША МИССИЯ</div>
              
              {/* Title */}
              <h2 className="text-4xl font-extrabold text-foreground mb-6">Восстановление лесов Казахстана</h2>
              
              {/* Body text */}
              <p className="text-lg text-muted-foreground leading-[1.8] mb-8 max-w-md">
                Мы создаем устойчивые лесные экосистемы, которые будут служить природе и людям десятилетиями. Каждый проект проходит тщательное планирование, профессиональную реализацию и долгосрочное сопровождение.
              </p>
              
              {/* Bullet points with green checkmarks */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5 !text-xl">check_circle</span>
                  <span className="text-foreground">Экологически устойчивые методы посадки</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5 !text-xl">check_circle</span>
                  <span className="text-foreground">Долгосрочный уход за каждым деревом</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5 !text-xl">check_circle</span>
                  <span className="text-foreground">Прозрачная отчетность и фотофиксация</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5 !text-xl">check_circle</span>
                  <span className="text-foreground">Поддержка местных сообществ</span>
                </div>
              </div>
              

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
