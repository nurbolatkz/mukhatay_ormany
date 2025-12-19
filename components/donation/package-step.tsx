"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Plus, Minus, Loader2 } from "lucide-react"
import type { Location } from "@/app/donate/page"
import apiService from "@/services/api"

interface PackageData {
  id: string
  name: string
  tree_count: number
  price: number
  description: string
  popular: boolean
}

interface PackageStepProps {
  location: string
  selectedPackage: string
  onPackageSelect: (packageType: string, treeCount: number, amount: number) => void
  onBack: () => void
}

export function PackageStep({ location, selectedPackage, onPackageSelect, onBack }: PackageStepProps) {
  const [packages, setPackages] = useState<PackageData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [customTreeCount, setCustomTreeCount] = useState(1)
  const [isCustomSelected, setIsCustomSelected] = useState(false)
  
  // Get location name from the location ID
  const locationName = location === "loc_nursery_001" ? "Forest of Central Asia" : "Mukhatay Ormany"
  
  // Calculate price based on 2500₸ per tree (same as single tree package)
  const customPrice = customTreeCount * 2500

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        // For now, we'll use hardcoded packages since there's no API endpoint for packages
        // In a real implementation, this would be: const packagesData = await apiService.getPackages()
        const packagesData = [
          {
            id: "small",
            name: "10 деревьев",
            tree_count: 10,
            price: 22500,
            description: "Небольшой пакет",
            popular: true,
          },
          {
            id: "medium",
            name: "50 деревьев",
            tree_count: 50,
            price: 100000,
            description: "Средний пакет",
            popular: false,
          },
          {
            id: "large",
            name: "100 деревьев",
            tree_count: 100,
            price: 190000,
            description: "Крупный пакет",
            popular: false,
          }
        ]
        setPackages(packagesData)
      } catch (err) {
        console.error('Error fetching packages:', err)
        setError('Не удалось загрузить пакеты')
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const handleCustomSelect = () => {
    setIsCustomSelected(true)
    onPackageSelect("custom", customTreeCount, customPrice)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          Повторить попытку
        </button>
      </div>
    )
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
              onPackageSelect(pkg.id, pkg.tree_count, pkg.price)
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
                  {(pkg.price / pkg.tree_count).toLocaleString()} ₸ за дерево
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
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon"
                  className="h-10 w-10 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomTreeCount(prev => Math.max(1, prev - 1));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      setCustomTreeCount(prev => Math.max(1, prev - 1));
                    }
                  }}
                  aria-label="Уменьшить количество деревьев"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                  <Input
                    type="number"
                    min="1"
                    value={customTreeCount}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Prevent negative numbers and non-numeric values
                        if (value === '' || isNaN(parseInt(value))) {
                          setCustomTreeCount(1);
                        } else {
                          const numValue = parseInt(value);
                          if (numValue >= 1) {
                            setCustomTreeCount(numValue);
                          } else {
                            setCustomTreeCount(1);
                          }
                        }
                      }}
                      onKeyPress={(e) => {
                        // Prevent entering negative signs or other non-numeric characters
                        if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') {
                          e.preventDefault();
                        }
                      }}
                      className="text-center w-20"
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) => {
                        // Ensure minimum value when input loses focus
                        if (e.target.value === '' || parseInt(e.target.value) < 1) {
                          setCustomTreeCount(1);
                        }
                      }}
                  />
                  <div className="sr-only" aria-live="polite">
                    Текущее количество деревьев: {customTreeCount}
                  </div>
                  </div>
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon"
                  className="h-10 w-10 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomTreeCount(prev => prev + 1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      setCustomTreeCount(prev => prev + 1);
                    }
                  }}
                  aria-label="Увеличить количество деревьев"
                >
                  <Plus className="h-4 w-4" />
                </Button>
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