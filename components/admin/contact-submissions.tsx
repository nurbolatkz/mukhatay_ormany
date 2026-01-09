"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await apiService.adminGetContactSubmissions();
        setSubmissions(data);
        setFilteredSubmissions(data);
      } catch (err) {
        console.error('Error fetching contact submissions:', err);
        setError('Failed to load contact submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = submissions.filter((submission) =>
      submission.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredSubmissions(filtered);
  }, [searchQuery, submissions]);

  const openSubmissionDetail = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка контактных обращений...</p>
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
          <h1 className="text-3xl font-bold mb-2">Контактные обращения</h1>
          <p className="text-muted-foreground">Просмотр и управление обращениями от пользователей</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{submissions.length}</div>
            <p className="text-sm text-muted-foreground">Всего обращений</p>
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
              placeholder="Поиск по ID, имени, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card className="border-2 rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.id}</TableCell>
                    <TableCell>{submission.name}</TableCell>
                    <TableCell className="text-muted-foreground">{submission.email}</TableCell>
                    <TableCell className="text-muted-foreground">{submission.phone || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {submission.created_at ? new Date(submission.created_at).toLocaleDateString('ru-RU') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openSubmissionDetail(submission)}>
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

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Контактных обращений не найдено</p>
        </div>
      )}

      {/* Submission Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Детали контактного обращения</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">ID обращения</Label>
                  <div className="text-sm">{selectedSubmission.id}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Дата создания</Label>
                  <div className="text-sm">
                    {selectedSubmission.created_at ? new Date(selectedSubmission.created_at).toLocaleDateString('ru-RU') : 'N/A'}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Имя</Label>
                  <div className="text-sm">{selectedSubmission.name}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <div className="text-sm">{selectedSubmission.email}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Телефон</Label>
                  <div className="text-sm">{selectedSubmission.phone || 'N/A'}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Сообщение</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedSubmission.message || 'Нет сообщения'}
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