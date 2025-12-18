"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { DonationSteps } from "@/components/donation/donation-steps"
import { LocationStep } from "@/components/donation/location-step"
import { PackageStep } from "@/components/donation/package-step"
import { DonorInfoStep } from "@/components/donation/donor-info-step"
import { PaymentStep } from "@/components/donation/payment-step"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"

export type Location = "nursery" | "karaganda"

export interface DonationData {
  location: Location | null
  packageType: string
  treeCount: number
  amount: number
  donorInfo: {
    fullName: string
    email: string
    phone: string
    companyName: string
    message: string
    subscribeUpdates: boolean
  }
}

const STEPS = ["Локация", "Пакет", "Информация", "Оплата"]

export default function DonatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [donationData, setDonationData] = useState<DonationData>({
    location: null,
    packageType: "",
    treeCount: 0,
    amount: 0,
    donorInfo: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      message: "",
      subscribeUpdates: true,
    },
  })

  // Check for pending donation data when component mounts
  useEffect(() => {
    const step = searchParams.get('step')
    if (step === 'complete') {
      const pendingDonation = localStorage.getItem('pendingDonation')
      if (pendingDonation) {
        try {
          const { donationData: savedData } = JSON.parse(pendingDonation)
          setDonationData(savedData)
          setCurrentStep(3) // Go to payment step
        } catch (error) {
          console.error('Error restoring donation data:', error)
        }
      }
    }
  }, [searchParams])

  useEffect(() => {
    // Skip this effect if we're restoring from pending donation
    const step = searchParams.get('step')
    if (step === 'complete') return
    
    const location = searchParams.get("location")
    if (location === "nursery" || location === "karaganda") {
      setDonationData((prev) => ({ ...prev, location }))
    }
  }, [searchParams])

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateDonationData = (data: Partial<DonationData>) => {
    setDonationData((prev) => ({ ...prev, ...data }))
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-background dark:from-emerald-950/20 dark:to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться на главную
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Посадить дерево</h1>
            <p className="text-muted-foreground">Сделайте вклад в восстановление лесов Казахстана</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <DonationSteps steps={STEPS} currentStep={currentStep} />

            <div className="mt-8">
              {currentStep === 0 && (
                <LocationStep
                  selectedLocation={donationData.location}
                  onLocationSelect={(location) => {
                    updateDonationData({ location })
                    handleNext()
                  }}
                />
              )}

              {currentStep === 1 && (
                <PackageStep
                  location={donationData.location!}
                  selectedPackage={donationData.packageType}
                  onPackageSelect={(packageType, treeCount, amount) => {
                    updateDonationData({ packageType, treeCount, amount })
                    handleNext()
                  }}
                  onBack={handleBack}
                />
              )}

              {currentStep === 2 && (
                <DonorInfoStep
                  donorInfo={donationData.donorInfo}
                  onSubmit={(donorInfo) => {
                    updateDonationData({ donorInfo })
                    handleNext()
                  }}
                  onBack={handleBack}
                />
              )}

              {currentStep === 3 && <PaymentStep donationData={donationData} onBack={handleBack} />}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
