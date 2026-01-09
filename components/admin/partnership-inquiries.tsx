"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Send, Trash2, Download, Search } from "lucide-react";
import apiService from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PartnershipInquiry {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  partnership_type: string;
  message: string;
  created_at: string;
  status: string;
}

export function PartnershipInquiries() {
  const [inquiries, setInquiries] = useState<PartnershipInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<PartnershipInquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<PartnershipInquiry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await apiService.adminGetPartnershipInquiries();
        setInquiries(data);
        setFilteredInquiries(data);
      } catch (err) {
        console.error('Error fetching partnership inquiries:', err);
        setError('Failed to load partnership inquiries');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = inquiries.filter((inquiry) =>
      inquiry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredInquiries(filtered);
  }, [searchQuery, inquiries]);

  const openInquiryDetail = (inquiry: PartnershipInquiry) => {
    setSelectedInquiry(inquiry);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Ожидание", className: "bg-yellow-600 text-white" },
      contacted: { label: "Контактировали", className: "bg-blue-600 text-white" },
      completed: { label: "Завершено", className: "bg-emerald-600 text-white" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] ||
                  { label: status || "Неизвестно", className: "bg-gray-600 text-white" };

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка заявок на партнерство...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <p className="text-muted-foreground mt-2">Пожалуйста, попробуйте обновить страницу</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Заявки на партнерство</h1>
          <p className="text-muted-foreground">Просмотр и управление заявками от компаний</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{inquiries.length}</div>
            <p className="text-sm text-muted-foreground">Всего заявок</p>
          </CardContent>
        </Card>
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {inquiries.filter(i => i.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">В ожидании</p>
          </CardContent>
        </Card>
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {inquiries.filter(i => i.status === 'contacted').length}
            </div>
            <p className="text-sm text-muted-foreground">Контактировали</p>
          </CardContent>
        </Card>
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">
              {inquiries.filter(i => i.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">Завершено</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-2 rounded-2xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск по ID, названию компании, контактному лицу или email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inquiries Table */}
      <Card className="border-2 rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Компания</TableHead>
                  <TableHead>Контактное лицо</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Тип партнёрства</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="font-medium">{inquiry.id}</TableCell>
                    <TableCell>{inquiry.company_name}</TableCell>
                    <TableCell>{inquiry.contact_person}</TableCell>
                    <TableCell className="text-muted-foreground">{inquiry.email}</TableCell>
                    <TableCell className="text-muted-foreground">{inquiry.phone || 'N/A'}</TableCell>
                    <TableCell>{inquiry.partnership_type || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString('ru-RU') : 'N/A'}
                    </TableCell>
                    <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openInquiryDetail(inquiry)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredInquiries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Заявок на партнерство не найдено</p>
        </div>
      )}

      {/* Inquiry Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Детали заявки на партнерство</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">ID заявки</Label>
                  <div className="text-sm">{selectedInquiry.id}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Дата создания</Label>
                  <div className="text-sm">
                    {selectedInquiry.created_at ? new Date(selectedInquiry.created_at).toLocaleDateString('ru-RU') : 'N/A'}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Название компании</Label>
                  <div className="text-sm">{selectedInquiry.company_name}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Контактное лицо</Label>
                  <div className="text-sm">{selectedInquiry.contact_person}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <div className="text-sm">{selectedInquiry.email}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Телефон</Label>
                  <div className="text-sm">{selectedInquiry.phone || 'N/A'}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Тип партнёрства</Label>
                  <div className="text-sm">{selectedInquiry.partnership_type || 'N/A'}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Статус</Label>
                  <div className="text-sm">{getStatusBadge(selectedInquiry.status)}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Сообщение</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedInquiry.message || 'Нет сообщения'}
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsDialogOpen(false)}>Закрыть</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}