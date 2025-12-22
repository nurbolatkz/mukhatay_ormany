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
  
  // Calculate price based on 999₸ per tree
  const customPrice = customTreeCount * 999

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const packagesData = await apiService.getPackages()
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-primary text-background-dark rounded-full hover:bg-primary/90 transition-all"
        >
          Повторить попытку
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground mb-4">Выберите ваш <span className="text-primary">вклад в лес</span></h2>
        <p className="mx-auto max-w-2xl text-base text-foreground/70">Вы не просто донатите — вы выращиваете лес. Выберите пакет, чтобы начать свой путь восстановления природы Казахстана.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {packages.map((pkg) => (
          <label 
            key={pkg.id}
            className="group relative cursor-pointer"
          >
            <input 
              type="radio" 
              name="package" 
              value={pkg.id}
              checked={selectedPackage === pkg.id && !isCustomSelected}
              onChange={() => {
                setIsCustomSelected(false)
                onPackageSelect(pkg.id, pkg.tree_count, pkg.price)
              }}
              className="peer sr-only"
            />
            <div className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/20 p-6 backdrop-blur-md transition-all duration-300 peer-checked:border-primary peer-checked:bg-white/5 peer-checked:shadow-[0_0_30px_rgba(249,245,6,0.15)] hover:border-foreground/30 hover:-translate-y-1 hover:bg-card/30 ${selectedPackage === pkg.id && !isCustomSelected ? 'border-primary bg-white/5 shadow-[0_0_30px_rgba(249,245,6,0.15)]' : ''}`}>
              {pkg.popular && (
                <div className="absolute -right-12 top-6 rotate-45 bg-primary py-1 px-12 text-[10px] font-bold uppercase tracking-widest text-background-dark shadow-sm">
                  Популярный
                </div>
              )}
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-border text-primary group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined !text-3xl">
                  {pkg.id === 'small' ? 'spa' : pkg.id === 'medium' ? 'park' : 'forest'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
              <p className="text-3xl font-extrabold text-primary mb-6">{pkg.price.toLocaleString()} ₸</p>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="material-symbols-outlined !text-lg text-primary shrink-0">check</span>
                  <span>Выращивание саженца</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="material-symbols-outlined !text-lg text-primary shrink-0">check</span>
                  <span>Посадка дерева</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="material-symbols-outlined !text-lg text-primary shrink-0">check</span>
                  <span>Уход в течение 3 лет</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="material-symbols-outlined !text-lg text-primary shrink-0">check</span>
                  <span>Фото-отчет</span>
                </li>
              </ul>
              <div className={`mt-auto w-full rounded-xl border py-2 text-center text-sm font-semibold transition-colors group-hover:bg-primary group-hover:text-background-dark ${selectedPackage === pkg.id && !isCustomSelected ? 'bg-primary text-background-dark border-primary' : 'border-border text-foreground'}`}>
                Выбрать
              </div>
            </div>
          </label>
        ))}
        
        {/* Custom tree count option */}
        <label className="group relative cursor-pointer">
          <input 
            type="radio" 
            name="package" 
            value="custom"
            checked={isCustomSelected}
            onChange={() => setIsCustomSelected(true)}
            className="peer sr-only"
          />
          <div className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/20 p-6 backdrop-blur-md transition-all duration-300 peer-checked:border-primary peer-checked:bg-white/5 peer-checked:shadow-[0_0_30px_rgba(249,245,6,0.15)] hover:border-foreground/30 hover:-translate-y-1 hover:bg-card/30 ${isCustomSelected ? 'border-primary bg-white/5 shadow-[0_0_30px_rgba(249,245,6,0.15)]' : ''}`}>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-border text-primary group-hover:scale-110 transition-transform duration-300">
              <Plus className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Своё количество</h3>
            <div className="text-2xl font-extrabold text-primary mb-6 pt-1">На выбор</div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="material-symbols-outlined !text-lg text-primary shrink-0">check</span>
                <span>Любое количество деревьев</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="material-symbols-outlined !text-lg text-primary shrink-0">check</span>
                <span>Индивидуальный подход</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="material-symbols-outlined !text-lg text-primary shrink-0">check</span>
                <span>Гибкая стоимость</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="material-symbols-outlined !text-lg text-primary shrink-0">check</span>
                <span>Персональный менеджер</span>
              </li>
            </ul>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon"
                  className="h-10 w-10 rounded-full border-border bg-white/5 text-foreground hover:bg-white/10 hover:border-foreground/50 focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
                <div className="relative">
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
                    className="text-center w-20 bg-background/5 border-border rounded-full"
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
                  className="h-10 w-10 rounded-full border-border bg-white/5 text-foreground hover:bg-white/10 hover:border-foreground/50 focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
                <span className="text-sm whitespace-nowrap text-foreground/80">деревьев</span>
              </div>
              
              <Button 
                className="w-full rounded-xl bg-primary py-2 text-center text-sm font-semibold text-background-dark transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(249,245,6,0.5)]"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCustomSelect()
                }}
              >
                Выбрать
              </Button>
            </div>
          </div>
        </label>
      </div>

      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 border border-border backdrop-blur-sm">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-background-dark">?</span>
          <p className="text-sm text-foreground/80">В цену включен уход за саженцами в течение 3-х лет</p>
        </div>
        <Button 
          className="group relative flex h-14 w-full max-w-sm items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 text-base font-bold text-background-dark transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(249,245,6,0.5)]"
          onClick={() => {
            if (isCustomSelected) {
              handleCustomSelect()
            } else if (selectedPackage) {
              // Find the selected package to trigger the callback
              const pkg = packages.find(p => p.id === selectedPackage)
              if (pkg) {
                onPackageSelect(pkg.id, pkg.tree_count, pkg.price)
              }
            }
          }}
          disabled={!selectedPackage && !isCustomSelected}
        >
          <span>Продолжить</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Button>
        <button 
          className="text-sm font-medium text-foreground/40 hover:text-foreground transition-colors underline decoration-foreground/20 underline-offset-4"
          onClick={onBack}
        >
          Назад
        </button>
      </div>
    </div>
  )
}