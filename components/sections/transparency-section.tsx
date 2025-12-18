"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Video, FileText, TrendingUp } from "lucide-react"

export function TransparencySection() {
  return (
    <section id="transparency" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Прозрачность и отчётность</h2>
          <p className="text-lg text-muted-foreground text-pretty">Мы открыто делимся результатами нашей работы</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <ImageIcon className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Фотогалерея</h3>
              <p className="text-sm text-muted-foreground mb-4">Фотографии с мест посадки</p>
              <Button variant="outline" size="sm">
                Смотреть
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Video className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Видеоотчёты</h3>
              <p className="text-sm text-muted-foreground mb-4">Видео процесса работы</p>
              <Button variant="outline" size="sm">
                Смотреть
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <FileText className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Сезонные отчёты</h3>
              <p className="text-sm text-muted-foreground mb-4">Подробные отчёты по сезонам</p>
              <Button variant="outline" size="sm">
                Читать
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Статистика</h3>
              <p className="text-sm text-muted-foreground mb-4">Цифры и показатели проекта</p>
              <Button variant="outline" size="sm">
                Смотреть
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-muted rounded-xl p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-6 text-center">Будущие планы работ</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Весна 2024</h4>
                  <p className="text-sm text-muted-foreground">Посадка 50,000 саженцев в Карагандинской области</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Лето 2024</h4>
                  <p className="text-sm text-muted-foreground">Расширение питомника и выращивание новых сортов</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Осень 2024</h4>
                  <p className="text-sm text-muted-foreground">Начало работ на новых участках лесовосстановления</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
