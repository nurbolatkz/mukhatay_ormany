"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Smartphone, Building2 } from "lucide-react"
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
  const [paymentMethod, setPaymentMethod] = useState<"kaspi" | "card" | "bank">("kaspi")
  const [isProcessing, setIsProcessing] = useState(false)

  // Use the actual location ID from the donation data
  const locationId = donationData.location
  // Get location name from the location ID
  const locationName = locationId === "loc_nursery_001" ? "Forest of Central Asia" : "Mukhatay Ormany"

  const handlePayment = async () => {
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
          <p className="mb-8 text-foreground/60">Выберите удобный способ оплаты для завершения перевода.</p>
          
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary bg-background/60 backdrop-blur-sm p-6 shadow-lg transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-[6px] ${paymentMethod === 'kaspi' ? 'border-primary bg-transparent' : 'border-border bg-transparent'}`}></div>
                  <span className="text-xl font-bold text-foreground">Kaspi QR</span>
                </div>
                <span className="rounded-full bg-[#f14635]/20 border border-[#f14635]/50 px-3 py-1 text-xs font-bold text-[#f14635]">0% КОМИССИЯ</span>
              </div>
              
              <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="kaspi" className="flex items-center justify-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Kaspi QR
                  </TabsTrigger>
                  <TabsTrigger value="card" className="flex items-center justify-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Карта
                  </TabsTrigger>
                  <TabsTrigger value="bank" className="flex items-center justify-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Перевод
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="kaspi" className="space-y-4 mt-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                    <div className="group relative flex h-48 w-48 shrink-0 items-center justify-center rounded-2xl bg-white p-3 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                      <span className="material-symbols-outlined text-[140px] text-background opacity-90">qr_code_2</span>
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="h-full w-0.5 bg-primary animate-[spin_2s_linear_infinite]"></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 text-center sm:text-left">
                      <h4 className="text-lg font-bold text-foreground">Сканируйте для оплаты</h4>
                      <p className="text-sm leading-relaxed text-foreground/70">
                        Откройте приложение <strong>Kaspi.kz</strong>, выберите сканер QR и наведите камеру на код.
                      </p>
                      <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                        <div className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-primary">
                          <span className="material-symbols-outlined !text-[16px]">verified_user</span>
                          <span>Мгновенно</span>
                        </div>
                        <div className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-primary">
                          <span className="material-symbols-outlined !text-[16px]">eco</span>
                          <span>Eco-friendly</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="card" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Номер карты</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background/5 text-foreground"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Срок действия</label>
                        <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-border rounded-md bg-background/5 text-foreground" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">CVV</label>
                        <input type="text" placeholder="123" className="w-full px-3 py-2 border border-border rounded-md bg-background/5 text-foreground" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Защищённое соединение SSL</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="bank" className="space-y-4 mt-6">
                  <div className="bg-card/5 rounded-lg p-6 space-y-3 border border-border">
                    <h4 className="font-semibold text-foreground">Реквизиты для перевода:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Получатель:</span>
                        <span className="font-medium text-foreground">ТОО "Mukhatay Ormany"</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">БИН:</span>
                        <span className="font-medium text-foreground">XXXXXXXXXXX</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">IBAN:</span>
                        <span className="font-medium text-foreground">KZ00000000000000000000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Банк:</span>
                        <span className="font-medium text-foreground">АО "Народный Банк Казахстана"</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Назначение:</span>
                        <span className="font-medium text-foreground">Пожертвование на посадку деревьев</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/60">
                    После перевода отправьте подтверждение на email: payments@mukhatayormany.kz
                  </p>
                </TabsContent>
              </Tabs>
            </div>
            
            <label className="group relative flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card/5 p-6 transition-all hover:bg-card/10 hover:border-foreground/30 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <input 
                  type="radio" 
                  name="payment_method" 
                  checked={paymentMethod === 'kaspi'}
                  onChange={() => setPaymentMethod('kaspi')}
                  className="h-5 w-5 border-border/30 bg-transparent text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-lg font-medium text-foreground/80 group-hover:text-foreground">Kaspi QR</span>
              </div>
              <div className="flex gap-2">
                <div className="flex h-8 w-12 items-center justify-center rounded bg-white/10">
                  <span className="text-[10px] font-bold text-foreground">KASPI</span>
                </div>
              </div>
            </label>
            
            <label className="group relative flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card/5 p-6 transition-all hover:bg-card/10 hover:border-foreground/30 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <input 
                  type="radio" 
                  name="payment_method" 
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="h-5 w-5 border-border/30 bg-transparent text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-lg font-medium text-foreground/80 group-hover:text-foreground">Банковская карта</span>
              </div>
              <div className="flex gap-2">
                <div className="flex h-8 w-12 items-center justify-center rounded bg-white/10">
                  <span className="text-[10px] font-bold text-foreground">VISA</span>
                </div>
                <div className="flex h-8 w-12 items-center justify-center rounded bg-white/10">
                  <div className="h-3 w-3 rounded-full bg-foreground/50 -mr-1"></div>
                  <div className="h-3 w-3 rounded-full bg-foreground/30"></div>
                </div>
              </div>
            </label>
            
            <label className="group relative flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card/5 p-6 transition-all hover:bg-card/10 hover:border-foreground/30 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <input 
                  type="radio" 
                  name="payment_method" 
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                  className="h-5 w-5 border-border/30 bg-transparent text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-lg font-medium text-foreground/80 group-hover:text-foreground">Банковский перевод</span>
              </div>
              <span className="material-symbols-outlined text-foreground/50">account_balance</span>
            </label>
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
