"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, User, MessageCircle, Facebook, Instagram, Youtube, Send } from "lucide-react"
import apiService from "@/services/api"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true);
    
    try {
      await apiService.submitContactForm(formData);
      alert("Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Произошла ошибка при отправке формы. Пожалуйста, попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-24 bg-[#1a3d2e] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M50 25 L75 40 L75 70 L50 85 L25 70 L25 40 Z\" fill=\"none\" stroke=\"%23ffffff\" stroke-width=\"1\"/%3E%3C/svg%3E')" }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Свяжитесь с <span className="text-[#f4e31e]">нами</span></h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Остались вопросы? Мы всегда рады помочь. Ответим в течение 24 часов</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Form Card */}
          <Card className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#1a3d2e]">Отправить сообщение</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#1a3d2e] font-semibold mb-2">Имя</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6b7280]" />
                    <Input
                      id="name"
                      className="pl-12 pr-4 py-4 border-2 border-[#e8ebe7] rounded-xl text-base focus:border-[#f4e31e] focus:ring-4 focus:ring-[rgba(244,227,30,0.2)]"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#1a3d2e] font-semibold mb-2">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6b7280]" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-12 pr-4 py-4 border-2 border-[#e8ebe7] rounded-xl text-base focus:border-[#f4e31e] focus:ring-4 focus:ring-[rgba(244,227,30,0.2)]"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#1a3d2e] font-semibold mb-2">Телефон</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6b7280]" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-12 pr-4 py-4 border-2 border-[#e8ebe7] rounded-xl text-base focus:border-[#f4e31e] focus:ring-4 focus:ring-[rgba(244,227,30,0.2)]"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[#1a3d2e] font-semibold mb-2">Сообщение</Label>
                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-4 h-5 w-5 text-[#6b7280]" />
                    <Textarea
                      id="message"
                      rows={5}
                      className="pl-12 pr-4 py-4 border-2 border-[#e8ebe7] rounded-xl text-base focus:border-[#f4e31e] focus:ring-4 focus:ring-[rgba(244,227,30,0.2)]"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#f4e31e] text-[#1a3d2e] rounded-full py-4 font-semibold text-lg shadow-[0_4px_16px_rgba(244,227,30,0.3)] hover:scale-102 hover:shadow-[0_6px_24px_rgba(244,227,30,0.4)] hover:bg-[#ffd700] transition-all duration-300"
                >
                  Отправить
                </Button>
                <p className="text-center text-sm text-[#6b7280]">Ответим в течение 24 часов</p>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info Cards */}
          <div className="space-y-6">
            <Card className="bg-white rounded-2xl p-8 border-2 border-[#e8ebe7] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#f4e31e]">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#f4e31e] flex items-center justify-center">
                  <Mail className="h-7 w-7 text-[#1a3d2e]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1a3d2e] mb-2">Email</h3>
                  <p className="text-base text-[#6b7280]">info@mukhatayormany.kz</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-2xl p-8 border-2 border-[#e8ebe7] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#f4e31e]">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#f4e31e] flex items-center justify-center">
                  <Phone className="h-7 w-7 text-[#1a3d2e]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1a3d2e] mb-2">Телефон</h3>
                  <p className="text-base text-[#6b7280]">+7 (702)999-98-49</p>
                  <p className="text-sm text-[#6b7280] mt-1">Работаем: Пн-Пт, 9:00-18:00</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-2xl p-8 border-2 border-[#e8ebe7] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#f4e31e]">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#f4e31e] flex items-center justify-center">
                  <MapPin className="h-7 w-7 text-[#1a3d2e]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1a3d2e] mb-2">Адрес</h3>
                  <p className="text-base text-[#6b7280]">
                    Казахстан, Астана
                    <br />
                    Проекты: Шортандинский район,
                    <br />
                    Карагандинская область
                  </p>
                </div>
              </div>
            </Card>

            {/* Social Links */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Мы в социальных сетях</h3>
              <div className="flex gap-4">
                {/* Facebook */}
                <a href="https://facebook.com/mukhatayormany" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#f4e31e] transition-colors duration-300">
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                
                {/* Instagram */}
                <a href="https://instagram.com/mukhatayormany" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#f4e31e] transition-colors duration-300">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                
                {/* YouTube */}
                <a href="https://youtube.com/@mukhatayormany" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#f4e31e] transition-colors duration-300">
                  <Youtube className="w-5 h-5 text-white" />
                </a>
                
                {/* Telegram */}
                <a href="https://t.me/mukhatayormany" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#f4e31e] transition-colors duration-300">
                  <Send className="w-5 h-5 text-white" />
                </a>
                
                {/* WhatsApp */}
                <a href="https://wa.me/77029999849" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#f4e31e] transition-colors duration-300">
                  <MessageCircle className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
