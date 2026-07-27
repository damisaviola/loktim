import prisma from "@/lib/prisma";
import { 
  Briefcase, 
  Building, 
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import PendingJobsNativeTable from "./PendingJobsNativeTable";

export default async function AdminDashboard() {
  // Hitung statistik
  const totalJobs = await prisma.job.count();
  const activeJobs = await prisma.job.count({ where: { status: "approved" } });
  const pendingJobsCount = await prisma.job.count({ where: { status: "pending" } }); 
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Pusat Kendali Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang Kembali 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Pantau statistik platform, tinjau permohonan lowongan, dan kelola mitra perusahaan.
          </p>
        </div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>
      </div>

      {/* Stats Widgets Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Widget 1: Total Lowongan */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Lowongan</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-2xs">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalJobs}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Keseluruhan lowongan terdaftar</p>
          </div>
        </div>

        {/* Widget 2: Lowongan Aktif */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lowongan Aktif</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{activeJobs}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Sedang tayang secara publik</p>
          </div>
        </div>

        {/* Widget 3: Menunggu Review */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Menunggu Review</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shadow-2xs">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{pendingJobsCount}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Perlu tindakan moderasi</p>
          </div>
        </div>

        {/* Widget 4: Total Perusahaan */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Perusahaan</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-2xs">
              <Building className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalCompanies}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Mitra penyedia kerja</p>
          </div>
        </div>

      </div>

      {/* Table Pending Approval Section */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-2xs overflow-hidden">
        
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Menunggu Persetujuan</h2>
              {pendingJobs.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-extrabold border border-amber-200">
                  {pendingJobs.length} Baru
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">Daftar lowongan pekerjaan yang memerlukan verifikasi admin sebelum diterbitkan.</p>
          </div>
        </div>

        {/* Native Table */}
        <PendingJobsNativeTable pendingJobs={pendingJobs} />
        
      </div>
    </div>
  );
}
