import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-background dark:from-emerald-950/20 dark:to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex-1 text-center">
                <Skeleton className="h-10 w-full mx-2" />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}