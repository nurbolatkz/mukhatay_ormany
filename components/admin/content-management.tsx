"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video, Upload, Plus, Edit, Trash2 } from "lucide-react"

const photos = [
  { id: "PH-001", title: "Весенняя посадка 2024", date: "15 мая 2024", image: "/spring-planting-2024.jpg" },
  { id: "PH-002", title: "Питомник в Шортанды", date: "3 апр 2024", image: "/nursery-shortandy.jpg" },
  { id: "PH-003", title: "Карагандинская область", date: "28 мар 2024", image: "/karaganda-forest.jpg" },
]

const videos = [
  { id: "VID-001", title: "Процесс посадки деревьев", date: "10 июн 2024", duration: "3:45" },
  { id: "VID-002", title: "Экскурсия по питомнику", date: "5 май 2024", duration: "5:12" },
]

const news = [
  {
    id: "NEWS-001",
    title: "Завершена весенняя посадка 2024",
    excerpt: "Успешно высажено 35,000 саженцев...",
    date: "15 мая 2024",
    status: "published",
  },
  {
    id: "NEWS-002",
    title: "Новый партнёр проекта — Казахтелеком",
    excerpt: "Крупнейший телеком оператор...",
    date: "3 апр 2024",
    status: "published",
  },
  {
    id: "NEWS-003",
    title: "Отчёт за первый квартал 2024",
    excerpt: "Подведены итоги работы...",
    date: "28 мар 2024",
    status: "draft",
  },
]

export function ContentManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Управление контентом</h1>
        <p className="text-muted-foreground">Редактирование фото, видео и новостей</p>
      </div>

      <Tabs defaultValue="photos">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="photos">Фото</TabsTrigger>
          <TabsTrigger value="videos">Видео</TabsTrigger>
          <TabsTrigger value="news">Новости</TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-6">
          <div className="flex justify-end">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Загрузить фото
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} className="border-2 overflow-hidden rounded-2xl">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img
                    src={photo.image || "/placeholder.svg"}
                    alt={photo.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold">{photo.title}</h3>
                    <p className="text-sm text-muted-foreground">{photo.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4 mr-2" />
                      Изменить
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div className="flex justify-end">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Загрузить видео
            </Button>
          </div>

          <div className="space-y-4">
            {videos.map((video) => (
              <Card key={video.id} className="border-2 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{video.title}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{video.date}</span>
                        <span>Длительность: {video.duration}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Изменить
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <div className="flex justify-end">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Создать новость
            </Button>
          </div>

          <div className="space-y-4">
            {news.map((article) => (
              <Card key={article.id} className="border-2 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{article.title}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            article.status === "published"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {article.status === "published" ? "Опубликовано" : "Черновик"}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-2">{article.excerpt}</p>
                      <p className="text-sm text-muted-foreground">{article.date}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Изменить
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
