"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Mail, Ban, Search, Download, Plus, Edit, Trash2 } from "lucide-react"
import apiService from "@/services/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  phone: string
  company_name: string
  donations_count: number
  trees_planted: number
  total_amount: number
  status: string
  joined_date: string
  role: string
}

interface UserFormData {
  full_name: string
  email: string
  phone: string
  company_name: string
  role: string
  password?: string
}

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    role: "user",
    password: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [users, searchQuery])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const usersData = await apiService.adminGetUsers()
      setUsers(usersData)
      setFilteredUsers(usersData)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users')
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список пользователей",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    try {
      await apiService.adminCreateUser(formData)
      toast({
        title: "Успех",
        description: "Пользователь успешно создан",
      })
      setIsDialogOpen(false)
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        company_name: "",
        role: "user",
        password: "",
      })
      fetchUsers()
    } catch (err) {
      console.error('Error creating user:', err)
      toast({
        title: "Ошибка",
        description: "Не удалось создать пользователя",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return
    try {
      // Remove password field if it's empty when updating
      const updateData = { ...formData }
      if (!updateData.password) {
        delete updateData.password
      }
      
      await apiService.adminUpdateUser(editingUser.id, updateData)
      toast({
        title: "Успех",
        description: "Пользователь успешно обновлен",
      })
      setIsDialogOpen(false)
      setEditingUser(null)
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        company_name: "",
        role: "user",
        password: "",
      })
      fetchUsers()
    } catch (err) {
      console.error('Error updating user:', err)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить пользователя",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await apiService.adminDeleteUser(userId)
      toast({
        title: "Успех",
        description: "Пользователь успешно удален",
      })
      fetchUsers()
    } catch (err) {
      console.error('Error deleting user:', err)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пользователя",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFormData({
      full_name: user.name,
      email: user.email,
      phone: user.phone || "",
      company_name: user.company_name || "",
      role: user.role || "user",
      password: "", // Don't prefill password for security
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingUser(null)
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      company_name: "",
      role: "user",
      password: "",
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (editingUser) {
      handleUpdateUser()
    } else {
      handleCreateUser()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Управление пользователями</h1>
          <p className="text-muted-foreground">Просмотр и управление пользователями платформы</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                type="button"
                className="rounded-full"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  openCreateDialog(e)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить пользователя
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? "Редактировать пользователя" : "Добавить нового пользователя"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Полное имя</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                {!editingUser && (
                  <div>
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password || ""}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="company_name">Название компании</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Роль</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Пользователь</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingUser ? "Сохранить" : "Создать"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{users.length}</div>
            <p className="text-sm text-muted-foreground">Всего пользователей</p>
          </CardContent>
        </Card>
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.donations_count > 0).length}
            </div>
            <p className="text-sm text-muted-foreground">Активных доноров</p>
          </CardContent>
        </Card>
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.total_amount > 500000).length}
            </div>
            <p className="text-sm text-muted-foreground">Корпоративных</p>
          </CardContent>
        </Card>
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {users.filter(u => new Date(u.joined_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </div>
            <p className="text-sm text-muted-foreground">Новых за месяц</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени, email или ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-2">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <p>Загрузка пользователей...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <p>{error}</p>
                <Button onClick={fetchUsers} className="mt-4">Повторить попытку</Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Пожертвования</TableHead>
                    <TableHead>Деревья</TableHead>
                    <TableHead>Общая сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id.substring(0, 8)}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>{user.donations_count}</TableCell>
                      <TableCell className="font-semibold">{user.trees_planted}</TableCell>
                      <TableCell className="font-semibold">{user.total_amount.toLocaleString()} ₸</TableCell>
                      <TableCell>
                        <Badge className={user.role === 'admin' ? 'bg-purple-600' : 'bg-emerald-600'}>
                          {user.role === 'admin' ? 'Админ' : 'Активен'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(user.joined_date)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
