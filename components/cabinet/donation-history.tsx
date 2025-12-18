"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, MapPin, TreePine } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import apiService from "@/services/api"

export function DonationHistory() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true)
        const userDonations = await apiService.getUserDonations()
        
        // Transform the data to match the expected format
        const transformedDonations = userDonations.map(donation => ({
          id: donation.id,
          date: new Date(donation.date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          location: donation.location,
          trees: donation.trees,
          amount: donation.amount,
          status: donation.status === 'completed' ? 'Завершено' : donation.status,
          statusColor: 'emerald',
        }))
        
        setDonations(transformedDonations)
      } catch (err) {
        console.error('Error fetching donations:', err)
        setError('Failed to load donation history')
        
        // Fallback to localStorage data if API fails
        const userDonations = JSON.parse(localStorage.getItem('userDonations') || '[]')
        if (userDonations.length > 0) {
          const transformedDonations = userDonations.map(donation => ({
            id: donation.id,
            date: donation.date,
            location: donation.location,
            trees: donation.trees,
            amount: donation.amount,
            status: donation.status,
            statusColor: 'emerald',
          }))
          setDonations(transformedDonations)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка истории пожертвований...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
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
          <h1 className="text-3xl font-bold mb-2">История пожертвований</h1>
          <p className="text-muted-foreground">Все ваши взносы в проект</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Экспорт
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-emerald-600">
              {donations.reduce((total, donation) => total + donation.trees, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Всего деревьев</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-emerald-600">
              {donations.reduce((total, donation) => total + donation.amount, 0).toLocaleString()} ₸
            </div>
            <p className="text-sm text-muted-foreground">Общая сумма</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-emerald-600">{donations.length}</div>
            <p className="text-sm text-muted-foreground">Пожертвований</p>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Table */}
      <Card className="border-2 hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Локация</TableHead>
                <TableHead>Деревья</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation, index) => (
                <TableRow key={`${donation.id}-${index}`}>
                  <TableCell className="font-medium">{donation.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {donation.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {donation.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TreePine className="h-4 w-4 text-emerald-600" />
                      {donation.trees}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{donation.amount.toLocaleString()} ₸</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-600 text-white">{donation.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Чек
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {donations.map((donation, index) => (
          <Card key={`${donation.id}-${index}`} className="border-2">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{donation.id}</span>
                <Badge className="bg-emerald-600 text-white">{donation.status}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {donation.date}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {donation.location}
                </div>
                <div className="flex items-center gap-2">
                  <TreePine className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">{donation.trees} деревьев</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-lg font-bold text-emerald-600">{donation.amount.toLocaleString()} ₸</span>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Чек
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
