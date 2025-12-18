import { Shield, Leaf, RefreshCw, Camera } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const trustPoints = [
  {
    icon: <Shield className="h-10 w-10 text-emerald-600" />,
    title: "Собственные земли и инфраструктура",
    description: "Мы владеем землёй и инфраструктурой, что гарантирует долгосрочность проекта",
  },
  {
    icon: <Leaf className="h-10 w-10 text-emerald-600" />,
    title: "Реальные посадки, а не «виртуальные деревья»",
    description: "Каждое дерево действительно высаживается нашей командой в Казахстане",
  },
  {
    icon: <RefreshCw className="h-10 w-10 text-emerald-600" />,
    title: "Полный цикл: выращивание → посадка → уход",
    description: "От саженца до взрослого дерева — мы сопровождаем каждый этап",
  },
  {
    icon: <Camera className="h-10 w-10 text-emerald-600" />,
    title: "Фото-, видео- и отчетная прозрачность",
    description: "Регулярные отчёты, фотографии и видео с мест посадки",
  },
]

export function TrustSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Почему нам доверяют</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Прозрачность и реальный результат в каждом проекте
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {trustPoints.map((point, index) => (
            <Card
              key={index}
              className="border-2 hover:shadow-lg transition-shadow animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="mb-4">{point.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
