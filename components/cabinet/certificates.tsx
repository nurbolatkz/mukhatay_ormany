"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, Award } from "lucide-react"
import apiService from "@/services/api"

interface Certificate {
  id: string;
  donation_id: string;
  trees: number;
  location: string;
  date: string; // ISO string format
  pdf_url: string;
}

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const data = await apiService.getUserCertificates();
        setCertificates(data);
      } catch (err) {
        console.error('Error fetching certificates:', err);
        setError('Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCertificates();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка сертификатов...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <p className="text-muted-foreground mt-2">Пожалуйста, попробуйте обновить страницу</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Сертификаты</h1>
        <p className="text-muted-foreground">Скачайте и поделитесь вашими сертификатами</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <Card key={cert.id} className="border-2 hover:shadow-lg transition-shadow overflow-hidden rounded-2xl">
            <div className="aspect-[3/2] bg-muted relative overflow-hidden rounded-t-2xl">
              <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
                <div className="text-center p-4">
                  <Award className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg text-emerald-800">Сертификат</h3>
                  <p className="text-sm text-emerald-600">{cert.id}</p>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-white dark:bg-background rounded-full p-2 shadow-lg">
                  <Award className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{cert.id}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Пожертвование: {cert.donation_id}</p>
                  <p>Деревьев: {cert.trees}</p>
                  <p>Локация: {cert.location}</p>
                  <p>Дата выдачи: {new Date(cert.date).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
                    <Download className="h-4 w-4 mr-2" />
                    Скачать PDF
                  </Button>
                </a>
                <Button variant="outline" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {certificates.length === 0 && (
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-12 text-center">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Нет сертификатов</h3>
            <p className="text-muted-foreground mb-6">Сертификаты появятся после завершения посадки деревьев</p>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full" asChild>
              <a href="/donate">Посадить деревья</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
