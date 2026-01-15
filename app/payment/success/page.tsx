"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, XCircle, Download, UserPlus, ArrowRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import apiService from "@/services/api"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const donationId = searchParams.get("donation_id")
  const [loading, setLoading] = useState(true)
  const [statusInfo, setStatusInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!donationId) {
      setError("Идентификатор пожертвования не найден")
      setLoading(false)
      return
    }

    const fetchStatus = async () => {
      try {
        const data = await apiService.getDonationStatus(donationId)
        setStatusInfo(data)
        
        // If it's already completed, ensure we stay here
        // If it was failed, the backend status should reflect that
      } catch (err: any) {
        console.error("Error fetching status:", err)
        setError("Не удалось проверить статус платежа")
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    
    // Polling if status is still awaiting_payment
    const interval = setInterval(async () => {
      if (statusInfo?.status === 'awaiting_payment') {
        try {
          const data = await apiService.getDonationStatus(donationId) as any
          setStatusInfo(data)
          if (data.status !== 'awaiting_payment') {
            clearInterval(interval)
          }
        } catch (e) {
          console.error("Polling error", e)
        }
      } else {
        clearInterval(interval)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [donationId, statusInfo?.status])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner className="h-12 w-12 mb-4" />
        <p className="text-muted-foreground">Проверяем статус платежа...</p>
      </div>
    )
  }

  if (error || !statusInfo) {
    return (
      <Card className="max-w-md mx-auto mt-12">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <CardTitle>Ошибка</CardTitle>
          <CardDescription>{error || "Произошла непредвиденная ошибка"}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.replace("/donate")}>Вернуться к оплате</Button>
        </CardFooter>
      </Card>
    )
  }

  const isSuccess = statusInfo.status === 'completed'
  const isPending = statusInfo.status === 'awaiting_payment'

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner className="h-12 w-12 mb-4" />
        <p className="text-xl font-medium mb-2">Ожидаем подтверждения платежа</p>
        <p className="text-muted-foreground">Это может занять несколько секунд...</p>
      </div>
    )
  }

  if (!isSuccess) {
    return (
      <Card className="max-w-md mx-auto mt-12">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <CardTitle>Платеж не прошел</CardTitle>
          <CardDescription>
            Статус платежа: {statusInfo.status === 'cancelled' ? 'Отменен' : 'Ошибка'}. 
            Пожалуйста, попробуйте еще раз.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.replace("/")}>На главную</Button>
          <Button onClick={() => router.replace("/donate")}>Попробовать снова</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Card className="border-primary/20 shadow-lg overflow-hidden">
        <div className="h-2 bg-primary" />
        <CardHeader className="text-center pb-2">
          <CheckCircle2 className="h-20 w-20 text-primary mx-auto mb-4 animate-in zoom-in duration-500" />
          <CardTitle className="text-3xl font-bold">Оплата успешно принята!</CardTitle>
          <CardDescription className="text-lg">
            Спасибо за ваш вклад в природу Казахстана. Вы посадили {statusInfo.tree_count} {statusInfo.tree_count === 1 ? 'дерево' : 'деревьев'}.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="bg-muted/50 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Сумма пожертвования</p>
              <p className="text-2xl font-bold text-primary">{statusInfo.amount.toLocaleString()} ₸</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">ID заказа</p>
              <p className="text-sm font-mono">{donationId?.slice(0, 8)}...</p>
            </div>
          </div>

          {statusInfo.is_guest ? (
            <div className="space-y-4 border-t pt-6">
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <UserPlus className="mr-2 h-6 w-6 text-primary" />
                  Вы оплатили как гость
                </h3>
                <p className="text-muted-foreground mb-6">
                  Зарегистрируйтесь, чтобы сохранять историю ваших посадок, получать сертификаты и следить за ростом ваших деревьев в личном кабинете.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button asChild className="w-full">
                    <Link href={`/register?email=${encodeURIComponent(statusInfo.email || "")}`}>
                      Создать аккаунт
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/">
                      Продолжить как гость
                    </Link>
                  </Button>
                </div>
                {statusInfo.certificate_available && (
                  <div className="mt-4 pt-4 border-t border-primary/10">
                    <Button variant="link" asChild className="w-full text-primary h-auto p-0">
                      <a href={statusInfo.certificate_url} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Скачать сертификат гостя
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild className="flex-1">
                <Link href="/cabinet">
                  Перейти в личный кабинет
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {statusInfo.certificate_available && (
                <Button variant="outline" asChild className="flex-1">
                  <a href={statusInfo.certificate_url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Скачать сертификат
                  </a>
                </Button>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-muted/30 border-t justify-center py-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Вернуться на главную
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Spinner className="h-12 w-12 mb-4" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
