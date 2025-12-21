"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from "lucide-react"

export function ProfileSettings() {
  const [profileData, setProfileData] = useState({
    fullName: "Асем Нурланова",
    email: "asem.nurlanova@example.com",
    phone: "+7 (701) 234-56-78",
    companyName: "",
  })

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    emailReports: true,
    emailNews: false,
  })

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Profile updated:", profileData)
    alert("Профиль успешно обновлён!")
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.new !== password.confirm) {
      alert("Новые пароли не совпадают!")
      return
    }
    console.log("[v0] Password changed")
    alert("Пароль успешно изменён!")
    setPassword({ current: "", new: "", confirm: "" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Настройки профиля</h1>
        <p className="text-muted-foreground">Управляйте вашим аккаунтом</p>
      </div>

      {/* Personal Information */}
      <Card className="border-2 rounded-2xl">
        <CardHeader>
          <CardTitle>Личная информация</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Полное имя</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Название компании (опционально)</Label>
              <Input
                id="companyName"
                value={profileData.companyName}
                onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
              />
            </div>

            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
              Сохранить изменения
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-2 rounded-2xl">
        <CardHeader>
          <CardTitle>Уведомления</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailUpdates"
              checked={notifications.emailUpdates}
              onCheckedChange={(checked) => setNotifications({ ...notifications, emailUpdates: checked as boolean })}
            />
            <label htmlFor="emailUpdates" className="text-sm cursor-pointer">
              Получать обновления о проекте
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailReports"
              checked={notifications.emailReports}
              onCheckedChange={(checked) => setNotifications({ ...notifications, emailReports: checked as boolean })}
            />
            <label htmlFor="emailReports" className="text-sm cursor-pointer">
              Получать сезонные отчёты
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailNews"
              checked={notifications.emailNews}
              onCheckedChange={(checked) => setNotifications({ ...notifications, emailNews: checked as boolean })}
            />
            <label htmlFor="emailNews" className="text-sm cursor-pointer">
              Получать новости и анонсы
            </label>
          </div>

          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">Сохранить настройки</Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-2 rounded-2xl">
        <CardHeader>
          <CardTitle>Изменить пароль</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <Input
                id="currentPassword"
                type="password"
                value={password.current}
                onChange={(e) => setPassword({ ...password, current: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <Input
                id="newPassword"
                type="password"
                value={password.new}
                onChange={(e) => setPassword({ ...password, new: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={password.confirm}
                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
              />
            </div>

            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
              Изменить пароль
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-destructive rounded-2xl">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Опасная зона
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Удаление аккаунта приведёт к безвозвратной потере всех данных, включая историю пожертвований и сертификаты.
          </p>
          <Button variant="destructive" className="rounded-full">Удалить аккаунт</Button>
        </CardContent>
      </Card>
    </div>
  )
}
