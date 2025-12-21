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
        <h1 className="text-3xl font-bold mb-2 text-[#1a3d2e] dark:text-white">Добро пожаловать!</h1>
        <p className="text-[#6b7280] dark:text-white/80">Ваш вклад в восстановление лесов Казахстана</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 hover:shadow-lg transition-shadow rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#fef9e7] flex items-center justify-center">
                <TreePine className="h-6 w-6 text-[#1a3d2e]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1a3d2e]">127</div>
                <p className="text-sm text-[#6b7280]">Посажено деревьев</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#fef9e7] flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#1a3d2e]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1a3d2e]">285,000 ₸</div>
                <p className="text-sm text-[#6b7280]">Общий вклад</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#fef9e7] flex items-center justify-center">
                <Award className="h-6 w-6 text-[#1a3d2e]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1a3d2e]">5</div>
                <p className="text-sm text-[#6b7280]">Сертификатов</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#fef9e7] flex items-center justify-center">
                <Calendar className="h-6 w-6 text-[#1a3d2e]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1a3d2e]">2.5 т</div>
                <p className="text-sm text-[#6b7280]">CO₂ компенсация</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-[#1a3d2e] dark:text-white">Последняя активность</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#f4e31e] mt-2" />
                <div className="flex-1">
                  <div className="font-medium text-[#1a3d2e] dark:text-white">{activity.title}</div>
                  <div className="text-sm text-[#6b7280] dark:text-white/70">{activity.description}</div>
                  <div className="text-xs text-[#6b7280] dark:text-white/60 mt-1">{activity.date}</div>
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full mt-4 bg-transparent border-2 border-[#e8ebe7] text-[#2d5a45] hover:bg-[#f4e31e] hover:border-[#f4e31e] hover:text-[#1a3d2e] rounded-full" 
              onClick={() => onNavigate("history")}
            >
              Вся история
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-[#1a3d2e] dark:text-white">Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full bg-[#f4e31e] text-[#1a3d2e] rounded-full py-5 font-semibold text-lg shadow-[0_4px_16px_rgba(244,227,30,0.3)] hover:scale-102 hover:shadow-[0_6px_24px_rgba(244,227,30,0.4)] hover:bg-[#ffd700] transition-all duration-300" 
              asChild
            >
              <a href="/donate">Посадить больше деревьев</a>
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-transparent border-2 border-[#e8ebe7] text-[#2d5a45] hover:bg-[#f4e31e] hover:border-[#f4e31e] hover:text-[#1a3d2e] rounded-full" 
              onClick={() => onNavigate("certificates")}
            >
              Скачать сертификаты
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-transparent border-2 border-[#e8ebe7] text-[#2d5a45] hover:bg-[#f4e31e] hover:border-[#f4e31e] hover:text-[#1a3d2e] rounded-full" 
              onClick={() => onNavigate("trees")}
            >
              Посмотреть мои деревья
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Impact Summary */}
      <Card className="border-2 rounded-2xl bg-[#f8f9f5] dark:bg-[#1a3d2e]/20">
        <CardHeader>
          <CardTitle className="text-[#1a3d2e] dark:text-white">Ваш экологический вклад</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1a3d2e] dark:text-white">127</div>
              <p className="text-sm text-[#6b7280] dark:text-white/70 mt-1">Деревьев посажено</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1a3d2e] dark:text-white">2.5 т</div>
              <p className="text-sm text-[#6b7280] dark:text-white/70 mt-1">CO₂ поглощено за год</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1a3d2e] dark:text-white">38 м²</div>
              <p className="text-sm text-[#6b7280] dark:text-white/70 mt-1">Восстановлено леса</p>
            </div>
          </div>
          <p className="text-sm text-center text-[#6b7280] dark:text-white/70">
            Благодаря вашему вкладу мы восстановили экосистему на площади более 38 квадратных метров
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
              <p className="text-sm text-[#6b7280] dark:text-white/70 mt-1">CO₂ поглощено за год</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1a3d2e] dark:text-white">38 м²</div>
              <p className="text-sm text-[#6b7280] dark:text-white/70 mt-1">Восстановлено леса</p>
            </div>
          </div>
          <p className="text-sm text-center text-[#6b7280] dark:text-white/70">
            Благодаря вашему вкладу мы восстановили экосистему на площади более 38 квадратных метров
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
