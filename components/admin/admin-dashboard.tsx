"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TreePine, Users, TrendingUp, Heart, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { AdminView } from "@/app/admin/page"

interface AdminDashboardProps {
  onNavigate: (view: AdminView) => void
}

const monthlyData = [
  { month: "Янв", donations: 45, trees: 450, revenue: 1012500 },
  { month: "Фев", donations: 52, trees: 520, revenue: 1170000 },
  { month: "Мар", donations: 78, trees: 890, revenue: 2002500 },
  { month: "Апр", donations: 95, trees: 1240, revenue: 2790000 },
  { month: "Май", donations: 112, trees: 1580, revenue: 3555000 },
  { month: "Июн", donations: 98, trees: 1320, revenue: 2970000 },
]

const locationData = [
  { name: "Forest of Central Asia", value: 45, color: "#10b981" },
  { name: "Mukhatay Ormany", value: 55, color: "#14b8a6" },
]

const recentDonations = [
  { id: "DON-2024-156", donor: "Асем Нурланова", trees: 25, amount: 56250, status: "Завершено" },
  { id: "DON-2024-155", donor: "Казахтелеком", trees: 500, amount: 900000, status: "В процессе" },
  { id: "DON-2024-154", donor: "Иван Петров", trees: 10, amount: 22500, status: "Завершено" },
  { id: "DON-2024-153", donor: "Air Astana", trees: 1000, amount: 1800000, status: "Завершено" },
]

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Панель управления</h1>
        <p className="text-muted-foreground">Обзор ключевых показателей проекта</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <TreePine className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4" />
                12%
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">6,000</div>
            <p className="text-sm text-muted-foreground">Деревьев посажено</p>
            <p className="text-xs text-muted-foreground mt-1">В этом месяце</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4" />
                8%
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">480</div>
            <p className="text-sm text-muted-foreground">Пожертвований</p>
            <p className="text-xs text-muted-foreground mt-1">За последние 30 дней</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4" />
                15%
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">13.5M ₸</div>
            <p className="text-sm text-muted-foreground">Доход</p>
            <p className="text-xs text-muted-foreground mt-1">За последние 30 дней</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex items-center gap-1 text-destructive text-sm font-medium">
                <ArrowDownRight className="h-4 w-4" />
                2%
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">1,247</div>
            <p className="text-sm text-muted-foreground">Активных доноров</p>
            <p className="text-xs text-muted-foreground mt-1">Всего пользователей</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Динамика пожертвований</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="donations" stroke="#10b981" name="Пожертвования" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Деревья по месяцам</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="trees" fill="#10b981" name="Деревья" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Location Distribution */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border-2 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Последние пожертвования</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("donations")}>
              Все
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{donation.donor}</div>
                    <div className="text-sm text-muted-foreground">{donation.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{donation.trees} деревьев</div>
                    <div className="text-sm text-muted-foreground">{donation.amount.toLocaleString()} ₸</div>
                  </div>
                  <div className="ml-4">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        donation.status === "Завершено"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {donation.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Распределение по локациям</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.value}%`}
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {locationData.map((location) => (
                <div key={location.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: location.color }} />
                    <span>{location.name}</span>
                  </div>
                  <span className="font-medium">{location.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
