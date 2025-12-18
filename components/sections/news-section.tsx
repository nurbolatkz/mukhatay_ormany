import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

const newsItems = [
  {
    title: "Завершена весенняя посадка 2024",
    date: "15 мая 2024",
    excerpt: "Успешно высажено 35,000 саженцев в Шортандинском районе. Благодарим всех участников!",
    image: "/community-tree-planting.png",
  },
  {
    title: "Новый партнёр проекта — Казахтелеком",
    date: "3 апреля 2024",
    excerpt: "Крупнейший телеком оператор присоединился к проекту лесовосстановления.",
    image: "/partnership-handshake.png",
  },
  {
    title: "Отчёт за первый квартал 2024",
    date: "28 марта 2024",
    excerpt: "Подведены итоги работы: 12,500 деревьев посажено, выживаемость 94%.",
    image: "/forest-growth-statistics.jpg",
  },
]

export function NewsSection() {
  return (
    <section id="news" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Новости проекта</h2>
          <p className="text-lg text-muted-foreground text-pretty">Актуальная информация о наших достижениях</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {newsItems.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="object-cover w-full h-full" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{item.excerpt}</p>
                <Button variant="link" className="p-0 h-auto">
                  Читать далее →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            Все новости
          </Button>
        </div>
      </div>
    </section>
  )
}
