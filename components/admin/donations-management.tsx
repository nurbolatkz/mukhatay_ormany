"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Send, Trash2, Download, Search, Filter } from "lucide-react"
import apiService from "@/services/api"

interface Donation {
  id: string;
  donor_name: string;
  email: string;
  location: string;
  trees: number;
  amount: number;
  status: string;
  date: string;
}

export function DonationsManagement() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterLocation, setFilterLocation] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState({
    total: 0,
    processing: 0,
    pending: 0,
    revenue: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [donationsData, summaryData] = await Promise.all([
          apiService.adminGetDonations(),
          apiService.adminGetDonationsSummary()
        ])
        
        setDonations(donationsData)
        setFilteredDonations(donationsData)
        
        // Update summary
        setSummary({
          total: summaryData.total_donations || 0,
          processing: summaryData.processing_count || 0,
          pending: summaryData.pending_count || 0,
          revenue: summaryData.total_revenue || 0
        })
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load donations data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const filtered = donations.filter((donation) => {
      const matchesSearch =
        donation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.donor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === "all" || donation.status === filterStatus
      const matchesLocation = filterLocation === "all" || donation.location === filterLocation
      return matchesSearch && matchesStatus && matchesLocation
    })
    
    setFilteredDonations(filtered)
  }, [donations, searchQuery, filterStatus, filterLocation])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Завершено", className: "bg-emerald-600 text-white" },
      processing: { label: "В процессе", className: "bg-yellow-600 text-white" },
      pending: { label: "Ожидание", className: "bg-orange-600 text-white" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка данных пожертвований...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <p className="text-muted-foreground mt-2">Пожалуйста, попробуйте обновить страницу</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Управление пожертвованиями</h1>
          <p className="text-muted-foreground">Просмотр и управление всеми пожертвованиями</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Download className="h-4 w-4 mr-2" />
          Экспорт
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{summary.total}</div>
            <p className="text-sm text-muted-foreground">Всего пожертвований</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{summary.processing}</div>
            <p className="text-sm text-muted-foreground">В процессе</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{summary.pending}</div>
            <p className="text-sm text-muted-foreground">Ожидают</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{summary.revenue.toLocaleString()} ₸</div>
            <p className="text-sm text-muted-foreground">Общий доход</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по ID, имени или email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="completed">Завершено</SelectItem>
                <SelectItem value="processing">В процессе</SelectItem>
                <SelectItem value="pending">Ожидание</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="md:w-64">
                <SelectValue placeholder="Локация" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все локации</SelectItem>
                <SelectItem value="Forest of Central Asia">Forest of Central Asia</SelectItem>
                <SelectItem value="Mukhatay Ormany">Mukhatay Ormany</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donations Table */}
      <Card className="border-2">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Донор</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Локация</TableHead>
                  <TableHead>Деревья</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.id}</TableCell>
                    <TableCell>{donation.donor_name}</TableCell>
                    <TableCell className="text-muted-foreground">{donation.email}</TableCell>
                    <TableCell>{donation.location}</TableCell>
                    <TableCell className="font-semibold">{donation.trees}</TableCell>
                    <TableCell className="font-semibold">{donation.amount.toLocaleString()} ₸</TableCell>
                    <TableCell>{getStatusBadge(donation.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(donation.date).toLocaleDateString('ru-RU')}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredDonations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Пожертвования не найдены</p>
        </div>
      )}
    </div>
  )
}
