import prisma from "@/lib/prisma";
import { 
  Briefcase, 
  MapPin, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import JobActionButtons from "../../JobActionButtons";
import ActiveJobsNativeTable from "./ActiveJobsNativeTable";

export default async function ActiveJobsPage() {
  // Ambil lowongan yang aktif (status: approved)
  const activeJobs = await prisma.job.findMany({
    where: { status: 'approved' },
    include: { company: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Lowongan Aktif
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar semua lowongan pekerjaan yang saat ini sedang tayang dan aktif.
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 p-4 sm:p-6 bg-gray-50/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Total:</span>
            <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
              {activeJobs.length} Lowongan
            </span>
          </div>
        </div>

        {/* Native Table Implementation with Sorting/Searching */}
        <ActiveJobsNativeTable activeJobs={activeJobs} />
        
      </div>
    </div>
  );
}
