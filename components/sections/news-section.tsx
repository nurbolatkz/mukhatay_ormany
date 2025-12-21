const newsItems = [
  {
    title: "Завершена весенняя посадка 2024",
    date: "15 мая 2024",
    excerpt: "Успешно высажено 35,000 саженцев в Шортандинском районе. Благодарим всех участников!",
    image: "/Завершена весенняя посадка 2024.jpg",
    category: "Посадка",
    categoryClass: "bg-yellow-500",
  },
  {
    title: "Новый партнёр проекта — Казахтелеком",
    date: "3 апреля 2024",
    excerpt: "Крупнейший телеком оператор присоединился к проекту лесовосстановления.",
    image: "/Новый партнёр проекта — Казахтелеком.jpg",
    category: "Партнерство",
    categoryClass: "bg-green-500",
  },
  {
    title: "Отчёт за первый квартал 2024",
    date: "28 марта 2024",
    excerpt: "Подведены итоги работы: 12,500 деревьев посажено, выживаемость 94%.",
    image: "/Отчёт за первый квартал 2024.jpg",
    category: "Отчет",
    categoryClass: "bg-blue-500",
  },
  {
    title: "Новые технологии полива в питомнике",
    date: "12 апреля 2024",
    excerpt: "Внедрены автоматизированные системы капельного полива для повышения эффективности.",
    image: "/Процесс посадки.jpg",
    category: "Посадка",
    categoryClass: "bg-yellow-500",
  },
  {
    title: "Международная награда за устойчивость",
    date: "5 апреля 2024",
    excerpt: "Проект получил признание на международном экологическом форуме за вклад в борьбу с опустыниванием.",
    image: "/Ежегодный отчет 2023.jpg",
    category: "Отчет",
    categoryClass: "bg-blue-500",
  },
]

export function NewsSection() {
  return (
    <section id="news" className="py-24 bg-[#f8f9f5]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Новости <span className="text-primary">проекта</span></h2>
          <a href="#" className="text-[#2d5a45] font-semibold text-lg flex items-center gap-2 hover:gap-3 transition-all duration-300 hover:text-primary">
            Все новости
            <span className="material-symbols-outlined !text-xl">arrow_forward</span>
          </a>
        </div>

        {/* Card Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {newsItems.slice(0, 3).map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] cursor-pointer"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Image with 16:9 ratio */}
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Category badge */}
                  <div className={`absolute top-4 left-4 px-4 py-2 rounded-2xl text-xs font-bold text-white uppercase tracking-[0.5px] shadow-[0_2px_8px_rgba(0,0,0,0.2)] ${item.category === 'Посадка' ? 'bg-green-500' : item.category === 'Партнерство' ? 'bg-blue-500' : item.category === 'Отчет' ? 'bg-orange-500' : 'bg-purple-500'}`}>
                    {item.category}
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-6">
                  {/* Date */}
                  <div className="flex items-center text-sm text-[#8a9189] mb-3">
                    <span className="material-symbols-outlined !text-lg mr-2">calendar_today</span>
                    {item.date}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-[1.3] line-clamp-2">{item.title}</h3>
                  
                  {/* Excerpt */}
                  <p className="text-base text-[#6b7280] mb-5 leading-[1.6] line-clamp-3">{item.excerpt}</p>
                  
                  {/* Read more link */}
                  <a href="#" className="text-[#2d5a45] font-semibold flex items-center gap-2 hover:gap-3 transition-all duration-300 hover:text-primary">
                    Читать полностью
                    <span className="material-symbols-outlined !text-xl">arrow_forward</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation: Dots below */}
          <div className="flex justify-center space-x-2 mb-12">
            {[1, 2, 3].map((dot) => (
              <button 
                key={dot}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${dot === 1 ? 'bg-primary w-8 rounded-md' : 'bg-[#e8ebe7] hover:bg-[rgba(244,227,30,0.5)] hover:scale-125'}`}
              ></button>
            ))}
          </div>

          {/* Navigation: Prev/Next arrows */}
          <div className="flex justify-center gap-4">
            <button className="w-14 h-14 rounded-full bg-white border-2 border-[#e8ebe7] shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-primary hover:border-primary hover:text-background transition-all duration-300 hover:scale-110">
              <span className="material-symbols-outlined !text-2xl">arrow_back</span>
            </button>
            <button className="w-14 h-14 rounded-full bg-white border-2 border-[#e8ebe7] shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-primary hover:border-primary hover:text-background transition-all duration-300 hover:scale-110">
              <span className="material-symbols-outlined !text-2xl">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
