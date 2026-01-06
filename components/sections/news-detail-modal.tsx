"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

interface NewsDetailModalProps {
  newsItem: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NewsDetailModal({ newsItem, isOpen, onClose }: NewsDetailModalProps) {
  if (!newsItem) return null;

  // Format the date
  const formattedDate = newsItem.created_at 
    ? format(new Date(newsItem.created_at), 'dd MMMM yyyy', { locale: ru })
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {newsItem.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {newsItem.image_url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <img 
                src={newsItem.image_url} 
                alt={newsItem.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-foreground/60">
            <span>Автор: {newsItem.author}</span>
            <span>{formattedDate}</span>
          </div>
          
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {newsItem.content}
            </p>
          </div>
          
          {newsItem.category && (
            <div className="mt-4">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {newsItem.category}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}