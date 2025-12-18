import { Building2, Award, TrendingUp, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const benefits = [
  {
    icon: <Building2 className="h-8 w-8 text-emerald-600" />,
    title: "Корпоративные посадки",
    description: "Организуем посадку любого масштаба для вашей компании",
  },
  {
    icon: <Award className="h-8 w-8 text-emerald-600" />,
    title: "Именные участки",
    description: "Ваш именной лес с табличкой и координатами",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-emerald-600" />,
    title: "ESG / CSR отчётность",
    description: "Полная документация для корпоративной отчётности",
  },
  {
    icon: <Users className="h-8 w-8 text-emerald-600" />,
    title: "Совместные инициативы",
    description: "Партнёрские экологические проекты и мероприятия",
  },
]

export function CorporateSection() {
  return (
    <section id="corporate" className="py-20 bg-gradient-to-b from-background to-emerald-50 dark:to-emerald-950/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Для компаний и организаций</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Станьте частью масштабного экологического проекта. Укрепите репутацию и выполните ESG/CSR обязательства
            через реальное лесовосстановление
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="border-2 hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center mb-4">{benefit.icon}</div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-card border-2 rounded-xl p-8 md:p-12 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">Преимущества партнёрства</h3>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-3 w-3 rounded-full bg-emerald-600" />
              </div>
              <span>Реальный вклад в устойчивое развитие и восстановление экосистем</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-3 w-3 rounded-full bg-emerald-600" />
              </div>
              <span>Материалы для ESG/CSR отчётности с фото- и видеодокументацией</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-3 w-3 rounded-full bg-emerald-600" />
              </div>
              <span>Укрепление репутации и демонстрация ответственности</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-3 w-3 rounded-full bg-emerald-600" />
              </div>
              <span>Возможность вовлечения сотрудников в экологические инициативы</span>
            </li>
          </ul>

          <div className="text-center">
            <Link href="/contact?type=corporate">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Стать партнёром проекта
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
