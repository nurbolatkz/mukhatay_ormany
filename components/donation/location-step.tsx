"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, TreePine, MapPin, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import apiService from "@/services/api"

interface LocationData {
  id: string
  name: string
  description: string
  area_hectares: number
  coordinates: string
  image_url: string
  status: string
}

interface LocationStepProps {
  selectedLocation: string | null
  onLocationSelect: (locationId: string) => void
  autoProceed?: boolean
}

export function LocationStep({ selectedLocation, onLocationSelect, autoProceed = false }: LocationStepProps) {
  const [locations, setLocations] = useState<LocationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationSelected, setLocationSelected] = useState(false)

  // Auto-proceed when a location is selected and autoProceed is enabled
  useEffect(() => {
    if (autoProceed && locationSelected && selectedLocation) {
      // Small delay to ensure state is updated before proceeding
      const timer = setTimeout(() => {
        // Find the continue button and click it
        const continueButton = document.querySelector('button span:contains("Продолжить")')?.closest('button');
        if (continueButton) {
          (continueButton as HTMLButtonElement).click();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [autoProceed, locationSelected, selectedLocation]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true)
        const locationsData = await apiService.getLocations()
        setLocations(locationsData)
      } catch (err) {
        console.error('Error fetching locations:', err)
        setError('Не удалось загрузить локации')
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

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
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground mb-4">Выберите <span className="text-primary">локацию</span> посадки</h2>
        <p className="mx-auto max-w-2xl text-base text-foreground/70">Где вы хотите посадить деревья? Все локации находятся под нашим пристальным вниманием и заботой.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-12">
        {locations.map((location) => (
          <label 
            key={location.id}
            className="group relative cursor-pointer"
          >
            <input 
              type="radio" 
              name="location" 
              value={location.id}
              checked={selectedLocation === location.id}
              onChange={() => {
                onLocationSelect(location.id);
                // If autoProceed is enabled, simulate clicking the continue button after a short delay
                if (autoProceed) {
                  setTimeout(() => {
                    const continueButton = document.querySelector('button:contains("Продолжить")');
                    if (continueButton) {
                      (continueButton as HTMLButtonElement).click();
                    }
                  }, 100);
                }
              }}
              className="peer sr-only"
            />
            <div className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/20 p-6 backdrop-blur-md transition-all duration-300 peer-checked:border-primary peer-checked:bg-white/5 peer-checked:shadow-[0_0_30px_rgba(249,245,6,0.15)] hover:border-foreground/30 hover:-translate-y-1 hover:bg-card/30 ${selectedLocation === location.id ? 'border-primary bg-white/5 shadow-[0_0_30px_rgba(249,245,6,0.15)]' : ''}`}>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-border text-primary group-hover:scale-110 transition-transform duration-300">
                {location.name.includes('Forest') ? (
                  <Leaf className="h-8 w-8" />
                ) : (
                  <TreePine className="h-8 w-8" />
                )}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{location.name}</h3>
              <p className="text-sm text-foreground/60 mb-4">
                {location.name.includes('Forest') ? "Питомник" : "Карагандинская область"}
              </p>
              
              <div className="flex items-center gap-2 text-foreground/60 mb-4">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{location.coordinates}</span>
              </div>

              <div className="bg-card/5 rounded-lg p-4 text-center border border-border/50 mb-4">
                <div className="text-2xl font-bold text-primary">
                  {location.area_hectares >= 1000 
                    ? `${(location.area_hectares / 1000).toFixed(1)} тыс. га` 
                    : `${location.area_hectares} га`}
                </div>
                <div className="text-sm text-foreground/60">площадь проекта</div>
              </div>

              <p className="text-sm text-foreground/70 mb-4">{location.description}</p>

              <ul className="space-y-2 mb-6 flex-grow">
                <li className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="material-symbols-outlined !text-lg text-primary shrink-0">check</span>
                  <span>Доступно круглый год</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="material-symbols-outlined !text-lg text-primary shrink-0">check</span>
                  <span>Быстрый старт</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="material-symbols-outlined !text-lg text-primary shrink-0">check</span>
                  <span>Идеально для частных лиц</span>
                </li>
              </ul>
              
              <div className={`mt-auto w-full rounded-xl border py-2 text-center text-sm font-semibold transition-colors group-hover:bg-primary group-hover:text-background-dark ${selectedLocation === location.id ? 'bg-primary text-background-dark border-primary' : 'border-border text-foreground'}`}>
                Выбрать локацию
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center gap-6">
        <button 
          className="group relative flex h-14 w-full max-w-sm items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 text-base font-bold text-background-dark transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(249,245,6,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => selectedLocation && onLocationSelect(selectedLocation)}
          disabled={!selectedLocation}
        >
          <span>Продолжить</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}