"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, TreePine } from "lucide-react"

interface TreeCountStepProps {
  location: string
  treeCount: number
  amount: number
  onTreeCountChange: (treeCount: number, amount: number) => void
  onNext: () => void
  onBack: () => void
}

export function TreeCountStep({ location, treeCount, amount, onTreeCountChange, onNext, onBack }: TreeCountStepProps) {
  const [localTreeCount, setLocalTreeCount] = useState(treeCount || 1)
  
  // Calculate price based on 999₸ per tree
  const calculatePrice = (count: number) => count * 999
  
  // Get location name from the location ID
  const locationName = location === "loc_nursery_001" ? "Forest of Central Asia" : "Mukhatay Ormany"
  
  const handleTreeCountChange = (count: number) => {
    if (count < 1) count = 1
    if (count > 1000) count = 1000 // Set reasonable upper limit
    
    setLocalTreeCount(count)
    onTreeCountChange(count, calculatePrice(count))
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    handleTreeCountChange(value)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Выберите количество деревьев</h2>
        <p className="text-foreground/60">Укажите, сколько деревьев вы хотите посадить в {locationName}</p>
      </div>
      
      <Card className="max-w-2xl mx-auto rounded-lg">
        <CardHeader className="rounded-t-md">
          <CardTitle className="text-center">Количество деревьев</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 rounded-b-md">
          {/* Tree counter */}
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleTreeCountChange(localTreeCount - 1)}
              disabled={localTreeCount <= 1}
              className="rounded-md"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <div className="relative">
              <Input
                type="number"
                min="1"
                max="1000"
                value={localTreeCount}
                onChange={handleInputChange}
                className="w-32 text-center text-2xl font-bold h-16 rounded-md"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <TreePine className="h-5 w-5 text-foreground/50" />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleTreeCountChange(localTreeCount + 1)}
              className="rounded-md"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Price display */}
          <div className="text-center py-6 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-sm text-foreground/60 mb-1">Общая стоимость</p>
            <p className="text-4xl font-extrabold text-foreground">
              {calculatePrice(localTreeCount).toLocaleString()} ₸
            </p>
            <p className="text-sm text-foreground/60 mt-2">
              {localTreeCount} деревьев × 999 ₸ за дерево
            </p>
          </div>
          
          {/* Location info */}
          <div className="flex items-center justify-center gap-3 p-4 bg-card/50 rounded-md border border-border">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
              <TreePine className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{locationName}</p>
              <p className="text-sm text-foreground/60">Место посадки</p>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack} className="rounded-md">
              Назад
            </Button>
            <Button onClick={() => {
              // Create a default donor info since we're skipping the donor form
              const defaultDonorInfo = {
                fullName: "Анонимный пользователь",
                email: "anonymous@example.com",
                phone: "",
                companyName: "",
                message: "",
                subscribeUpdates: false
              };
              // Update donation data with default donor info
              onTreeCountChange(localTreeCount, calculatePrice(localTreeCount));
              // Proceed to payment
              onNext();
            }} className="bg-primary hover:bg-primary/90 rounded-md">
              Продолжить к оплате
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}