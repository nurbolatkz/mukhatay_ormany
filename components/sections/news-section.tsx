"use client";

import { useState, useEffect } from "react";
import { NewsDetailModal } from "./news-detail-modal";
import apiService from "@/services/api";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  author: string;
  created_at: string;
  updated_at?: string;
  category: string;
}

export function NewsSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await apiService.getNews();
        setNewsItems(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, []);
  
  const openNewsDetail = (news: NewsItem) => {
    setSelectedNews(news);
  };
  
  const closeNewsDetail = () => {
    setSelectedNews(null);
  };
  
  if (isLoading) {
    return (
      <section id="news" className="py-24 bg-[#f8f9f5]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Новости <span className="text-primary">проекта</span></h2>
            <a href="#" className="text-[#2d5a45] font-semibold text-lg flex items-center gap-2 hover:gap-3 transition-all duration-300 hover:text-primary">
              Все новости
              <span className="material-symbols-outlined !text-xl">arrow_forward</span>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((item) => (
              <div 
                key={item}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
              >
                <div className="h-72 bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="news" className="py-24 bg-[#f8f9f5]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Новости <span className="text-primary">проекта</span></h2>
          <a href="/news" className="text-[#2d5a45] font-semibold text-lg flex items-center gap-2 hover:gap-3 transition-all duration-300 hover:text-primary">
            Все новости
            <span className="material-symbols-outlined !text-xl">arrow_forward</span>
          </a>
        </div>

        {/* Card Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {newsItems.slice(0, 3).map((item, index) => {
              // Format the date
              const formattedDate = item.created_at 
                ? format(new Date(item.created_at), 'dd MMMM yyyy', { locale: ru })
                : '';
              
              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] cursor-pointer"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => openNewsDetail(item)}
                >
                  {/* Image with 16:9 ratio */}
                  <div className="h-72 overflow-hidden relative">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Изображение отсутствует</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4 px-4 py-2 rounded-2xl text-xs font-bold text-white uppercase tracking-[0.5px] shadow-[0_2px_8px_rgba(0,0,0,0.2)] bg-primary">
                      {item.category}
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6">
                    {/* Date */}
                    <div className="flex items-center text-sm text-[#8a9189] mb-3">
                      <span className="material-symbols-outlined !text-lg mr-2">calendar_today</span>
                      {formattedDate}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground mb-3 leading-[1.3] line-clamp-2">{item.title}</h3>
                    
                    {/* Excerpt */}
                    <p className="text-base text-[#6b7280] mb-5 leading-[1.6] line-clamp-3">{item.content.substring(0, 100)}{item.content.length > 100 ? '...' : ''}</p>
                    
                    {/* Read more link */}
                    <div className="text-[#2d5a45] font-semibold flex items-center gap-2 hover:gap-3 transition-all duration-300 hover:text-primary cursor-pointer" onClick={() => openNewsDetail(item)}>
                      Читать полностью
                      <span className="material-symbols-outlined !text-xl">arrow_forward</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation: Dots below */}
          <div className="flex justify-center space-x-2 mb-12">
            {[1, 2, 3].map((dot) => (
              <button 
                key={dot}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${dot === 1 ? 'bg-primary w-8 rounded-md' : 'bg-[#e8ebe7] hover:bg-[rgba(244,227,30,0.5)] hover:scale-125'}`}
                onClick={() => {
                  // Implement carousel navigation if needed
                }}
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
      
      {/* News Detail Modal */}
      {selectedNews && (
        <NewsDetailModal
          newsItem={selectedNews}
          isOpen={!!selectedNews}
          onClose={closeNewsDetail}
        />
      )}
    </section>
  )
}
