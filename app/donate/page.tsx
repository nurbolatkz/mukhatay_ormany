"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { DonationSteps } from "@/components/donation/donation-steps"
import { LocationStep } from "@/components/donation/location-step"
import { TreeCountStep } from "@/components/donation/tree-count-step"
import { DonorInfoStep } from "@/components/donation/donor-info-step"
import { PaymentStep } from "@/components/donation/payment-step"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import apiService from "@/services/api"

export type Location = string

export interface DonationData {
  location: Location | null
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

const STEPS = ["Количество деревьев", "Оплата"]

// Separate component that uses useSearchParams
function DonateContent({}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [donationData, setDonationData] = useState<DonationData>({
    location: null, // Will be set to a random location
    treeCount: 1,
    amount: 999,
    donorInfo: {
      fullName: "Анонимный пользователь",
      email: "anonymous@example.com",
      phone: "",
      companyName: "",
      message: "",
      subscribeUpdates: false,
    },
  })

  // Check for pending donation data when component mounts
  useEffect(() => {
    // Check if user is returning from a payment attempt
    const checkPaymentReturn = async () => {
      const lastDonationId = localStorage.getItem('lastDonationId')
      if (lastDonationId) {
        try {
          const status = await apiService.getDonationStatus(lastDonationId) as any
          if (status.status === 'completed') {
            // If already paid, redirect to success page
            router.replace(`/payment/success?donation_id=${lastDonationId}`)
            return
          }
        } catch (e) {
          console.error("Error checking last donation status", e)
        }
      }

      const step = searchParams.get('step')
      if (step === 'complete') {
        const pendingDonation = localStorage.getItem('pendingDonation')
        if (pendingDonation) {
          try {
            const { donationData: savedData } = JSON.parse(pendingDonation)
            setDonationData(savedData)
            setCurrentStep(2) // Go to payment step
          } catch (error) {
            console.error('Error restoring donation data:', error)
          }
        }
      }
    }

    checkPaymentReturn()
  }, [searchParams, router])

  // Fetch locations and select one randomly
  useEffect(() => {
    const fetchRandomLocation = async () => {
      try {
        const locations = await apiService.getLocations();
        
        // Select a random location
        const randomIndex = Math.floor(Math.random() * locations.length);
        const randomLocation = locations[randomIndex].id;
        
        setDonationData(prev => ({ ...prev, location: randomLocation }));
      } catch (error) {
        console.error('Error fetching locations:', error);
        // Fallback to default location
        setDonationData(prev => ({ ...prev, location: "loc_karaganda_002" }));
      }
    };

    if (!donationData.location) {
      fetchRandomLocation();
    }
  }, [donationData.location]);

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
    <>
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
            <TreeCountStep
              location={donationData.location!}
              treeCount={donationData.treeCount}
              amount={donationData.amount}
              onTreeCountChange={(treeCount, amount) => {
                updateDonationData({ treeCount, amount })
              }}
              onNext={handleNext}
              onBack={() => router.push('/')}
            />
          )}

          {currentStep === 1 && <PaymentStep donationData={donationData} onBack={handleBack} />}
        </div>
      </div>
    </>
  )
}

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-background dark:from-background-dark dark:to-background">
      <div className="container mx-auto px-4 py-8">
        <DonateContent />
      </div>
    </div>
  )
}