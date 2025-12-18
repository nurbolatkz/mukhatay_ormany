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
}

export function LocationStep({ selectedLocation, onLocationSelect }: LocationStepProps) {
  const [locations, setLocations] = useState<LocationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
              <div className="mb-4 flex justify-center">
                {location.name.includes('Forest') ? (
                  <Leaf className="h-16 w-16 text-emerald-600" />
                ) : (
                  <TreePine className="h-16 w-16 text-teal-600" />
                )}
              </div>
              <CardTitle className="text-2xl text-center mb-2">{location.name}</CardTitle>
              <p className="text-center text-muted-foreground font-medium">
                {location.name.includes('Forest') ? "Питомник" : "Карагандинская область"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground justify-center">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{location.coordinates}</span>
              </div>

              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {location.area_hectares >= 1000 
                    ? `${(location.area_hectares / 1000).toFixed(1)} тыс. га` 
                    : `${location.area_hectares} га`}
                </div>
                <div className="text-sm text-muted-foreground">площадь проекта</div>
              </div>

              <p className="text-sm text-muted-foreground text-center">{location.description}</p>

              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  </div>
                  <span>Доступно круглый год</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  </div>
                  <span>Быстрый старт</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  </div>
                  <span>Идеально для частных лиц</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}