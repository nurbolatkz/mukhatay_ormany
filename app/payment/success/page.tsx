"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, XCircle, Download, UserPlus, ArrowRight, Home, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import apiService from "@/services/api"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const donationId = searchParams.get("donation_id")
  const [loading, setLoading] = useState(true)
  const [statusInfo, setStatusInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Скопировано",
      description: "ID заказа скопирован в буфер обмена",
    })
    setTimeout(() => setCopied(false), 2000)
  }

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
    <div className="max-w-xl mx-auto py-12 px-4">
      <Card className="border-none shadow-2xl overflow-hidden rounded-3xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pt-10 pb-2">
          <div className="mb-6 relative inline-block">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150"></div>
            <CheckCircle2 className="h-20 w-20 text-emerald-500 mx-auto relative z-10 animate-in zoom-in duration-500" />
          </div>
          <CardTitle className="text-3xl font-black text-foreground tracking-tight mb-2">Оплата принята!</CardTitle>
          <div className="flex items-center justify-center gap-2 text-xl font-medium text-emerald-600 dark:text-emerald-400">
            <span>🌱 Ваш вклад:</span>
            <span className="font-bold underline decoration-2 underline-offset-4">
              {statusInfo.tree_count} {statusInfo.tree_count === 1 ? 'дерево' : 
               statusInfo.tree_count >= 2 && statusInfo.tree_count <= 4 ? 'дерева' : 'деревьев'}
            </span>
            <span>будут посажены</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 pt-6 px-8">
          <div className="flex flex-col items-center justify-center py-6 border-y border-border/50 space-y-2">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-widest">Сумма пожертвования</p>
            <p className="text-5xl font-black text-foreground">{statusInfo.amount.toLocaleString()} ₸</p>
            
            <div className="flex items-center gap-2 mt-4 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
              <p className="text-xs text-muted-foreground font-mono">ID: {donationId}</p>
              <button 
                onClick={() => copyToClipboard(donationId || "")}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Копировать ID"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>

          {statusInfo.certificate_available && (
            <Button variant="outline" asChild className="w-full h-14 text-lg font-bold border-2 rounded-2xl group">
              <a href={statusInfo.certificate_url} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
                Скачать сертификат
              </a>
            </Button>
          )}

          {statusInfo.is_guest ? (
            <div className="bg-primary/10 border-2 border-primary/20 rounded-3xl p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-black flex items-center gap-2 text-foreground">
                  <UserPlus className="h-6 w-6 text-primary" />
                  Сохраните ваш вклад
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Создайте аккаунт, чтобы получить доступ к:
                </p>
                <ul className="text-sm space-y-2 font-medium">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Полной истории пожертвований
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Персональным сертификатам
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Отслеживанию роста ваших деревьев
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button asChild className="w-full h-14 text-lg font-extrabold bg-primary text-background-dark hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl">
                  <Link href={`/register?email=${encodeURIComponent(statusInfo.email || "")}`}>
                    Создать аккаунт и сохранить вклад
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full font-bold text-muted-foreground hover:text-foreground">
                  <Link href="/">Остаться гостем</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full h-14 text-lg font-extrabold bg-primary text-background-dark hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl">
                <Link href="/cabinet">
                  Перейти в личный кабинет
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full font-bold text-muted-foreground hover:text-foreground">
                <Link href="/">Вернуться на главную</Link>
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="pb-10 pt-4 justify-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Home className="h-3 w-3" />
            <span>Mukhatay Ormany — Восстанавливаем леса вместе</span>
          </div>
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
