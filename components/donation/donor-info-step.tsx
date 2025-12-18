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
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Ваши данные</h2>
        <p className="text-muted-foreground">Заполните информацию для получения сертификата</p>
      </div>

      <Card className="max-w-2xl mx-auto border-2">
        <CardHeader>
          <CardTitle>Информация о доноре</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Полное имя <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (XXX) XXX-XX-XX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Название компании (опционально)</Label>
              <Input
                id="companyName"
                placeholder="Для корпоративных доноров"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Сообщение или посвящение (опционально)</Label>
              <Textarea
                id="message"
                rows={3}
                placeholder="Например: В честь..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="subscribeUpdates"
                checked={formData.subscribeUpdates}
                onCheckedChange={(checked) => setFormData({ ...formData, subscribeUpdates: checked as boolean })}
              />
              <label htmlFor="subscribeUpdates" className="text-sm cursor-pointer">
                Я согласен получать обновления о проекте
              </label>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Назад
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Перейти к оплате
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
