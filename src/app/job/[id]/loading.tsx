import { Skeleton } from "@/components/ui/Skeleton";

export default function JobDetailLoading() {
  return (
    <div className="container mx-auto px-4 lg:px-0 max-w-[1128px] mt-4 mb-24 sm:mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Job Details Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {/* Header Banner */}
            <div className="h-24 sm:h-32 bg-secondary relative">
              <div className="absolute -bottom-8 sm:-bottom-10 left-4 sm:left-6 w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-white rounded-md overflow-hidden shadow-sm flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            </div>

            <div className="pt-12 sm:pt-14 px-4 sm:px-6 pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="w-full">
                  <Skeleton className="h-6 sm:h-8 w-3/4 max-w-[400px]" />
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    <Skeleton className="h-4 w-32" />
                    <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                    <Skeleton className="h-4 w-40" />
                  </div>

                  {/* Tags row skeleton */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Skeleton className="h-5 w-24" />
                    <span className="text-muted-foreground/30">•</span>
                    <Skeleton className="h-5 w-28" />
                    <span className="text-muted-foreground/30">•</span>
                    <Skeleton className="h-5 w-20" />
                    <span className="text-muted-foreground/30">•</span>
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
              </div>

              {/* Desktop action buttons skeleton */}
              <div className="mt-8 hidden sm:flex flex-row gap-3 w-full">
                <Skeleton className="h-12 flex-1 rounded-full" />
                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
              </div>
            </div>

            <hr className="border-border" />

            <div className="p-4 sm:p-6 space-y-4">
              <Skeleton className="h-6 w-48 mb-4" />
              
              <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <Skeleton className="h-5 w-40 mb-3" />
              <div className="space-y-2 pl-5">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Left - Company info & Ads Skeleton */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card rounded-lg border border-border p-4 sm:p-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 shrink-0 border border-border bg-white" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-9 w-full rounded-md mt-4" />
          </div>

          <div className="bg-card rounded-lg border border-border p-4 sm:p-6 space-y-4">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              <div className="flex gap-3">
                <Skeleton className="w-10 h-10 rounded-sm shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <div className="flex gap-3">
                <Skeleton className="w-10 h-10 rounded-sm shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sticky Bottom Action Bar Skeleton */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex flex-row gap-2 z-50">
        <Skeleton className="h-12 flex-1 rounded-full" />
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
      </div>
    </div>
  );
}
