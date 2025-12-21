"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface DonorInfo {
  fullName: string
  email: string
  phone: string
  companyName: string
  message: string
  subscribeUpdates: boolean
}

interface DonorInfoStepProps {
  donorInfo: DonorInfo
  onSubmit: (donorInfo: DonorInfo) => void
  onBack: () => void
}

export function DonorInfoStep({ donorInfo, onSubmit, onBack }: DonorInfoStepProps) {
  const [formData, setFormData] = useState<DonorInfo>(donorInfo)
  const [errors, setErrors] = useState<Partial<Record<keyof DonorInfo, string>>>({})

  const validate = () => {
    const newErrors: Partial<Record<keyof DonorInfo, string>> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Введите имя"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Введите email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Некорректный email"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground mb-4">Информация о <span className="text-primary">доноре</span></h2>
        <p className="mx-auto max-w-2xl text-base text-foreground/70">Заполните информацию для получения сертификата и отчетности о посадке</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground">
              Полное имя <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={`bg-background/5 border border-border rounded-xl px-4 py-3 text-foreground ${errors.fullName ? "border-destructive" : ""}`}
              placeholder="Введите ваше полное имя"
            />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`bg-background/5 border border-border rounded-xl px-4 py-3 text-foreground ${errors.email ? "border-destructive" : ""}`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">Телефон</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (XXX) XXX-XX-XX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-background/5 border border-border rounded-xl px-4 py-3 text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-foreground">Название компании (опционально)</Label>
            <Input
              id="companyName"
              placeholder="Для корпоративных доноров"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="bg-background/5 border border-border rounded-xl px-4 py-3 text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground">Сообщение или посвящение (опционально)</Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Например: В честь..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-background/5 border border-border rounded-xl px-4 py-3 text-foreground resize-none"
            />
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="subscribeUpdates"
              checked={formData.subscribeUpdates}
              onCheckedChange={(checked) => setFormData({ ...formData, subscribeUpdates: checked as boolean })}
              className="mt-1 border border-border data-[state=checked]:bg-primary data-[state=checked]:text-background-dark"
            />
            <label htmlFor="subscribeUpdates" className="text-sm text-foreground cursor-pointer">
              Я согласен получать обновления о проекте и отчеты о посадке деревьев
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="w-full sm:w-auto border-border text-foreground hover:bg-card/10"
            >
              Назад
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-3 text-base font-bold text-background-dark transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(249,245,6,0.5)]"
            >
              <span>Перейти к оплате</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
