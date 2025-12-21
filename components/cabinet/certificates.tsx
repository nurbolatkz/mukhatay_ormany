"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, Award } from "lucide-react"

const certificates = [
  {
    id: "CERT-2024-001",
    donationId: "DON-2024-005",
    trees: 25,
    location: "Mukhatay Ormany",
    date: "15 июня 2024",
    image: "/tree-planting-certificate.jpg",
  },
  {
    id: "CERT-2024-002",
    donationId: "DON-2024-004",
    trees: 10,
    location: "Forest of Central Asia",
    date: "8 мая 2024",
    image: "/forest-certificate-green.jpg",
  },
  {
    id: "CERT-2024-003",
    donationId: "DON-2024-003",
    trees: 50,
    location: "Mukhatay Ormany",
    date: "25 апреля 2024",
    image: "/environmental-certificate.jpg",
  },
]

export function Certificates() {
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
              <img
                src={cert.image || "/placeholder.svg"}
                alt={`Сертификат ${cert.id}`}
                className="object-cover w-full h-full"
              />
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
                  <p>Пожертвование: {cert.donationId}</p>
                  <p>Деревьев: {cert.trees}</p>
                  <p>Локация: {cert.location}</p>
                  <p>Дата выдачи: {cert.date}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
                  <Download className="h-4 w-4 mr-2" />
                  Скачать PDF
                </Button>
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
