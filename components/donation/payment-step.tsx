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
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Оплата</h2>
        <p className="text-muted-foreground">Завершите пожертвование</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <Card className="border-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Итого</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Локация:</span>
                <span className="font-medium">{locationName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Деревьев:</span>
                <span className="font-medium">{donationData.treeCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Донор:</span>
                <span className="font-medium">{donationData.donorInfo.fullName}</span>
              </div>
              {donationData.donorInfo.companyName && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Компания:</span>
                  <span className="font-medium">{donationData.donorInfo.companyName}</span>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Сумма:</span>
                <span className="text-2xl font-bold text-emerald-600">{donationData.amount.toLocaleString()} ₸</span>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Что включено:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Выращивание саженцев</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Посадка деревьев</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Уход за деревьями</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Сертификат о посадке</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Фото и видео отчёты</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="border-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Способ оплаты</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="kaspi">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Kaspi QR
                </TabsTrigger>
                <TabsTrigger value="card">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Карта
                </TabsTrigger>
                <TabsTrigger value="bank">
                  <Building2 className="h-4 w-4 mr-2" />
                  Перевод
                </TabsTrigger>
              </TabsList>

              <TabsContent value="kaspi" className="space-y-4 mt-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg">
                    <Badge variant="secondary" className="bg-emerald-600 text-white">
                      Рекомендуется
                    </Badge>
                    <span className="text-sm font-medium">Самый быстрый способ</span>
                  </div>

                  <div className="bg-muted rounded-lg p-8 inline-block">
                    <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center">
                      <img
                        src="/kaspi-qr-code.jpg"
                        alt="Kaspi QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Отсканируйте QR-код в приложении Kaspi</p>
                    <p className="text-xs text-muted-foreground">
                      Сумма: <span className="font-bold">{donationData.amount.toLocaleString()} ₸</span>
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="card" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Номер карты</label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Срок действия</label>
                      <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CVV</label>
                      <input type="text" placeholder="123" className="w-full px-3 py-2 border rounded-md" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Защищённое соединение SSL</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-4 mt-6">
                <div className="bg-muted rounded-lg p-6 space-y-3">
                  <h4 className="font-semibold">Реквизиты для перевода:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Получатель:</span>
                      <span className="font-medium">ТОО "Mukhatay Ormany"</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">БИН:</span>
                      <span className="font-medium">XXXXXXXXXXX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IBAN:</span>
                      <span className="font-medium">KZ00000000000000000000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Банк:</span>
                      <span className="font-medium">АО "Народный Банк Казахстана"</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Назначение:</span>
                      <span className="font-medium">Пожертвование на посадку деревьев</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  После перевода отправьте подтверждение на email: payments@mukhatayormany.kz
                </p>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-6 mt-6 border-t">
              <Button variant="outline" onClick={onBack}>
                Назад
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isProcessing ? "Обработка..." : "Подтвердить оплату"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
