import prisma from "@/lib/prisma";
import AllJobsNativeTable from "./AllJobsNativeTable";

export default async function AllJobsPage() {
  // Ambil semua lowongan tanpa memfilter status
  const allJobs = await prisma.job.findMany({
    include: { company: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Semua Lowongan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar keseluruhan lowongan pekerjaan yang ada di dalam sistem (semua status).
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        
        {/* Native Table Implementation with Sorting/Searching */}
        <AllJobsNativeTable jobs={allJobs} />
        
      </div>
    </div>
  );
}
