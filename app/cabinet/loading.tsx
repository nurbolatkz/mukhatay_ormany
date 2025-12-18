import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar skeleton */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        
        {/* Main content skeleton */}
        <div className="flex-1">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}