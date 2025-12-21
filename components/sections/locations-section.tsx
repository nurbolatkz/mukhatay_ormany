"use client"

import { MapPin, TreePine, Leaf } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const locations = [
  {
    id: "nursery",
    icon: "spa",
    title: "Forest of Central Asia",
    subtitle: "Питомник",
    location: "Шортандинский район",
    area: "83 га",
    features: ["Выращивание саженцев", "Посадка деревьев частными лицами и компаниями", "Участие доступно онлайн"],
    cta: "Посадить дерево в питомнике",
  },
  {
    id: "karaganda",
    icon: "park",
    title: "Mukhatay Ormany",
    subtitle: "Карагандинская область",
    location: "Карагандинская область",
    area: "до 25,000 га",
    features: [
      "Проект лесовосстановления",
      "Восстановление деградированных лесных территорий",
      "Долгосрочный экологический эффект",
    ],
    cta: "Посадить дерево в Карагандинской области",
  },
]

export function LocationsSection() {
  return (
    <section id="locations" className="py-20 bg-gradient-to-b from-background-light/80 to-[#F5F6F2] dark:from-background dark:to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Две <span className="text-primary">локации</span> посадки</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Выберите место, где хотите внести свой вклад в восстановление лесов Казахстана
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-12">
          {locations.map((location, index) => (
            <div 
              key={location.id}
              className="group relative"
            >
              <div className="overflow-hidden rounded-3xl shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-350 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.18)] group">
                {/* Hero-style image section */}
                <div className="relative h-48 overflow-hidden rounded-t-3xl">
                  {/* Image with zoom effect */}
                  <div className="h-full w-full transition-transform duration-600 group-hover:scale-110">
                    {location.id === 'nursery' ? (
                      <img 
                        src="/forest-central-asia.jpg" 
                        alt="Forest of Central Asia location"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img 
                        src="/mukhatay-ormany.jpg" 
                        alt="Mukhatay Ormany location"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#182014]/15 via-[#182014]/55 to-[#182014]/85"></div>
                  
                  {/* Location badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-[#182014]/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    <span className="material-symbols-outlined !text-[14px]">place</span>
                    <span>{location.location}</span>
                  </div>
                </div>
                
                {/* Card content */}
                <div className="bg-white p-6 rounded-b-3xl">
                  <h3 className="text-xl font-semibold text-[#111] mb-2">{location.title}</h3>
                  <p className="text-sm text-[#3A3A3A] mb-4">{location.subtitle}</p>
                  
                  <ul className="space-y-3 mb-5">
                    {location.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#3A3A3A]">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-600 flex-shrink-0 mt-0.5">
                          <span className="material-symbols-outlined !text-xs">check</span>
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Metric pill */}
                  <div className="inline-flex items-center gap-2 bg-yellow-500/15 text-yellow-600 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                    <span className="material-symbols-outlined !text-base">straighten</span>
                    <span>{location.area}</span>
                  </div>
                  
                  <Link href={`/donate?location=${location.id}`}>
                    <Button 
                      className="w-full rounded-full bg-primary py-3 text-center text-sm font-semibold text-background-dark transition-all hover:bg-[#FFEB3B]"
                    >
                      {location.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
