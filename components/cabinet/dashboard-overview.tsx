"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TreePine, TrendingUp, Award, Calendar } from "lucide-react"
import type { CabinetView } from "@/app/cabinet/page"

interface DashboardOverviewProps {
  onNavigate: (view: CabinetView) => void
}

const recentActivity = [
  {
    id: 1,
    title: "Посадка завершена",
    description: "25 деревьев в Forest of Central Asia",
    date: "2 дня назад",
  },
  {
    id: 2,
    title: "Новый сертификат",
    description: "Сертификат №1234 готов",
    date: "5 дней назад",
  },
  {
    id: 3,
    title: "Сезонный отчёт",
    description: "Доступен отчёт за весну 2024",
    date: "1 неделю назад",
  },
]

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Добро пожаловать!</h1>
        <p className="text-muted-foreground">Ваш вклад в восстановление лесов Казахстана</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <TreePine className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">127</div>
                <p className="text-sm text-muted-foreground">Посажено деревьев</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">285,000 ₸</div>
                <p className="text-sm text-muted-foreground">Общий вклад</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">5</div>
                <p className="text-sm text-muted-foreground">Сертификатов</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">2.5 т</div>
                <p className="text-sm text-muted-foreground">CO₂ компенсация</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Последняя активность</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2" />
                <div className="flex-1">
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-sm text-muted-foreground">{activity.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">{activity.date}</div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => onNavigate("history")}>
              Вся история
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
              <a href="/donate">Посадить больше деревьев</a>
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => onNavigate("certificates")}>
              Скачать сертификаты
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => onNavigate("trees")}>
              Посмотреть мои деревья
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Impact Summary */}
      <Card className="border-2 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
        <CardHeader>
          <CardTitle>Ваш экологический вклад</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">127</div>
              <p className="text-sm text-muted-foreground mt-1">Деревьев посажено</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">2.5 т</div>
              <p className="text-sm text-muted-foreground mt-1">CO₂ поглощено за год</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">38 м²</div>
              <p className="text-sm text-muted-foreground mt-1">Восстановлено леса</p>
            </div>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Благодаря вашему вкладу мы восстановили экосистему на площади более 38 квадратных метров
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
