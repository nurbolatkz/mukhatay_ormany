"use client"

import { useState } from "react"

const tabs = [
  { id: "photos", label: "Фото", icon: "image" },
  { id: "videos", label: "Видео", icon: "videocam" },
  { id: "reports", label: "Отчеты", icon: "description" },
  { id: "statistics", label: "Статистика", icon: "analytics" },
]

const galleryItems = [
  { id: 1, type: "photo", title: "Посадка в питомнике", date: "15.03.2024", thumbnail: "/Посадка в питомнике.png" },
  { id: 2, type: "video", title: "Процесс посадки", date: "10.03.2024", thumbnail: "/Процесс посадки.jpg" },
  { id: 3, type: "report", title: "Ежегодный отчет 2023", date: "01.01.2024", thumbnail: "/Ежегодный отчет 2023.jpg" },
  { id: 4, type: "photo", title: "Уход за саженцами", date: "05.04.2024", thumbnail: "/Уход за саженцами.png" },
  { id: 5, type: "video", title: "Интервью с волонтером", date: "20.02.2024", thumbnail: "/Интервью с волонтером.jpg" },
  { id: 6, type: "statistics", title: "Статистика 2023", date: "15.01.2024", thumbnail: "/Статистика 2023.jpg" },
]

export function TransparencySection() {
  const [activeTab, setActiveTab] = useState("photos")

  return (
    <section id="transparency" className="py-20 bg-[#f8f9f5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Прозрачность и <span className="text-primary">отчеты</span></h2>
          <p className="text-lg text-muted-foreground">Смотрите реальные результаты нашей работы</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-12 border-b-2 border-[#e8ebe7]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`pb-4 text-lg font-medium transition-all duration-300 ${activeTab === tab.id ? 'text-foreground font-semibold border-b-4 border-primary pb-3' : 'text-[#8a9189] hover:text-[#2d5a45] hover:border-b-4 hover:border-[rgba(244,227,30,0.5)]'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
          {galleryItems
            .filter(item => activeTab === "photos" ? item.type === "photo" : 
                         activeTab === "videos" ? item.type === "video" : 
                         activeTab === "reports" ? item.type === "report" : 
                         activeTab === "statistics" ? item.type === "statistics" : true)
            .slice(0, 9)
            .map((item, index) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Category badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${item.type === 'photo' ? 'bg-green-600' : item.type === 'video' ? 'bg-blue-600' : item.type === 'report' ? 'bg-yellow-500' : 'bg-purple-600'}`}>
                    {item.type === 'photo' ? 'Фото' : item.type === 'video' ? 'Видео' : item.type === 'report' ? 'Отчет' : 'Статистика'}
                  </div>
                  
                  {/* Date badge */}
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {item.date}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-3">
                    <span className="material-symbols-outlined !text-lg mr-1">location_on</span>
                    <span>Казахстан</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <span className="material-symbols-outlined !text-lg mr-1">visibility</span>
                    <span>234 просмотра</span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <button className="bg-primary text-background font-semibold text-lg px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_24px_rgba(244,227,30,0.4)]">
            Показать больше фото →
          </button>
        </div>
      </div>
    </section>
  )
}
