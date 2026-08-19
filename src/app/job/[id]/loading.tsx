import { Skeleton } from "@/components/ui/Skeleton";

export default function JobDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 mb-24 sm:mb-12 animate-pulse">
      
      {/* 1. Top Breadcrumb Skeleton */}
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-40 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>

      {/* 2. Hero Header Card Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        
        {/* Title & Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shrink-0" />
            
            <div className="space-y-2 flex-1 w-full">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-full" />
              </div>
              <Skeleton className="h-8 sm:h-9 w-3/4 max-w-md rounded-xl" />
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
            <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
          </div>
        </div>

        {/* Metadata Strip Skeleton */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Skeleton className="h-8 w-36 rounded-xl" />
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>

        {/* Action Row Skeleton */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Skeleton className="h-4 w-64 rounded-md" />
          <Skeleton className="hidden sm:block h-11 w-40 rounded-xl" />
        </div>

      </div>

      {/* 3. Main Grid Body Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Description Card Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
            <Skeleton className="h-6 w-52 rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-11/12 rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <Skeleton className="h-5 w-44 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-4/5 rounded" />
              </div>
            </div>
          </div>

          {/* Security Notice Skeleton */}
          <div className="rounded-2xl bg-amber-50/70 border border-amber-200/70 p-5 space-y-2">
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="h-3 w-full rounded" />
          </div>

        </div>

        {/* Right Sidebar (Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Company Profile Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <Skeleton className="h-3 w-32 rounded" />
            <div className="flex items-start gap-3.5">
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>

          {/* Related Jobs Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 4. Mobile Sticky Bottom Action Bar Skeleton */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 border-t border-slate-200/80 p-3 flex flex-row gap-2 z-50">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
        <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
      </div>

    </div>
  );
}
