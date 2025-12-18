"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Plus } from "lucide-react"
import type { Location } from "@/app/donate/page"

interface PackageStepProps {
  location: Location
  selectedPackage: string
  onPackageSelect: (packageType: string, treeCount: number, amount: number) => void
  onBack: () => void
}

const packages = [
  {
    id: "single",
    name: "1 дерево",
    trees: 1,
    price: 2500,
    description: "Идеально для начала",
    popular: false,
  },
  {
    id: "small",
    name: "10 деревьев",
    trees: 10,
    price: 22500,
    description: "Небольшой пакет",
    popular: true,
  },
  {
    id: "medium",
    name: "50 деревьев",
    trees: 50,
    price: 100000,
    description: "Средний пакет",
    popular: false,
  },
  {
    id: "large",
    name: "100 деревьев",
    trees: 100,
    price: 190000,
    description: "Крупный пакет",
    popular: false,
  },
  {
    id: "corporate",
    name: "500+ деревьев",
    trees: 500,
    price: 900000,
    description: "Корпоративный проект",
    popular: false,
  },
]

export function PackageStep({ location, selectedPackage, onPackageSelect, onBack }: PackageStepProps) {
  const locationName = location === "nursery" ? "Forest of Central Asia" : "Mukhatay Ormany"
  const [customTreeCount, setCustomTreeCount] = useState(1)
  const [isCustomSelected, setIsCustomSelected] = useState(false)
  
  // Calculate price based on 2500₸ per tree (same as single tree package)
  const customPrice = customTreeCount * 2500

  const handleCustomSelect = () => {
    setIsCustomSelected(true)
    onPackageSelect("custom", customTreeCount, customPrice)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Выберите пакет</h2>
        <p className="text-muted-foreground">Локация: {locationName}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 border-2 relative ${
              selectedPackage === pkg.id && !isCustomSelected ? "border-emerald-600 shadow-lg" : "border-border"
            }`}
            onClick={() => {
              setIsCustomSelected(false)
              onPackageSelect(pkg.id, pkg.trees, pkg.price)
            }}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Популярно</div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl text-center">{pkg.name}</CardTitle>
              <p className="text-center text-sm text-muted-foreground">{pkg.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600">{pkg.price.toLocaleString()} ₸</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {(pkg.price / pkg.trees).toLocaleString()} ₸ за дерево
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Выращивание саженцев</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Посадка деревьев</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Долгосрочный уход</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Сертификат и отчётность</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Custom tree count option */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 border-2 relative ${
            isCustomSelected ? "border-emerald-600 shadow-lg" : "border-border"
          }`}
          onClick={() => setIsCustomSelected(true)}
        >
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              Своё количество
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">Выберите своё количество деревьев</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600">{customPrice.toLocaleString()} ₸</div>
                <div className="text-sm text-muted-foreground mt-1">2&nbsp;500 ₸ за дерево</div>
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={customTreeCount}
                  onChange={(e) => setCustomTreeCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-sm whitespace-nowrap">деревьев</span>
              </div>
              
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCustomSelect()
                }}
              >
                Выбрать
              </Button>
            </div>
            
            <div className="space-y-2 pt-4">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Выращивание саженцев</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Посадка деревьев</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Долгосрочный уход</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Сертификат и отчётность</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Назад
        </Button>
      </div>
    </div>
  )
}
