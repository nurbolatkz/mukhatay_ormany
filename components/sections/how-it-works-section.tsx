"use client"

import { MapPin, TreeDeciduous, CreditCard, Sprout, FileText } from "lucide-react"

const steps = [
  {
    icon: <MapPin className="h-8 w-8" />,
    title: "Вы выбираете локацию посадки",
    description: "Питомник или Карагандинская область",
  },
  {
    icon: <TreeDeciduous className="h-8 w-8" />,
    title: "Вы выбираете количество деревьев",
    description: "От одного дерева до корпоративных пакетов",
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Оплачиваете онлайн",
    description: "Безопасная оплата через Kaspi или карту",
  },
  {
    icon: <Sprout className="h-8 w-8" />,
    title: "Мы высаживаем деревья и обеспечиваем уход",
    description: "Профессиональная посадка и долгосрочный уход",
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Вы получаете отчет о проделанной работе",
    description: "Фото, видео и сертификат о посадке",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Как это работает</h2>
          <p className="text-lg text-muted-foreground text-pretty">Простой процесс от выбора до результата</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

            <div className="space-y-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative flex gap-6 items-start animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center z-10">
                    {step.icon}
                  </div>

                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
