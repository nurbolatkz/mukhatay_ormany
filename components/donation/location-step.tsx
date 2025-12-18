"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, TreePine, MapPin } from "lucide-react"
import type { Location } from "@/app/donate/page"

interface LocationStepProps {
  selectedLocation: Location | null
  onLocationSelect: (location: Location) => void
}

const locations = [
  {
    id: "nursery" as Location,
    icon: <Leaf className="h-16 w-16 text-emerald-600" />,
    title: "Forest of Central Asia",
    subtitle: "Питомник",
    location: "Шортандинский район",
    area: "83 га",
    description: "Выращивание и посадка саженцев с возможностью участия онлайн",
    features: ["Доступно круглый год", "Быстрый старт", "Идеально для частных лиц"],
  },
  {
    id: "karaganda" as Location,
    icon: <TreePine className="h-16 w-16 text-teal-600" />,
    title: "Mukhatay Ormany",
    subtitle: "Карагандинская область",
    location: "Карагандинская область",
    area: "до 25,000 га",
    description: "Масштабный проект лесовосстановления деградированных территорий",
    features: ["Долгосрочный эффект", "Большие масштабы", "Корпоративные проекты"],
  },
]

export function LocationStep({ selectedLocation, onLocationSelect }: LocationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Выберите локацию посадки</h2>
        <p className="text-muted-foreground">Где вы хотите посадить деревья?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {locations.map((location) => (
          <Card
            key={location.id}
            className={`cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 border-2 ${
              selectedLocation === location.id ? "border-emerald-600 shadow-lg" : "border-border"
            }`}
            onClick={() => onLocationSelect(location.id)}
          >
            <CardHeader>
              <div className="mb-4 flex justify-center">{location.icon}</div>
              <CardTitle className="text-2xl text-center mb-2">{location.title}</CardTitle>
              <p className="text-center text-muted-foreground font-medium">{location.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground justify-center">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{location.location}</span>
              </div>

              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">{location.area}</div>
                <div className="text-sm text-muted-foreground">площадь проекта</div>
              </div>

              <p className="text-sm text-muted-foreground text-center">{location.description}</p>

              <ul className="space-y-2">
                {location.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-emerald-600" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
