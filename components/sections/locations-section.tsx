"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, TreePine, Leaf } from "lucide-react"
import Link from "next/link"

const locations = [
  {
    id: "nursery",
    icon: <Leaf className="h-12 w-12 text-emerald-600" />,
    title: "Forest of Central Asia",
    subtitle: "Питомник",
    location: "Шортандинский район",
    area: "83 га",
    features: ["Выращивание саженцев", "Посадка деревьев частными лицами и компаниями", "Участие доступно онлайн"],
    cta: "Посадить дерево в питомнике",
    color: "emerald",
  },
  {
    id: "karaganda",
    icon: <TreePine className="h-12 w-12 text-teal-600" />,
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
    color: "teal",
  },
]

export function LocationsSection() {
  return (
    <section id="locations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Две локации посадки</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Выберите место, где хотите внести свой вклад в восстановление лесов Казахстана
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {locations.map((location, index) => (
            <Card
              key={location.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="mb-4">{location.icon}</div>
                <CardTitle className="text-2xl mb-2">{location.title}</CardTitle>
                <p className="text-muted-foreground font-medium">{location.subtitle}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{location.location}</span>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="text-3xl font-bold text-emerald-600">{location.area}</div>
                  <div className="text-sm text-muted-foreground">площадь проекта</div>
                </div>

                <ul className="space-y-3">
                  {location.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-600" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`/donate?location=${location.id}`}>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">{location.cta}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
