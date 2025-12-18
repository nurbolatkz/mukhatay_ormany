import { Target, Workflow, TrendingUp } from "lucide-react"

export function MissionSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Наша миссия и подход</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Target className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold">Миссия</h3>
              <p className="text-muted-foreground text-pretty">
                Восстановление лесных экосистем Казахстана через прозрачные и устойчивые проекты
              </p>
            </div>

            <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Workflow className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold">Полный цикл</h3>
              <p className="text-muted-foreground text-pretty">
                От выращивания саженцев до многолетнего ухода за взрослыми деревьями
              </p>
            </div>

            <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold">Системность</h3>
              <p className="text-muted-foreground text-pretty">
                Планомерная работа с измеримыми результатами на каждом этапе
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/10 rounded-xl p-8 md:p-12 text-center">
            <p className="text-lg md:text-xl text-foreground leading-relaxed text-pretty">
              Мы не просто сажаем деревья — мы создаём устойчивые лесные экосистемы, которые будут служить природе и
              людям десятилетиями. Каждый проект проходит тщательное планирование, профессиональную реализацию и
              долгосрочное сопровождение.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
