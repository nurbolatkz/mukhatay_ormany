"use client";

import { useState, useEffect } from "react";
import { NewsDetailModal } from "@/components/sections/news-detail-modal";
import apiService from "@/services/api";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TreePine, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

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

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

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

  // Pagination logic
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNews = newsItems.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9f5] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Новости проекта</h1>
            <p className="text-lg text-foreground/70">Последние обновления и события</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9f5] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Новости проекта</h1>
          <p className="text-lg text-foreground/70">Последние обновления и события</p>
        </div>

        {paginatedNews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedNews.map((item, index) => {
                const formattedDate = item.created_at 
                  ? format(new Date(item.created_at), 'dd MMMM yyyy', { locale: ru })
                  : '';

                return (
                  <Card 
                    key={item.id}
                    className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                    onClick={() => openNewsDetail(item)}
                  >
                    <div className="h-48 overflow-hidden">
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
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {item.category}
                        </span>
                        <div className="flex items-center text-sm text-foreground/60">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formattedDate}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">{item.title}</h3>
                      <p className="text-foreground/70 mb-4 line-clamp-3">
                        {item.content.substring(0, 150)}{item.content.length > 150 ? '...' : ''}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground/60">Автор: {item.author}</span>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          Читать далее
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="outline"
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-foreground/70">
                Страница {currentPage + 1} из {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <TreePine className="h-16 w-16 text-primary/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Новостей пока нет</h3>
            <p className="text-foreground/60">Следите за обновлениями проекта</p>
          </div>
        )}
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <NewsDetailModal
          newsItem={selectedNews}
          isOpen={!!selectedNews}
          onClose={closeNewsDetail}
        />
      )}
    </div>
  );
}