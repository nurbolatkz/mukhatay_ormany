const trustPoints = [
  {
    icon: "map",
    title: "Собственные земли и инфраструктура",
    description: "Мы владеем землёй и инфраструктурой, что гарантирует долгосрочность проекта",
  },
  {
    icon: "photo_camera",
    title: "Реальные посадки, а не «виртуальные деревья»",
    description: "Каждое дерево действительно высаживается нашей командой в Казахстане",
  },
  {
    icon: "autorenew",
    title: "Полный цикл: выращивание → посадка → уход",
    description: "От саженца до взрослого дерева — мы сопровождаем каждый этап",
  },
  {
    icon: "visibility",
    title: "Фото-, видео- и отчетная прозрачность",
    description: "Регулярные отчёты, фотографии и видео с мест посадки",
  },
]

export function TrustSection() {
  return (
    <section className="py-20 bg-[#f8f9f5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Почему нам можно <span className="text-primary">доверять</span></h2>
          <p className="text-lg text-muted-foreground">Прозрачность на каждом этапе</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className="bg-white p-12 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-l-0 hover:border-l-4 border-primary"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary !text-3xl">{point.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">{point.title}</h3>
              <p className="text-base text-muted-foreground leading-[1.6]">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
