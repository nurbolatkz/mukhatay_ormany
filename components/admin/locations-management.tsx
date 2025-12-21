"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Edit, Trash2, Plus } from "lucide-react"
import apiService from "@/services/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Location {
  id: string
  name: string
  description: string
  area_hectares: number
  capacity_trees: number
  planted_trees: number
  coordinates: string
  status: string
  image_url: string
}

interface LocationFormData {
  name: string
  description: string
  area_hectares: number | string
  capacity_trees: number | string
  planted_trees: number | string
  coordinates: string
  image_url: string
  status: string
}

interface ImageUploadData {
  file: File | null
  previewUrl: string | null
  uploading: boolean
}

export function LocationsManagement() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState<LocationFormData>({
    name: "",
    description: "",
    area_hectares: "",
    capacity_trees: "",
    planted_trees: "",
    coordinates: "",
    image_url: "",
    status: "active",
  })
  const [imageUpload, setImageUpload] = useState<ImageUploadData>({
    file: null,
    previewUrl: null,
    uploading: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      setLoading(true)
      const locationsData = await apiService.adminGetLocations()
      setLocations(locationsData)
    } catch (err) {
      console.error('Error fetching locations:', err)
      setError('Failed to load locations')
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список локаций",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLocation = async () => {
    try {
      // Convert string values to numbers
      const locationData = {
        ...formData,
        area_hectares: Number(formData.area_hectares),
        capacity_trees: Number(formData.capacity_trees),
        planted_trees: Number(formData.planted_trees),
      }
      
      await apiService.adminCreateLocation(locationData)
      toast({
        title: "Успех",
        description: "Локация успешно создана",
      })
      setIsDialogOpen(false)
      setFormData({
        name: "",
        description: "",
        area_hectares: "",
        capacity_trees: "",
        planted_trees: "",
        coordinates: "",
        image_url: "",
        status: "active",
      })
      
      // Reset image upload state
      setImageUpload({
        file: null,
        previewUrl: null,
        uploading: false,
      })
      
      fetchLocations()
    } catch (err) {
      console.error('Error creating location:', err)
      toast({
        title: "Ошибка",
        description: "Не удалось создать локацию",
        variant: "destructive",
      })
    }
  }

  const handleUpdateLocation = async () => {
    if (!editingLocation) return
    try {
      // Convert string values to numbers
      const locationData = {
        ...formData,
        area_hectares: Number(formData.area_hectares),
        capacity_trees: Number(formData.capacity_trees),
        planted_trees: Number(formData.planted_trees),
      }
      
      await apiService.adminUpdateLocation(editingLocation.id, locationData)
      toast({
        title: "Успех",
        description: "Локация успешно обновлена",
      })
      setIsDialogOpen(false)
      setEditingLocation(null)
      setFormData({
        name: "",
        description: "",
        area_hectares: "",
        capacity_trees: "",
        planted_trees: "",
        coordinates: "",
        image_url: "",
        status: "active",
      })
      
      // Reset image upload state
      setImageUpload({
        file: null,
        previewUrl: null,
        uploading: false,
      })
      
      fetchLocations()
    } catch (err) {
      console.error('Error updating location:', err)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить локацию",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLocation = async (locationId: string) => {
    try {
      await apiService.adminDeleteLocation(locationId)
      toast({
        title: "Успех",
        description: "Локация успешно удалена",
      })
      fetchLocations()
    } catch (err) {
      console.error('Error deleting location:', err)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить локацию",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (location: Location) => {
    setEditingLocation(location)
    setFormData({
      name: location.name,
      description: location.description,
      area_hectares: location.area_hectares.toString(),
      capacity_trees: location.capacity_trees.toString(),
      planted_trees: location.planted_trees.toString(),
      coordinates: location.coordinates,
      image_url: location.image_url,
      status: location.status,
    })
    
    // Reset image upload state
    setImageUpload({
      file: null,
      previewUrl: location.image_url || null,
      uploading: false,
    })
    
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingLocation(null)
    setFormData({
      name: "",
      description: "",
      area_hectares: "",
      capacity_trees: "",
      planted_trees: "",
      coordinates: "",
      image_url: "",
      status: "active",
    })
    
    // Reset image upload state
    setImageUpload({
      file: null,
      previewUrl: null,
      uploading: false,
    })
    
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    // In a real implementation, if we have a new image file, we would:
    // 1. Upload the image to a storage service (e.g., AWS S3, Cloudinary)
    // 2. Get the public URL of the uploaded image
    // 3. Set formData.image_url to that URL before saving
    // For now, we'll just use the image_url directly
    if (editingLocation) {
      handleUpdateLocation()
    } else {
      handleCreateLocation()
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImageUpload({
        file,
        previewUrl,
        uploading: false,
      })
      
      // Update form data with preview URL
      setFormData({
        ...formData,
        image_url: previewUrl,
      })
    }
  }

  const handleRemoveImage = () => {
    // Revoke the preview URL to free memory
    if (imageUpload.previewUrl) {
      URL.revokeObjectURL(imageUpload.previewUrl)
    }
    
    setImageUpload({
      file: null,
      previewUrl: null,
      uploading: false,
    })
    
    // Clear image URL in form data
    setFormData({
      ...formData,
      image_url: "",
    })
  }

  const formatArea = (hectares: number) => {
    if (hectares >= 1000) {
      return `${(hectares / 1000).toFixed(1)} тыс. га`
    }
    return `${hectares} га`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Управление локациями</h1>
          <p className="text-muted-foreground">Добавление и редактирование мест посадки</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full" onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить локацию
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg w-[90vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? "Редактировать локацию" : "Добавить новую локацию"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Название</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Статус</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Активна</SelectItem>
                      <SelectItem value="inactive">Неактивна</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="area_hectares">Площадь (га)</Label>
                  <Input
                    id="area_hectares"
                    type="number"
                    value={formData.area_hectares}
                    onChange={(e) => setFormData({...formData, area_hectares: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="capacity_trees">Вместимость (деревья)</Label>
                  <Input
                    id="capacity_trees"
                    type="number"
                    value={formData.capacity_trees}
                    onChange={(e) => setFormData({...formData, capacity_trees: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="planted_trees">Посажено деревьев</Label>
                  <Input
                    id="planted_trees"
                    type="number"
                    value={formData.planted_trees}
                    onChange={(e) => setFormData({...formData, planted_trees: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="coordinates">Координаты</Label>
                <Input
                  id="coordinates"
                  value={formData.coordinates}
                  onChange={(e) => setFormData({...formData, coordinates: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Изображение</Label>
                <div className="space-y-4">
                  {/* Image Preview */}
                  {(imageUpload.previewUrl || formData.image_url) && (
                    <div className="relative">
                      <img
                        src={imageUpload.previewUrl || formData.image_url}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        Удалить
                      </Button>
                    </div>
                  )}
                  
                  {/* File Upload */}
                  <div className="space-y-2">
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                      />
                    </div>
                    <div className="text-center text-sm text-muted-foreground">или</div>
                    <div>
                      <Input
                        placeholder="Вставить URL изображения"
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Поддерживаются форматы JPG, PNG, GIF. Максимальный размер 5MB.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="rounded-full" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button className="rounded-full" onClick={handleSubmit}>
                  {editingLocation ? "Сохранить" : "Создать"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Stats Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{locations.length}</div>
            <p className="text-sm text-muted-foreground">Всего локаций</p>
          </CardContent>
        </Card>
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">
              {locations.filter(loc => loc.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Активных</p>
          </CardContent>
        </Card>
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {locations.reduce((sum, loc) => sum + loc.planted_trees, 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Посажено деревьев</p>
          </CardContent>
        </Card>
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">
              {locations.reduce((sum, loc) => sum + loc.area_hectares, 0).toLocaleString()} га
            </div>
            <p className="text-sm text-muted-foreground">Общая площадь</p>
          </CardContent>
        </Card>
      </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Название</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="area_hectares">Площадь (га)</Label>
                  <Input
                    id="area_hectares"
                    type="number"
                    value={formData.area_hectares}
                    onChange={(e) => setFormData({...formData, area_hectares: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="capacity_trees">Вместимость (деревья)</Label>
                  <Input
                    id="capacity_trees"
                    type="number"
                    value={formData.capacity_trees}
                    onChange={(e) => setFormData({...formData, capacity_trees: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="planted_trees">Посажено деревьев</Label>
                  <Input
                    id="planted_trees"
                    type="number"
                    value={formData.planted_trees}
                    onChange={(e) => setFormData({...formData, planted_trees: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="coordinates">Координаты</Label>
                  <Input
                    id="coordinates"
                    value={formData.coordinates}
                    onChange={(e) => setFormData({...formData, coordinates: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Изображение</Label>
                <div className="space-y-4">
                  {/* Image Preview */}
                  {(imageUpload.previewUrl || formData.image_url) && (
                    <div className="relative">
                      <img
                        src={imageUpload.previewUrl || formData.image_url}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        Удалить
                      </Button>
                    </div>
                  )}
                  
                  {/* File Upload */}
                  <div className="space-y-2">
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                      />
                    </div>
                    <div className="text-center text-sm text-muted-foreground">или</div>
                    <div>
                      <Input
                        placeholder="Вставить URL изображения"
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Поддерживаются форматы JPG, PNG, GIF. Максимальный размер 5MB.
                  </p>
                </div>
              </div>
              <div className="max-w-xs">
                <Label htmlFor="status">Статус</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активна</SelectItem>
                    <SelectItem value="inactive">Неактивна</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="rounded-full" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button className="rounded-full" onClick={handleSubmit}>
                  {editingLocation ? "Сохранить" : "Создать"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      {loading ? (
        <div className="p-8 text-center">
          <p>Загрузка локаций...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">
          <p>{error}</p>
          <Button onClick={fetchLocations} className="mt-4 rounded-full">Повторить попытку</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {locations.map((location) => (
            <Card key={location.id} className="border-2 overflow-hidden rounded-2xl hover:shadow-lg transition-shadow">
              <div className="h-32 bg-muted relative overflow-hidden">
                <img
                  src={location.image_url || "/placeholder.svg"}
                  alt={location.name}
                  className="object-cover w-full h-full"
                />
                <Badge className="absolute top-2 right-2 bg-emerald-600 text-white text-xs">
                  {location.status === "active" ? "Активна" : "Неактивна"}
                </Badge>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>{location.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">{location.id.substring(0, 8)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                <p className="text-muted-foreground">{location.description}</p>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xl font-bold text-emerald-600">{formatArea(location.area_hectares)}</div>
                    <p className="text-sm text-muted-foreground">Площадь</p>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-emerald-600">{location.planted_trees.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Посажено деревьев</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Заполненность:</span>
                    <span className="font-medium">{Math.round((location.planted_trees / location.capacity_trees) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${(location.planted_trees / location.capacity_trees) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {location.planted_trees.toLocaleString()} из {location.capacity_trees.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{location.coordinates}</span>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1 rounded-full" onClick={() => openEditDialog(location)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Редактировать
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 rounded-full" onClick={() => handleDeleteLocation(location.id)}>
                    <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                    Удалить
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    </div>
  )
}
