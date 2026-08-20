import { Skeleton } from "@/components/ui/Skeleton";

export default function PostLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/70 pb-32 sm:pb-24 animate-pulse">
      
      {/* 1. HERO HEADER BANNER SKELETON */}
      <div className="relative overflow-hidden bg-slate-900 pt-10 pb-16 sm:py-16 text-white shadow-xs">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-3.5 flex flex-col items-center">
          <Skeleton className="h-6 w-48 rounded-full bg-slate-800" />
          <Skeleton className="h-9 sm:h-11 w-3/4 max-w-md rounded-xl bg-slate-800" />
          <Skeleton className="h-4 w-full max-w-lg rounded-md bg-slate-800" />
          <div className="pt-2 flex items-center gap-3">
            <Skeleton className="h-6 w-36 rounded-full bg-slate-800" />
            <Skeleton className="h-6 w-36 rounded-full bg-slate-800" />
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTAINER & STEPPER */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 -mt-7 relative z-20 space-y-6">
        
        {/* Stepper Skeleton */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            {[1, 2, 3].map((s, idx) => (
              <div key={s} className="flex items-center gap-2.5 flex-1">
                {idx > 0 && <Skeleton className="h-0.5 flex-1 mx-2" />}
                <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                <div className="hidden sm:block space-y-1">
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton className="h-2 w-16 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card Skeleton */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4 space-y-2">
            <Skeleton className="h-3 w-32 rounded" />
            <Skeleton className="h-6 w-56 rounded-lg" />
            <Skeleton className="h-3.5 w-3/4 max-w-md rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-3 w-32 rounded" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-3 w-40 rounded" />
            <Skeleton className="h-44 w-full rounded-xl" />
          </div>
        </div>

      </div>

    </div>
  );
}
