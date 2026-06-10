import { Skeleton } from "@/components/ui/Skeleton";
import { Plus, Briefcase, Award, Building2 } from "lucide-react";

export default function PostLoadingSkeleton() {
  return (
    <div className="container mx-auto px-0 sm:px-4 py-0 sm:py-10 max-w-[900px]">
      <div className="bg-background sm:bg-transparent overflow-hidden flex flex-col min-h-[100dvh] sm:min-h-0 sm:gap-6">
        
        {/* HEADER BANNER SKELETON */}
        <div className="relative p-8 sm:p-12 sm:rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#312e81] shadow-xl shadow-blue-900/10">
          <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
              <Skeleton className="w-3.5 h-3.5 bg-white/20" />
              <Skeleton className="w-24 h-4 bg-white/20" />
            </div>
            
            <div className="space-y-3 mb-6">
              <Skeleton className="h-10 sm:h-12 w-[80%] max-w-[400px] bg-white/20 rounded-xl" />
              <Skeleton className="h-10 sm:h-12 w-[60%] max-w-[300px] bg-white/20 rounded-xl" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-5 sm:h-6 w-[90%] max-w-[500px] bg-white/10 rounded-lg" />
              <Skeleton className="h-5 sm:h-6 w-[70%] max-w-[400px] bg-white/10 rounded-lg" />
            </div>
          </div>
        </div>

        {/* MAIN FORM SKELETON */}
        <div className="flex flex-col gap-6 p-4 sm:p-0">

          {/* Section 1: Informasi Pekerjaan */}
          <div className="bg-card border border-border/60 sm:rounded-[1.5rem] p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border/40">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-300 dark:text-blue-800 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/30">
                <Briefcase className="w-7 h-7" />
              </div>
              <div>
                <Skeleton className="h-7 w-48 mb-2 rounded-md" />
                <Skeleton className="h-4 w-64 rounded-md" />
              </div>
            </div>

            <div className="space-y-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 rounded-md" />
                  <Skeleton className="w-full h-14 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="w-full h-14 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36 rounded-md" />
                  <Skeleton className="w-full h-14 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40 rounded-md" />
                  <Skeleton className="w-full h-14 rounded-xl" />
                </div>
              </div>

              <div className="space-y-3">
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="w-full sm:w-48 h-14 rounded-xl" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="w-full h-32 rounded-xl" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="w-full h-32 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Section 2: Kualifikasi */}
          <div className="bg-card border border-border/60 sm:rounded-[1.5rem] p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border/40">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-300 dark:text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/30">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <Skeleton className="h-7 w-48 mb-2 rounded-md" />
                <Skeleton className="h-4 w-64 rounded-md" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-32 rounded-md" />
                  <Skeleton className="w-full h-14 rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Perusahaan & Kontak */}
          <div className="bg-card border border-border/60 sm:rounded-[1.5rem] p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border/40">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-300 dark:text-orange-800 flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-800/30">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <Skeleton className="h-7 w-56 mb-2 rounded-md" />
                <Skeleton className="h-4 w-64 rounded-md" />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="w-full h-14 rounded-xl" />
              </div>

              <div className="bg-secondary/10 p-5 rounded-2xl border border-border/50 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40 rounded-md" />
                    <Skeleton className="w-full h-14 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36 rounded-md" />
                    <Skeleton className="w-full h-14 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-44 rounded-md" />
                  <Skeleton className="w-full h-24 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 rounded-md" />
                  <Skeleton className="w-full h-14 rounded-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS SKELETON */}
          <div className="sticky bottom-0 sm:bottom-6 z-50 bg-card/80 backdrop-blur-xl p-4 sm:p-5 border-t border-border/60 sm:border sm:rounded-2xl mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-3">
            <Skeleton className="hidden md:block h-5 w-64 mr-auto rounded-md" />
            <Skeleton className="w-full sm:w-24 h-12 rounded-xl" />
            <Skeleton className="w-full sm:w-48 h-12 rounded-xl" />
          </div>

        </div>
      </div>
    </div>
  );
}
