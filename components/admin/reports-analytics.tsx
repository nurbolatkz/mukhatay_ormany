"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, TrendingDown } from "lucide-react"
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const revenueData = [
  { month: "Янв", revenue: 1012500, target: 1000000 },
  { month: "Фев", revenue: 1170000, target: 1000000 },
  { month: "Мар", revenue: 2002500, target: 1500000 },
  { month: "Апр", revenue: 2790000, target: 2000000 },
  { month: "Май", revenue: 3555000, target: 2500000 },
  { month: "Июн", revenue: 2970000, target: 2500000 },
]

const donorTypeData = [
  { type: "Частные лица", count: 380, percentage: 79 },
  { type: "Малый бизнес", count: 65, percentage: 14 },
  { type: "Корпорации", count: 35, percentage: 7 },
]

const treesGrowthData = [
  { month: "Янв", planted: 450, survived: 423 },
  { month: "Фев", planted: 520, survived: 489 },
  { month: "Мар", planted: 890, survived: 836 },
  { month: "Апр", planted: 1240, survived: 1178 },
  { month: "Май", planted: 1580, survived: 1501 },
  { month: "Июн", planted: 1320, survived: 1254 },
]

export function ReportsAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Отчёты и аналитика</h1>
          <p className="text-muted-foreground">Подробная статистика и экспорт данных</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="last-6-months">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-30-days">Последние 30 дней</SelectItem>
              <SelectItem value="last-3-months">Последние 3 месяца</SelectItem>
              <SelectItem value="last-6-months">Последние 6 месяцев</SelectItem>
              <SelectItem value="this-year">Этот год</SelectItem>
              <SelectItem value="all-time">Всё время</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Экспорт отчёта
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Общий доход</span>
              <div className="flex items-center gap-1 text-emerald-600 text-sm">
                <TrendingUp className="h-3 w-3" />
                15%
              </div>
            </div>
            <div className="text-2xl font-bold">13.5M ₸</div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Средний чек</span>
              <div className="flex items-center gap-1 text-emerald-600 text-sm">
                <TrendingUp className="h-3 w-3" />
                8%
              </div>
            </div>
            <div className="text-2xl font-bold">28,125 ₸</div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Выживаемость</span>
              <div className="flex items-center gap-1 text-destructive text-sm">
                <TrendingDown className="h-3 w-3" />
                2%
              </div>
            </div>
            <div className="text-2xl font-bold">94.8%</div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Конверсия</span>
              <div className="flex items-center gap-1 text-emerald-600 text-sm">
                <TrendingUp className="h-3 w-3" />
                5%
              </div>
            </div>
            <div className="text-2xl font-bold">3.8%</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Доход и целевые показатели</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Доход" />
              <Area type="monotone" dataKey="target" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} name="Цель" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Donor Types & Trees Growth */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Типы доноров</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donorTypeData.map((donor, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{donor.type}</span>
                    <span className="text-sm text-muted-foreground">
                      {donor.count} ({donor.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${donor.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Посадка и выживаемость деревьев</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={treesGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="planted" fill="#10b981" name="Посажено" />
                <Bar dataKey="survived" fill="#14b8a6" name="Выжило" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
