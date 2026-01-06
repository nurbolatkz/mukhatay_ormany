"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import apiService from "@/services/api";
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  author: string;
  created_at: string;
  updated_at?: string;
  published: boolean;
  category: string;
}

export function NewsManagement() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNews, setCurrentNews] = useState<Partial<NewsItem> | null>({
    title: "",
    content: "",
    image_url: "",
    author: "",
    published: true,
    category: "general"
  });

  // Fetch news items
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await apiService.adminGetAllNews();
        setNewsItems(data);
        setFilteredNews(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter news based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredNews(newsItems);
    } else {
      const filtered = newsItems.filter(
        (news) =>
          news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNews(filtered);
    }
  }, [searchTerm, newsItems]);

  const handleCreateNews = () => {
    setCurrentNews({
      title: "",
      content: "",
      image_url: "",
      author: "",
      published: true,
      category: "general"
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditNews = (news: NewsItem) => {
    setCurrentNews(news);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteNews = async (newsId: string) => {
    if (window.confirm("Вы уверены, что хотите удалить эту новость?")) {
      try {
        await apiService.adminDeleteNews(newsId);
        setNewsItems(newsItems.filter(news => news.id !== newsId));
        setFilteredNews(filteredNews.filter(news => news.id !== newsId));
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  const handleSaveNews = async () => {
    if (!currentNews || !currentNews.title || !currentNews.content) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    try {
      if (isEditing && currentNews.id) {
        // Update existing news
        await apiService.adminUpdateNews(currentNews.id, currentNews);
        setNewsItems(
          newsItems.map((news) =>
            news.id === currentNews.id ? { ...currentNews } as NewsItem : news
          )
        );
      } else {
        // Create new news
        const response = await apiService.adminCreateNews(currentNews);
        const newNews = {
          ...currentNews,
          id: response.id,
          created_at: new Date().toISOString()
        } as NewsItem;
        setNewsItems([newNews, ...newsItems]);
      }

      setIsDialogOpen(false);
      setCurrentNews({
        title: "",
        content: "",
        image_url: "",
        author: "",
        published: true,
        category: "general"
      });
    } catch (error) {
      console.error("Error saving news:", error);
      alert("Ошибка при сохранении новости");
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Управление новостями</h1>
        <p className="text-muted-foreground">Создание, редактирование и удаление новостей</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Поиск новостей..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleCreateNews}>
          <Plus className="h-4 w-4 mr-2" />
          Создать новость
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((news) => (
            <Card key={news.id} className="border-2 rounded-2xl overflow-hidden">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {news.image_url ? (
                  <img
                    src={news.image_url}
                    alt={news.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-500">Изображение отсутствует</span>
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
                  <Badge variant={news.published ? "default" : "secondary"} className="ml-2">
                    {news.published ? "Опубликовано" : "Черновик"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {news.content.substring(0, 120)}{news.content.length > 120 ? '...' : ''}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{news.author}</span>
                  <span>{formatDate(news.created_at)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{news.category}</Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditNews(news)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteNews(news.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* News Creation/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Редактировать новость" : "Создать новую новость"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Заголовок *</Label>
              <Input
                id="title"
                value={currentNews?.title || ""}
                onChange={(e) =>
                  setCurrentNews({ ...currentNews, title: e.target.value })
                }
                placeholder="Введите заголовок новости"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Содержание *</Label>
              <Textarea
                id="content"
                value={currentNews?.content || ""}
                onChange={(e) =>
                  setCurrentNews({ ...currentNews, content: e.target.value })
                }
                placeholder="Введите содержание новости"
                rows={6}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Автор</Label>
                <Input
                  id="author"
                  value={currentNews?.author || ""}
                  onChange={(e) =>
                    setCurrentNews({ ...currentNews, author: e.target.value })
                  }
                  placeholder="Автор новости"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Input
                  id="category"
                  value={currentNews?.category || ""}
                  onChange={(e) =>
                    setCurrentNews({ ...currentNews, category: e.target.value })
                  }
                  placeholder="Категория новости"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image_url">URL изображения</Label>
              <Input
                id="image_url"
                value={currentNews?.image_url || ""}
                onChange={(e) =>
                  setCurrentNews({ ...currentNews, image_url: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="published"
                checked={currentNews?.published || false}
                onCheckedChange={(checked) =>
                  setCurrentNews({ ...currentNews, published: checked as boolean })
                }
              />
              <Label htmlFor="published">Опубликовать новость</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveNews}>
              {isEditing ? "Сохранить изменения" : "Создать новость"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}