"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Award, Send, Download, Eye, CheckCircle2 } from "lucide-react"

const certificates = [
  {
    id: "CERT-2024-156",
    donationId: "DON-2024-156",
    donor: "Асем Нурланова",
    trees: 25,
    status: "generated",
    date: "15 июн 2024",
  },
  {
    id: "CERT-2024-155",
    donationId: "DON-2024-155",
    donor: "Казахтелеком",
    trees: 500,
    status: "sent",
    date: "12 июн 2024",
  },
  {
    id: "CERT-2024-154",
    donationId: "DON-2024-154",
    donor: "Иван Петров",
    trees: 10,
    status: "sent",
    date: "10 июн 2024",
  },
  {
    id: "CERT-2024-153",
    donationId: "DON-2024-153",
    donor: "Air Astana",
    trees: 1000,
    status: "sent",
    date: "7 июн 2024",
  },
]

export function CertificatesManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Управление сертификатами</h1>
          <p className="text-muted-foreground">Генерация и отправка сертификатов</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Award className="h-4 w-4 mr-2" />
          Сгенерировать пакетно
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">480</div>
            <p className="text-sm text-muted-foreground">Всего сертификатов</p>
          </CardContent>
        </Card>
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-sm text-muted-foreground">Ожидают отправки</p>
          </CardContent>
        </Card>
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">468</div>
            <p className="text-sm text-muted-foreground">Отправлено</p>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Table */}
      <Card className="border-2 rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID сертификата</TableHead>
                  <TableHead>ID пожертвования</TableHead>
                  <TableHead>Донор</TableHead>
                  <TableHead>Деревья</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата создания</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-medium">{cert.id}</TableCell>
                    <TableCell className="text-muted-foreground">{cert.donationId}</TableCell>
                    <TableCell className="font-medium">{cert.donor}</TableCell>
                    <TableCell className="font-semibold">{cert.trees}</TableCell>
                    <TableCell>
                      {cert.status === "sent" ? (
                        <Badge className="bg-emerald-600 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Отправлен
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-600 text-white">Сгенерирован</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{cert.date}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {cert.status === "generated" && (
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
