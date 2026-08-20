import { Skeleton } from "@/components/ui/Skeleton";
import { JobCardSkeleton } from "@/components/JobCardSkeleton";

export default function JobsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. Top Search Bar Skeleton */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Keyword Search Field Card */}
          <div className="flex-1 w-full bg-white rounded-2xl border-2 border-slate-200/90 shadow-xs flex items-center px-4 sm:px-5 h-14 sm:h-16">
            <Skeleton className="w-6 h-6 rounded-full mr-3.5 shrink-0" />
            <Skeleton className="h-5 w-3/4 max-w-sm rounded-md" />
          </div>

          {/* External Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto">
            <Skeleton className="h-11 w-24 rounded-xl lg:hidden shrink-0" />
            <Skeleton className="h-11 flex-1 sm:flex-none sm:w-36 rounded-xl shrink-0" />
          </div>
        </div>
      </div>

      {/* 2. Category Chips Skeleton */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-center gap-2 min-w-max">
          {[
            'w-20',
            'w-32',
            'w-40',
            'w-36',
            'w-28',
            'w-28',
            'w-28',
            'w-32',
            'w-28',
            'w-36',
          ].map((w, i) => (
            <Skeleton key={i} className={`h-9 ${w} rounded-xl`} />
          ))}
        </div>
      </div>

      {/* 3. Main Workspace: Filter Sidebar + 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Filter Sidebar Skeleton (Col 3) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-5 sticky top-24">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-5">
            
            {/* Filter Title */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
            </div>

            {/* Urutan */}
            <div>
              <Skeleton className="h-3 w-16 rounded mb-2" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-8 w-full rounded-xl" />
                <Skeleton className="h-8 w-full rounded-xl" />
              </div>
            </div>

            {/* Tipe Pekerjaan */}
            <div className="border-t border-slate-100 pt-4">
              <Skeleton className="h-3 w-24 rounded mb-2" />
              <div className="flex flex-wrap gap-1.5">
                <Skeleton className="h-7 w-16 rounded-xl" />
                <Skeleton className="h-7 w-20 rounded-xl" />
                <Skeleton className="h-7 w-18 rounded-xl" />
                <Skeleton className="h-7 w-16 rounded-xl" />
                <Skeleton className="h-7 w-18 rounded-xl" />
                <Skeleton className="h-7 w-20 rounded-xl" />
              </div>
            </div>

            {/* Pendidikan Minimal */}
            <div className="border-t border-slate-100 pt-4">
              <Skeleton className="h-3 w-28 rounded mb-2" />
              <div className="flex flex-wrap gap-1.5">
                <Skeleton className="h-7 w-16 rounded-xl" />
                <Skeleton className="h-7 w-20 rounded-xl" />
                <Skeleton className="h-7 w-14 rounded-xl" />
                <Skeleton className="h-7 w-14 rounded-xl" />
                <Skeleton className="h-7 w-14 rounded-xl" />
              </div>
            </div>

            {/* Pengalaman Kerja */}
            <div className="border-t border-slate-100 pt-4">
              <Skeleton className="h-3 w-20 rounded mb-2" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-7 w-full rounded-xl" />
                <Skeleton className="h-7 w-full rounded-xl" />
                <Skeleton className="h-7 w-full rounded-xl" />
                <Skeleton className="h-7 w-full rounded-xl" />
                <Skeleton className="h-7 w-full rounded-xl" />
              </div>
            </div>

          </div>
        </aside>

        {/* Right Feed Skeleton (Col 9) */}
        <main className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between px-1">
            <Skeleton className="h-4 w-52 rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </main>

      </div>

    </div>
  );
}

