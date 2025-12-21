import { Check } from "lucide-react"

interface DonationStepsProps {
  steps: string[]
  currentStep: number
}

export function DonationSteps({ steps, currentStep }: DonationStepsProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 relative">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  index < currentStep
                    ? "bg-primary border-primary text-background-dark"
                    : index === currentStep
                      ? "bg-primary border-primary text-background-dark"
                      : "bg-background border-border text-foreground/40"
                }`}
              >
                {index < currentStep ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
              </div>
              <div className="mt-2 text-sm font-medium text-center hidden md:block text-foreground/60">{step}</div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 transition-all ${
                  index < currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
