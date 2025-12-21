"use client"

import { useState, useEffect } from "react"

const steps = [
  {
    number: "01",
    title: "Выбор локации",
    description: "Питомник или Карагандинская область",
    icon: "place",
  },
  {
    number: "02",
    title: "Выбор деревьев",
    description: "От одного дерева до корпоративных пакетов",
    icon: "forest",
  },
  {
    number: "03",
    title: "Оплата",
    description: "Безопасная оплата через Kaspi или карту",
    icon: "credit_card",
  },
  {
    number: "04",
    title: "Посадка и уход",
    description: "Профессиональная посадка и долгосрочный уход",
    icon: "local_florist",
  },
  {
    number: "05",
    title: "Отчет",
    description: "Фото, видео и сертификат о посадке",
    icon: "description",
  },
]

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('how-it-works')
      if (!section) return

      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const scrollPosition = window.scrollY + window.innerHeight / 2

      // Calculate which step should be active based on scroll position
      if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
        const stepHeight = sectionHeight / steps.length
        const relativePosition = scrollPosition - sectionTop
        const newActiveStep = Math.min(Math.floor(relativePosition / stepHeight), steps.length - 1)
        setActiveStep(newActiveStep)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Как это <span className="text-primary">работает</span></h2>
          <p className="text-lg text-muted-foreground">От выбора дерева до получения отчета</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical dashed line */}
            <div className="absolute left-12 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-green-600 hidden md:block"></div>
            
            <div className="space-y-16">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative flex gap-8 items-start transition-all duration-500 ${index <= activeStep ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-4'}`}
                >
                  {/* Large number */}
                  <div className={`flex-shrink-0 text-6xl font-light w-24 text-left transition-all duration-500 ${index <= activeStep ? 'text-primary' : 'text-muted'}`}>{step.number}</div>
                  
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center shadow-lg border transition-all duration-500 ${index <= activeStep ? 'bg-white border-green-600' : 'bg-muted border-border'}`}>
                    <span className={`material-symbols-outlined !text-3xl transition-all duration-500 ${index <= activeStep ? 'text-green-600' : 'text-muted-foreground'}`}>{step.icon}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h3 className={`text-2xl font-bold mb-3 transition-all duration-500 ${index <= activeStep ? 'text-foreground' : 'text-muted-foreground'}`}>{step.title}</h3>
                    <p className={`text-base max-w-md transition-all duration-500 ${index <= activeStep ? 'text-muted-foreground' : 'text-muted'}`}>{step.description}</p>
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
