"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { DonationData } from "@/app/donate/page"
import apiService from "@/services/api"
import { useAuth } from "@/contexts/auth-context"

interface PaymentStepProps {
  donationData: DonationData
  onBack: () => void
}

export function PaymentStep({ donationData, onBack }: PaymentStepProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  // Use the actual location ID from the donation data
  const locationId = donationData.location
  // Get location name from the location ID
  const locationName = locationId === "loc_nursery_001" ? "Forest of Central Asia" : "Mukhatay Ormany"

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      // Create donation in backend with pending status
      const donationPayload = {
        location_id: locationId,
        package_id: donationData.packageType,
        tree_count: donationData.treeCount,
        amount: donationData.amount,
        donor_info: {
          full_name: donationData.donorInfo.fullName,
          email: donationData.donorInfo.email,
          phone: donationData.donorInfo.phone,
          company_name: donationData.donorInfo.companyName,
          message: donationData.donorInfo.message,
          subscribe_updates: donationData.donorInfo.subscribeUpdates
        }
      }
      
      console.log("[v0] Creating donation in backend:", donationPayload)
      // Check if user is authenticated to determine if this is a guest donation
      const isGuest = !user;
      const createdDonation = await apiService.createDonation(donationPayload, isGuest)
      console.log("[v0] Donation created:", createdDonation)
      
      // TEMPORARY: Redirect to WhatsApp instead of processing payment
      // Save donation to localStorage with email for future linking
      const donationRecord = {
        id: createdDonation.id,
        date: new Date().toLocaleDateString('ru-RU'),
        location: locationName,
        trees: donationData.treeCount,
        amount: donationData.amount,
        status: "В ожидании", // Pending status
        statusColor: "yellow",
        email: donationData.donorInfo.email // Store email for linking
      }
      
      const userDonations = JSON.parse(localStorage.getItem('userDonations') || '[]')
      userDonations.push(donationRecord)
      localStorage.setItem('userDonations', JSON.stringify(userDonations))
      
      // Clear pending donation data
      localStorage.removeItem('pendingDonation')
      
      // Prepare WhatsApp message
      const whatsappMessage = `New Tree Donation Request:%0AName: ${encodeURIComponent(donationData.donorInfo.fullName)}%0AEmail: ${encodeURIComponent(donationData.donorInfo.email)}%0APhone: ${encodeURIComponent(donationData.donorInfo.phone)}%0ATree Count: ${donationData.treeCount}%0ALocation: ${encodeURIComponent(locationName)}%0AAmount: ${donationData.amount} KZT`;
      
      // Redirect to WhatsApp
      const whatsappUrl = `https://wa.me/77029999849?text=${whatsappMessage}`;
      window.open(whatsappUrl, '_blank');
      
      // Show confirmation message
      alert("Ваша заявка на пожертвование отправлена! Мы свяжемся с вами через WhatsApp для подтверждения оплаты. Спасибо за ваш вклад в восстановление лесов!")
      setIsProcessing(false)
      
      // Redirect to home page after WhatsApp redirect
      router.push('/')
    } catch (error) {
      console.error("[v0] Error creating donation:", error)
      alert("Произошла ошибка при создании заявки на пожертвование. Пожалуйста, попробуйте еще раз.")
      setIsProcessing(false)
    }
  }
  
  // ORIGINAL PAYMENT CODE (COMMENTED OUT FOR TEMPORARY WHATSAPP FLOW)
  /*
  const handlePaymentOriginal = async () => {
    setIsProcessing(true)
    
    try {
      // Create donation in backend
      const donationPayload = {
        location_id: locationId,
        package_id: donationData.packageType,
        tree_count: donationData.treeCount,
        amount: donationData.amount,
        donor_info: {
          full_name: donationData.donorInfo.fullName,
          email: donationData.donorInfo.email,
          phone: donationData.donorInfo.phone,
          company_name: donationData.donorInfo.companyName,
          message: donationData.donorInfo.message,
          subscribe_updates: donationData.donorInfo.subscribeUpdates
        }
      }
      
      console.log("[v0] Creating donation in backend:", donationPayload)
      // Check if user is authenticated to determine if this is a guest donation
      const isGuest = !user;
      const createdDonation = await apiService.createDonation(donationPayload, isGuest)
      console.log("[v0] Donation created:", createdDonation)
      
      // Process payment
      const paymentPayload = {
        payment_method: paymentMethod
      }
      
      console.log("[v0] Processing payment for donation:", createdDonation.id, paymentPayload)
      const paymentResult = await apiService.processPayment(createdDonation.id, paymentPayload, isGuest)
      console.log("[v0] Payment processed:", paymentResult)
      
      // Save donation to localStorage with email for future linking
      const donationRecord = {
        id: createdDonation.id,
        date: new Date().toLocaleDateString('ru-RU'),
        location: locationName,
        trees: donationData.treeCount,
        amount: donationData.amount,
        status: "Завершено",
        statusColor: "emerald",
        email: donationData.donorInfo.email // Store email for linking
      }
      
      const userDonations = JSON.parse(localStorage.getItem('userDonations') || '[]')
      userDonations.push(donationRecord)
      localStorage.setItem('userDonations', JSON.stringify(userDonations))
      
      // Clear pending donation data
      localStorage.removeItem('pendingDonation')
      
      alert("Платёж успешно обработан! Спасибо за ваш вклад в восстановление лесов!")
      setIsProcessing(false)
      
      // For guest users, redirect to login/register with email pre-filled
      if (!user) {
        router.push(`/login?email=${encodeURIComponent(donationData.donorInfo.email)}&guest_donation=true`)
      } else {
        // For authenticated users, redirect to user cabinet
        router.push('/cabinet?view=history')
      }
    } catch (error) {
      console.error("[v0] Error processing payment:", error)
      alert("Произошла ошибка при обработке платежа. Пожалуйста, попробуйте еще раз.")
      setIsProcessing(false)
    }
  }
  */

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center gap-2 text-sm text-foreground/50">
        <span className="hover:text-foreground cursor-pointer">Главная</span>
        <span className="material-symbols-outlined !text-[12px]">chevron_right</span>
        <span className="hover:text-foreground cursor-pointer">Донат</span>
        <span className="material-symbols-outlined !text-[12px]">chevron_right</span>
        <span className="text-primary">Оплата</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h1 className="mb-2 text-3xl font-extrabold text-foreground sm:text-4xl">Оплата участия</h1>
          <p className="mb-8 text-foreground/60">Завершите перевод через WhatsApp.</p>
          
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary bg-background/60 backdrop-blur-sm p-6 shadow-lg transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-[6px] border-primary bg-transparent"></div>
                  <span className="text-xl font-bold text-foreground">Оплата через WhatsApp</span>
                </div>
                <span className="rounded-full bg-[#25D366]/20 border border-[#25D366]/50 px-3 py-1 text-xs font-bold text-[#25D366]">ВРЕМЕННО</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.5c0 1.38-.56 2.63-1.46 3.54l-1.27 1.27c-.91.9-2.16 1.46-3.54 1.46-.97 0-1.94-.27-2.78-.8l-9.06-5.72c-.55-.35-.86-.96-.8-1.6-.06-.64.25-1.25.8-1.6l9.06-5.72c.84-.53 1.81-.8 2.78-.8 1.38 0 2.63.56 3.54 1.46l1.27 1.27c.9.91 1.46 2.16 1.46 3.54Z"/>
                      <path d="m7 12 5.5 2.5M12.5 9.5 17 7"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">Оплата через WhatsApp</h4>
                    <p className="text-sm leading-relaxed text-foreground/70 mt-2">
                      После подтверждения вашей заявки вы будете перенаправлены в WhatsApp для завершения оплаты.
                    </p>
                  </div>
                </div>
                
                <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                  <h5 className="font-semibold text-foreground mb-2">Как это работает:</h5>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined !text-[16px] text-primary mt-0.5">check_circle</span>
                      <span>Нажмите "Подтвердить и оплатить"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined !text-[16px] text-primary mt-0.5">check_circle</span>
                      <span>Откроется WhatsApp с предзаполненным сообщением</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined !text-[16px] text-primary mt-0.5">check_circle</span>
                      <span>Наш менеджер свяжется с вами для подтверждения оплаты</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined !text-[16px] text-primary mt-0.5">check_circle</span>
                      <span>После оплаты вы получите сертификат посадки</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 rounded-xl bg-card/5 border border-border/5 p-4 text-foreground/50">
              <span className="material-symbols-outlined text-3xl text-primary/80">info</span>
              <div className="text-center sm:text-left text-xs leading-relaxed">
                <p className="font-bold uppercase tracking-wider text-foreground/70">Временное решение</p>
                <p>Это временное решение до получения API ключа для платежной системы. Мы свяжемся с вами в течение 24 часов.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 rounded-xl bg-card/5 border border-border/5 p-4 text-foreground/50">
            <span className="material-symbols-outlined text-3xl text-primary/80">lock_person</span>
            <div className="text-center sm:text-left text-xs leading-relaxed">
              <p className="font-bold uppercase tracking-wider text-foreground/70">Гарантия безопасности</p>
              <p>Ваши данные защищены сквозным шифрованием SSL. Мы не храним ваши платежные реквизиты.</p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-3xl border border-border/10 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="bg-card/5 p-6 sm:p-8 border-b border-border/5">
              <h3 className="text-xl font-bold text-foreground">Ваш заказ</h3>
              <p className="text-sm text-foreground/50">Пожалуйста, проверьте данные перед оплатой</p>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <span className="material-symbols-outlined">forest</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-foreground/40">Пакет</p>
                      <p className="font-bold text-foreground text-lg">{donationData.treeCount} деревьев</p>
                    </div>
                    <p className="font-bold text-foreground">{donationData.amount.toLocaleString()} ₸</p>
                  </div>
                  <p className="mt-1 text-sm text-foreground/60">Включает посадку и уход в течение 3 лет</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card/5 text-foreground/70 border border-border/10">
                  <span className="material-symbols-outlined">map</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-foreground/40">Локация</p>
                      <p className="font-bold text-foreground">{locationName}</p>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-foreground/60">Сектор B-14, Алматинская область</p>
                </div>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent"></div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-foreground/60">
                  <span>Сумма взноса</span>
                  <span>{donationData.amount.toLocaleString()} ₸</span>
                </div>
                <div className="flex justify-between text-sm text-foreground/60">
                  <span>Комиссия платформы</span>
                  <span className="text-primary">0 ₸</span>
                </div>
              </div>
              <div className="rounded-2xl bg-card/5 p-4 border border-border/5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/50">Итого к оплате</p>
                    <p className="text-3xl font-extrabold text-foreground tracking-tight">{donationData.amount.toLocaleString()} ₸</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-background-dark">
                    <span className="material-symbols-outlined !text-[20px]">check</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-primary py-4 text-center text-lg font-bold text-background-dark transition-all hover:shadow-[0_0_30px_rgba(249,245,6,0.3)] hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0"></div>
                <span className="relative z-10">{isProcessing ? "Обработка..." : "Подтвердить и оплатить"}</span>
                <span className="material-symbols-outlined relative z-10 transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Button>
              <p className="text-center text-[10px] text-foreground/30">
                Нажимая кнопку, вы соглашаетесь с <a className="underline hover:text-foreground" href="#">Условиями использования</a> и <a className="underline hover:text-foreground" href="#">Политикой конфиденциальности</a>
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-foreground/40">
            <span className="material-symbols-outlined text-primary">emoji_events</span>
            <span>Вы получите <strong>{Math.floor(donationData.amount / 100)} XP</strong> после оплаты</span>
          </div>
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mt-6 w-full border-border text-foreground hover:bg-card/10"
          >
            Назад
          </Button>
        </div>
      </div>
    </div>
  )
}