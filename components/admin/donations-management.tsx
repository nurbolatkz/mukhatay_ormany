"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Send, Trash2, Download, Search, Edit } from "lucide-react"
import apiService from "@/services/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
// Removed unused imports as per user request

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

interface DonationDetail extends Donation {
  donor_info?: {
    full_name: string;
    phone: string;
    company_name: string;
    message: string;
    subscribe_updates: boolean;
  };
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
  
  // Advanced filter states (removed as per user request)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<DonationDetail | null>(null)
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const { toast } = useToast()

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
      // Basic filters
      const matchesSearch =
        (donation.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (donation.donor_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (donation.email || '').toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === "all" || donation.status === filterStatus
      const matchesLocation = filterLocation === "all" || donation.location === filterLocation
      
      return matchesSearch && matchesStatus && matchesLocation;
    })
    
    setFilteredDonations(filtered)
  }, [donations, searchQuery, filterStatus, filterLocation])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Завершено", className: "bg-emerald-600 text-white" },
      processing: { label: "В процессе", className: "bg-yellow-600 text-white" },
      pending: { label: "Ожидание", className: "bg-orange-600 text-white" },
      pending_payment: { label: "Ожидает оплату", className: "bg-blue-600 text-white" },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { label: status || "Неизвестно", className: "bg-gray-600 text-white" }
    
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const viewDonationDetails = async (donation: Donation) => {
    try {
      // In a real implementation, you would fetch detailed donation data from the API
      // For now, we'll just use the existing data and simulate additional fields
      const detailedDonation: DonationDetail = {
        ...donation,
        donor_info: {
          full_name: donation.donor_name,
          phone: "",
          company_name: "",
          message: "",
          subscribe_updates: true
        }
      }
      setSelectedDonation(detailedDonation)
      setIsDialogOpen(true)
    } catch (err) {
      console.error('Error fetching donation details:', err)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить детали пожертвования",
        variant: "destructive",
      })
    }
  }

  const openEditStatusDialog = (donation: Donation) => {
    setEditingDonation(donation)
    setNewStatus(donation.status)
  }
  
  const hasActiveFilters = () => {
    return (filterStatus !== "all" && filterStatus !== "") ||
           (filterLocation !== "all" && filterLocation !== "") ||
           searchQuery !== ""
  }

  const updateDonationStatus = async () => {
    if (!editingDonation) return
    
    try {
      // Call the API to update the donation status
      await apiService.adminUpdateDonation(editingDonation.id, { status: newStatus })
      
      // Update the local state
      const updatedDonations = donations.map(donation => 
        donation.id === editingDonation.id 
          ? { ...donation, status: newStatus } 
          : donation
      )
      
      setDonations(updatedDonations)
      setFilteredDonations(updatedDonations)
      
      // Update summary statistics
      const total = updatedDonations.length
      const processing = updatedDonations.filter(d => d.status === 'processing').length
      const pending = updatedDonations.filter(d => d.status === 'pending').length
      const revenue = updatedDonations.reduce((sum, d) => sum + (d.amount || 0), 0)
      
      setSummary({
        total,
        processing,
        pending,
        revenue
      })
      
      toast({
        title: "Успех",
        description: "Статус пожертвования успешно обновлен",
      })
      
      setEditingDonation(null)
      setNewStatus("")
    } catch (err) {
      console.error('Error updating donation status:', err)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус пожертвования",
        variant: "destructive",
      })
    }
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
      </div>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{summary.total}</div>
            <p className="text-sm text-muted-foreground">Всего пожертвований</p>
          </CardContent>
        </Card>
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{summary.processing}</div>
            <p className="text-sm text-muted-foreground">В процессе</p>
          </CardContent>
        </Card>
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{summary.pending}</div>
            <p className="text-sm text-muted-foreground">Ожидают</p>
          </CardContent>
        </Card>
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{summary.revenue.toLocaleString()} ₸</div>
            <p className="text-sm text-muted-foreground">Общий доход</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2 rounded-2xl">
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
                <SelectItem value="pending_payment">Ожидает оплату</SelectItem>
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
          </div>
          
          {/* Active Filters Display */}
          {hasActiveFilters() && (
            <div className="mt-3 flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Поиск: {searchQuery}
                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterStatus !== "all" && filterStatus !== "" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Статус: {getStatusBadge(filterStatus).props.children}
                  <button 
                    onClick={() => setFilterStatus("all")} 
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterLocation !== "all" && filterLocation !== "" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Локация: {filterLocation}
                  <button 
                    onClick={() => setFilterLocation("all")} 
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {(dateFrom || dateTo) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Дата: {dateFrom ? dateFrom.toLocaleDateString('ru-RU') : "..."} - {dateTo ? dateTo.toLocaleDateString('ru-RU') : "..."}
                  <button 
                    onClick={() => {
                      setDateFrom(undefined);
                      setDateTo(undefined);
                    }} 
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {(minAmount || maxAmount) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Сумма: {minAmount || "0"} - {maxAmount || "∞"}
                  <button 
                    onClick={() => {
                      setMinAmount("");
                      setMaxAmount("");
                    }} 
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {(minTrees || maxTrees) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Деревья: {minTrees || "0"} - {maxTrees || "∞"}
                  <button 
                    onClick={() => {
                      setMinTrees("");
                      setMaxTrees("");
                    }} 
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                  setFilterLocation("all");
                  // resetAdvancedFilters() - Removed as per user request
                }}
                className="h-6 px-2 text-xs"
              >
                Очистить все
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Advanced Filter Dialog - Removed as per user request */}

      {/* Donations Table */}
      <Card className="border-2 rounded-2xl">
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
                    <TableCell className="font-medium">{donation.id || 'N/A'}</TableCell>
                    <TableCell>{donation.donor_name || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground">{donation.email || 'N/A'}</TableCell>
                    <TableCell>{donation.location || 'N/A'}</TableCell>
                    <TableCell className="font-semibold">{donation.trees || 0}</TableCell>
                    <TableCell className="font-semibold">{(donation.amount || 0).toLocaleString()} ₸</TableCell>
                    <TableCell>{getStatusBadge(donation.status || 'pending')}</TableCell>
                    <TableCell className="text-muted-foreground">{donation.date ? new Date(donation.date).toLocaleDateString('ru-RU') : 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => viewDonationDetails(donation)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditStatusDialog(donation)}>
                          <Edit className="h-4 w-4" />
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

      {/* Donation Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Детали пожертвования</DialogTitle>
          </DialogHeader>
          {selectedDonation && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">ID</Label>
                  <div className="text-sm">{selectedDonation.id}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Дата</Label>
                  <div className="text-sm">
                    {selectedDonation.date ? new Date(selectedDonation.date).toLocaleDateString('ru-RU') : 'N/A'}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Донор</Label>
                  <div className="text-sm">{selectedDonation.donor_name}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <div className="text-sm">{selectedDonation.email}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Локация</Label>
                  <div className="text-sm">{selectedDonation.location}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Статус</Label>
                  <div className="text-sm">{getStatusBadge(selectedDonation.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Деревья</Label>
                  <div className="text-sm">{selectedDonation.trees}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Сумма</Label>
                  <div className="text-sm">{selectedDonation.amount?.toLocaleString()} ₸</div>
                </div>
              </div>
              
              {selectedDonation.donor_info && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Информация о доноре</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Полное имя</Label>
                      <div className="text-sm">{selectedDonation.donor_info.full_name}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Телефон</Label>
                      <div className="text-sm">{selectedDonation.donor_info.phone || 'Не указан'}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Компания</Label>
                      <div className="text-sm">{selectedDonation.donor_info.company_name || 'Не указана'}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Подписка на обновления</Label>
                      <div className="text-sm">
                        {selectedDonation.donor_info.subscribe_updates ? 'Да' : 'Нет'}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium">Сообщение</Label>
                      <div className="text-sm">
                        {selectedDonation.donor_info.message || 'Нет сообщения'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={() => setIsDialogOpen(false)}>Закрыть</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={!!editingDonation} onOpenChange={(open) => !open && setEditingDonation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить статус пожертвования</DialogTitle>
          </DialogHeader>
          {editingDonation && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">ID пожертвования</Label>
                <div className="text-sm font-medium">{editingDonation.id}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Текущий статус</Label>
                <div className="text-sm">{getStatusBadge(editingDonation.status)}</div>
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Новый статус
                </Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ожидание</SelectItem>
                    <SelectItem value="processing">В процессе</SelectItem>
                    <SelectItem value="pending_payment">Ожидает оплату</SelectItem>
                    <SelectItem value="completed">Завершено</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingDonation(null)} className="rounded-full">
                  Отмена
                </Button>
                <Button onClick={updateDonationStatus}>Сохранить</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredDonations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Пожертвования не найдены</p>
        </div>
      )}
    </div>
  )
}
