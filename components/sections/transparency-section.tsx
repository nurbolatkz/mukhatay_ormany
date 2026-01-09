"use client"

import { useState, useEffect } from "react"
import apiService from "@/services/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TransparencyReport {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  date: string;
  views: number;
  location: string;
  description: string;
  full_description?: string;
  content_url?: string; // URL to full content (PDF, video, etc.)
}

const tabs = [
  { id: "photos", label: "Фото", icon: "image" },
  { id: "videos", label: "Видео", icon: "videocam" },
  { id: "reports", label: "Отчеты", icon: "description" },
  { id: "statistics", label: "Статистика", icon: "analytics" },
]

export function TransparencySection() {
  const [activeTab, setActiveTab] = useState("photos")
  const [reports, setReports] = useState<TransparencyReport[]>([])
  const [displayedCount, setDisplayedCount] = useState(6)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<TransparencyReport | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiService.getTransparencyReports()
        setReports(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching transparency reports:', error)
        setIsLoading(false)
      }
    }
    
    fetchReports()
  }, [])
  
  const filteredReports = reports.filter(item => 
    activeTab === "photos" ? item.type === "photo" : 
    activeTab === "videos" ? item.type === "video" : 
    activeTab === "reports" ? item.type === "report" : 
    activeTab === "statistics" ? item.type === "statistics" : true
  )
  
  const displayedReports = filteredReports.slice(0, displayedCount)
  
  const loadMore = () => {
    setDisplayedCount(prev => prev + 6)
  }
  
  const openReportDetail = (report: TransparencyReport) => {
    setSelectedReport(report)
    setIsModalOpen(true)
  }
  
  const closeReportDetail = () => {
    setIsModalOpen(false)
    setSelectedReport(null)
  }
  
  const hasMore = displayedCount < filteredReports.length
  
  if (isLoading) {
    return (
      <section id="transparency" className="py-20 bg-[#f8f9f5]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Прозрачность и <span className="text-primary">отчеты</span></h2>
            <p className="text-lg text-muted-foreground">Смотрите реальные результаты нашей работы</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
              >
                <div className="h-72 bg-gray-200 animate-pulse"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
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
                onClick={() => {
                  setActiveTab(tab.id)
                  setDisplayedCount(6) // Reset display count when switching tabs
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
          {displayedReports.map((item, index) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => openReportDetail(item)}
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
                  {new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-3">
                  <span className="material-symbols-outlined !text-lg mr-1">location_on</span>
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <span className="material-symbols-outlined !text-lg mr-1">visibility</span>
                  <span>{item.views} просмотра</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          {hasMore && (
            <button 
              onClick={loadMore}
              className="bg-primary text-background font-semibold text-lg px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_24px_rgba(244,227,30,0.4)]"
            >
              Показать больше {activeTab === "photos" ? "фото" : activeTab === "videos" ? "видео" : activeTab === "reports" ? "отчетов" : "статистики"} →
            </button>
          )}
        </div>
      </div>
    </section>
    
    <ReportDetailModal 
      isOpen={isModalOpen} 
      onClose={closeReportDetail} 
      report={selectedReport} 
    />
    </>
  )
}

// Separate component for the modal to avoid syntax issues
function ReportDetailModal({ 
  isOpen, 
  onClose, 
  report 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  report: TransparencyReport | null; 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{report?.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {report?.thumbnail && (
            <div className="relative h-80 rounded-xl overflow-hidden">
              <img 
                src={report.thumbnail} 
                alt={report.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Тип:</span>
              <p className="font-medium">
                {report?.type === 'photo' ? 'Фото' : 
                 report?.type === 'video' ? 'Видео' : 
                 report?.type === 'report' ? 'Отчет' : 
                 'Статистика'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Дата:</span>
              <p className="font-medium">
                {report?.date ? new Date(report.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Локация:</span>
              <p className="font-medium">{report?.location}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Просмотры:</span>
              <p className="font-medium">{report?.views} просмотров</p>
            </div>
          </div>
          
          <div>
            <span className="text-muted-foreground">Описание:</span>
            <p className="mt-1">{report?.full_description || report?.description}</p>
          </div>
          
          {report?.content_url && (
            <div className="pt-4">
              <a 
                href={report.content_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Открыть полный контент
                <span className="material-symbols-outlined !text-base">open_in_new</span>
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Export the modal component separately
export { ReportDetailModal };
