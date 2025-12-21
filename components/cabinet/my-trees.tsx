"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Download, Share2, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MyTrees() {
  const [trees, setTrees] = useState([
    {
      id: "TREE-2024-001",
      location: "Forest of Central Asia",
      locationShort: "Шортандинский район",
      datePlanted: "15 марта 2024",
      species: "Сосна обыкновенная",
      status: "Растёт",
      statusColor: "emerald",
      image: "/pine-tree-seedling.jpg",
      certificate: true,
    },
    {
      id: "TREE-2024-025",
      location: "Mukhatay Ormany",
      locationShort: "Карагандинская область",
      datePlanted: "22 апреля 2024",
      species: "Берёза повислая",
      status: "Растёт",
      statusColor: "emerald",
      image: "/birch-tree-young.jpg",
      certificate: true,
    },
    {
      id: "TREE-2024-045",
      location: "Forest of Central Asia",
      locationShort: "Шортандинский район",
      datePlanted: "5 мая 2024",
      species: "Ель сибирская",
      status: "Растёт",
      statusColor: "emerald",
      image: "/spruce-tree-sapling.jpg",
      certificate: true,
    },
    {
      id: "TREE-2024-078",
      location: "Mukhatay Ormany",
      locationShort: "Карагандинская область",
      datePlanted: "12 июня 2024",
      species: "Клён остролистный",
      status: "В процессе посадки",
      statusColor: "yellow",
      image: "/maple-tree-planting.jpg",
      certificate: false,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterLocation, setFilterLocation] = useState("all")

  useEffect(() => {
    // In a real app, we would load user's trees from the backend
    // For now, we'll just use the static data
  }, [])

  const filteredTrees = trees.filter((tree) => {
    const matchesSearch =
      tree.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.species.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = filterLocation === "all" || tree.location === filterLocation
    return matchesSearch && matchesLocation
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Мои деревья</h1>
        <p className="text-muted-foreground">Все деревья, которые вы посадили</p>
      </div>

      {/* Filters */}
      <Card className="border-2 rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Поиск по ID или виду дерева..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="md:w-64">
                <SelectValue placeholder="Все локации" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все локации</SelectItem>
                <SelectItem value="Forest of Central Asia">Forest of Central Asia</SelectItem>
                <SelectItem value="Mukhatay Ormany">Mukhatay Ormany</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trees Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrees.map((tree) => (
          <Card key={tree.id} className="border-2 hover:shadow-lg transition-shadow overflow-hidden rounded-2xl">
            <div className="aspect-video bg-muted relative overflow-hidden rounded-t-2xl">
              <img src={tree.image || "/placeholder.svg"} alt={tree.species} className="object-cover w-full h-full" />
              <Badge
                className={`absolute top-2 right-2 ${
                  tree.statusColor === "emerald" ? "bg-emerald-600" : "bg-yellow-600"
                } text-white`}
              >
                {tree.status}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{tree.species}</CardTitle>
              <p className="text-sm text-muted-foreground">ID: {tree.id}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{tree.locationShort}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{tree.datePlanted}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Eye className="h-4 w-4 mr-2" />
                  Фото
                </Button>
                {tree.certificate && (
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Сертификат
                  </Button>
                )}
              </div>

              {tree.certificate && (
                <Button variant="ghost" size="sm" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Поделиться
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Деревья не найдены</p>
        </div>
      )}
    </div>
  )
}
