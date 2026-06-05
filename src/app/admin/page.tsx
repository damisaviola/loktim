import prisma from "@/lib/prisma";
import { 
  Briefcase, 
  Building, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import JobActionButtons from "./JobActionButtons";
import PendingJobsNativeTable from "./PendingJobsNativeTable";

export default async function AdminDashboard() {
  // Hitung statistik
  const totalJobs = await prisma.job.count();
  const activeJobs = await prisma.job.count({ where: { status: "approved" } });
  // We don't have an explicit expired status, assuming pending or rejected as the rest,
  // but let's just count rejected as expired for now, or just pending
  const expiredJobs = await prisma.job.count({ where: { status: "rejected" } }); 
  const totalCompanies = await prisma.company.count();

  // Ambil lowongan yang menunggu approval
  const pendingJobs = await prisma.job.findMany({
    where: { status: 'pending' },
    include: { company: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Widget 1: Total Lowongan */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Total Lowongan</p>
              <p className="text-3xl font-bold tracking-tight text-gray-900">{totalJobs}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Keseluruhan lowongan</span>
          </div>
        </div>

        {/* Widget 2: Lowongan Aktif */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Lowongan Aktif</p>
              <p className="text-3xl font-bold tracking-tight text-gray-900">{activeJobs}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Sedang menerima lamaran</span>
          </div>
        </div>

        {/* Widget 3: Lowongan Ditolak */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Lowongan Ditolak</p>
              <p className="text-3xl font-bold tracking-tight text-gray-900">{expiredJobs}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Ditolak / Kadaluarsa</span>
          </div>
        </div>

        {/* Widget 4: Total Perusahaan */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Total Perusahaan</p>
              <p className="text-3xl font-bold tracking-tight text-gray-900">{totalCompanies}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-600">
              <Building className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Mitra terdaftar di platform</span>
          </div>
        </div>
      </div>

      {/* Table Pending Approval Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        
        {/* Table Header Area */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-gray-900">Menunggu Persetujuan</h2>
            <p className="text-sm text-gray-500">Daftar lowongan pekerjaan yang perlu ditinjau dan disetujui.</p>
          </div>
        </div>

        {/* Native Table Implementation with Sorting/Searching */}
        <PendingJobsNativeTable pendingJobs={pendingJobs} />
        
      </div>
    </div>
  );
}

