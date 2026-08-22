import { getJobReportsAction, type JobReportItem } from "@/app/actions/report";
import { Flag, AlertTriangle, CheckCircle2, Clock, Briefcase } from "lucide-react";
import ReportsNativeTable from "./ReportsNativeTable";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Laporan Kendala Lowongan - Admin LokerTimika",
  description: "Moderasi dan tindak lanjut laporan lowongan mencurigakan atau bermasalah dari pencari kerja.",
};

export default async function ReportsAdminPage() {
  let reports: JobReportItem[] = [];
  try {
    reports = await getJobReportsAction();
  } catch (error) {
    console.error("Failed to load job reports on server:", error);
    reports = [];
  }

  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const resolvedReports = reports.filter((r) => r.status === "resolved").length;
  
  const uniqueReportedJobs = new Set(reports.map((r) => r.jobId)).size;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider font-mono">
            <Flag className="w-4 h-4" />
            <span>Pusat Moderasi &amp; Keamanan</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Laporan Kendala Lowongan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tinjau dan tindak lanjuti laporan dari pencari kerja terkait lowongan yang mencurigakan, penipuan, atau melanggar aturan.
          </p>
        </div>
      </div>

      {/* 2. STATS SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Total Laporan */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Laporan</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{totalReports}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shadow-2xs">
            <Flag className="w-5 h-5" />
          </div>
        </div>

        {/* Perlu Tindak Lanjut */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/90 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Perlu Tindak Lanjut</span>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-700">{pendingReports}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Selesai Ditangani */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200/90 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Selesai Ditangani</span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">{resolvedReports}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Lowongan Terlapor */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lowongan Terlapor</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{uniqueReportedJobs}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shadow-2xs">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. TABLE SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        <ReportsNativeTable initialReports={reports} />
      </div>
    </div>
  );
}
