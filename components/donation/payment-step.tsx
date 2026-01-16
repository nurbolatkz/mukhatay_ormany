"use client"

import { useState, useEffect } from "react"
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
  const [locationData, setLocationData] = useState<{name: string, coordinates: string} | null>(null)

  // Use the actual location ID from the donation data
  const locationId = donationData.location

  // Fetch location data
  useEffect(() => {
    const fetchLocationData = async () => {
      if (locationId) {
        try {
          // Fetch all locations and find the selected one
          const locations = await apiService.getLocations()
          const selectedLocation = locations.find((loc: any) => loc.id === locationId)
          if (selectedLocation) {
            setLocationData({
              name: selectedLocation.name,
              coordinates: selectedLocation.coordinates
            })
          }
        } catch (error) {
          console.error('Error fetching location data:', error)
          // Fallback to hardcoded names if API fails
          const locationName = locationId === "loc_nursery_001" ? "Forest of Central Asia" : "Mukhatay Ormany"
          setLocationData({
            name: locationName,
            coordinates: "Сектор B-14, Алматинская область"
          })
        }
      }
    }

    fetchLocationData()
  }, [locationId])

  // Get location name for display
  const locationName = locationData ? locationData.name : "Загрузка..."

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      // Create donation in backend with pending status
      const donationPayload = {
        location_id: locationId,
        package_id: "custom", // Use "custom" for direct tree count selection
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
      
      console.log("Creating donation in backend:", donationPayload)
      // Check if user is authenticated to determine if this is a guest donation
      const isGuest = !user;
      const createdDonation = await apiService.createDonation(donationPayload, isGuest)
      console.log("Donation created:", createdDonation)
      
      // Type assertion to access the id and user_id property
      const donationId = (createdDonation as { id: string }).id
      const guestUserId = (createdDonation as { user_id?: string }).user_id
      
      if (guestUserId) {
        localStorage.setItem('guestUserId', guestUserId)
      }
      
      // Process payment through Ioka
      console.log("Processing payment for donation:", donationId)
      const paymentResult = await apiService.processPayment(donationId, {}, isGuest) as any
      console.log("Payment result:", paymentResult)
      
      // Check if Ioka payment was successful
      if (paymentResult.success && paymentResult.checkout_url) {
        // Store donation ID for return check
        localStorage.setItem('lastDonationId', donationId)
        
        // Save donation info to localStorage for tracking
        const donationRecord = {
          id: donationId,
          date: new Date().toLocaleDateString('ru-RU'),
          location: locationName,
          trees: donationData.treeCount,
          amount: donationData.amount,
          status: "В ожидании оплаты",
          statusColor: "yellow",
          email: donationData.donorInfo.email,
          order_id: paymentResult.order_id
        }
        
        const userDonations = JSON.parse(localStorage.getItem('userDonations') || '[]')
        userDonations.push(donationRecord)
        localStorage.setItem('userDonations', JSON.stringify(userDonations))
        
        // Clear pending donation data
        localStorage.removeItem('pendingDonation')
        
        // Redirect to Ioka checkout
        window.location.href = paymentResult.checkout_url
      } else {
        // Fallback if Ioka is not configured - show error
        throw new Error(paymentResult.message || 'Не удалось создать платежный заказ')
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      alert("Произошла ошибка при обработке платежа. Пожалуйста, попробуйте еще раз.")
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
        package_id: "custom", // Use "custom" for direct tree count selection
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
          <p className="mb-8 text-foreground/60">Завершите перевод.</p>
          
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary bg-background/60 backdrop-blur-sm p-6 shadow-lg transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-[6px] border-primary bg-transparent"></div>
                  <span className="text-xl font-bold text-foreground">Безопасная оплата Ioka</span>
                </div>
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">ЗАЩИЩЕНО</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">Оплата банковской картой</h4>
                    <p className="text-sm leading-relaxed text-foreground/70 mt-2">
                      После подтверждения вы будете перенаправлены на защищенную страницу оплаты Ioka для завершения платежа.
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
                      <span>Перенаправление на защищенную страницу Ioka Checkout</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined !text-[16px] text-primary mt-0.5">check_circle</span>
                      <span>Введите данные банковской карты</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined !text-[16px] text-primary mt-0.5">check_circle</span>
                      <span>После оплаты вы получите сертификат посадки</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-lg bg-card/5 border border-border/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary !text-[20px]">credit_card</span>
                    <h5 className="font-semibold text-foreground">Принимаем к оплате:</h5>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="px-3 py-1 rounded bg-background border border-border text-xs font-bold">VISA</div>
                    <div className="px-3 py-1 rounded bg-background border border-border text-xs font-bold">MasterCard</div>
                    <div className="px-3 py-1 rounded bg-background border border-border text-xs font-bold">МИР</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 rounded-xl bg-card/5 border border-border/5 p-4 text-foreground/50">
              <span className="material-symbols-outlined text-3xl text-primary/80">info</span>
              <div className="text-center sm:text-left text-xs leading-relaxed">
                <p className="font-bold uppercase tracking-wider text-foreground/70">Временное решение</p>
                <p> </p>
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
                  <p className="mt-1 text-sm text-foreground/60">{locationData?.coordinates || "Сектор B-14, Алматинская область"}</p>
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
              <div className="space-y-3">
                <div className="flex items-start space-x-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="public-offer-agreement" 
                    defaultChecked 
                    className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <label htmlFor="public-offer-agreement" className="text-[10px] text-foreground/70 leading-relaxed">
                    Нажимая «Оплатить», я соглашаюсь с <a href="/ПУБЛИЧНАЯ ОФЕРТА.pdf" target="_blank" className="underline hover:text-foreground">Публичной офертой</a> и подтверждаю, что пожертвование является добровольным и безвозвратным
                  </label>
                </div>
                
                <div className="flex items-start space-x-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="privacy-policy-agreement" 
                    defaultChecked 
                    className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <label htmlFor="privacy-policy-agreement" className="text-[10px] text-foreground/70 leading-relaxed">
                    Я согласен(а) с <a href="/PrivacyPolicy.pdf" target="_blank" className="underline hover:text-foreground">Политикой конфиденциальности</a> и даю согласие на обработку персональных данных
                  </label>
                </div>
              </div>
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