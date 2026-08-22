"use client";

import { useState, useMemo } from "react";
import { 
  Flag, 
  Search, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Eye, 
  Trash2, 
  Check, 
  X, 
  RotateCcw, 
  Briefcase, 
  MapPin, 
  Filter,
  ShieldAlert,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { 
  updateReportStatusAction, 
  deleteReportAction, 
  type JobReportItem 
} from "@/app/actions/report";
import { deleteJobAction } from "@/app/actions/job";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";

interface ReportsNativeTableProps {
  initialReports: JobReportItem[];
}

export default function ReportsNativeTable({ initialReports }: ReportsNativeTableProps) {
  const [reports, setReports] = useState<JobReportItem[]>(initialReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reasonFilter, setReasonFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Modals state
  const [selectedReport, setSelectedReport] = useState<JobReportItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteReportOpen, setIsDeleteReportOpen] = useState(false);
  const [isDeleteJobOpen, setIsDeleteJobOpen] = useState(false);
  const [actionTargetReport, setActionTargetReport] = useState<JobReportItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract unique reasons for filter dropdown
  const uniqueReasons = useMemo(() => {
    const set = new Set<string>();
    reports.forEach((r) => {
      if (r.reason) set.add(r.reason);
    });
    return Array.from(set).sort();
  }, [reports]);

  // Handle Sort
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") setSortDirection("desc");
      else {
        setSortKey("createdAt");
        setSortDirection("desc");
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortKey !== columnKey) return <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />;
    return sortDirection === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-primary" /> : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
  };

  // Filtered & Sorted Reports
  const processedReports = useMemo(() => {
    let result = [...reports];

    // 1. Status Filter
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    // 2. Reason Filter
    if (reasonFilter !== "all") {
      result = result.filter((r) => r.reason === reasonFilter);
    }

    // 3. Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => {
        const jobTitle = (r.job?.title || "").toLowerCase();
        const companyName = (r.job?.company?.name || "").toLowerCase();
        const reason = (r.reason || "").toLowerCase();
        const details = (r.details || "").toLowerCase();
        return jobTitle.includes(q) || companyName.includes(q) || reason.includes(q) || details.includes(q);
      });
    }

    // 4. Sorting
    result.sort((a, b) => {
      let valA: any = a[sortKey as keyof JobReportItem];
      let valB: any = b[sortKey as keyof JobReportItem];

      if (sortKey === "job.title") {
        valA = a.job?.title || "";
        valB = b.job?.title || "";
      }

      if (valA == null && valB == null) return 0;
      if (valA == null) return sortDirection === "asc" ? 1 : -1;
      if (valB == null) return sortDirection === "asc" ? -1 : 1;

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [reports, searchQuery, statusFilter, reasonFilter, sortKey, sortDirection]);

  // Action: Toggle Status
  const handleToggleStatus = async (reportId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "resolved" ? "pending" : "resolved";
    setIsProcessing(true);
    try {
      const res = await updateReportStatusAction(reportId, nextStatus);
      if (res.success) {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, status: nextStatus } : r))
        );
        if (selectedReport?.id === reportId) {
          setSelectedReport((prev) => (prev ? { ...prev, status: nextStatus } : null));
        }
        toast.success(
          nextStatus === "resolved"
            ? "Laporan ditandai selesai ditindaklanjuti."
            : "Laporan dikembalikan ke status Menunggu Tindak Lanjut."
        );
      } else {
        toast.error(res.error || "Gagal mengubah status laporan");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Confirm Delete Report
  const handleConfirmDeleteReport = async () => {
    if (!actionTargetReport) return;
    setIsProcessing(true);
    try {
      const res = await deleteReportAction(actionTargetReport.id);
      if (res.success) {
        setReports((prev) => prev.filter((r) => r.id !== actionTargetReport.id));
        setIsDeleteReportOpen(false);
        if (selectedReport?.id === actionTargetReport.id) {
          setIsDetailOpen(false);
          setSelectedReport(null);
        }
        toast.success("Laporan berhasil dihapus.");
      } else {
        toast.error(res.error || "Gagal menghapus laporan");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem saat menghapus");
    } finally {
      setIsProcessing(false);
      setActionTargetReport(null);
    }
  };

  // Action: Confirm Delete Reported Job
  const handleConfirmDeleteJob = async () => {
    if (!actionTargetReport || !actionTargetReport.jobId) return;
    setIsProcessing(true);
    try {
      const res = await deleteJobAction(actionTargetReport.jobId);
      if (res.success) {
        // Hapus juga laporan yang terkait dengan lowongan tersebut
        setReports((prev) => prev.filter((r) => r.jobId !== actionTargetReport.jobId));
        setIsDeleteJobOpen(false);
        if (selectedReport?.jobId === actionTargetReport.jobId) {
          setIsDetailOpen(false);
          setSelectedReport(null);
        }
        toast.success("Lowongan bermasalah berhasil dihapus permanen dari sistem.");
      } else {
        toast.error(res.error || "Gagal menghapus lowongan");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsProcessing(false);
      setActionTargetReport(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getReasonBadgeClass = (reason: string) => {
    const lower = reason.toLowerCase();
    if (lower.includes("scam") || lower.includes("penipuan") || lower.includes("pungutan") || lower.includes("biaya")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (lower.includes("sara") || lower.includes("diskriminasi")) {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }
    if (lower.includes("palsu") || lower.includes("hoax")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. FILTER & SEARCH TOOLBAR */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari lowongan, perusahaan, alasan, atau isi laporan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-8 bg-white border border-slate-200/90 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 justify-between sm:justify-end">
          
          {/* Status Filter */}
          <div className="flex items-center bg-white border border-slate-200/90 rounded-xl p-1 shadow-2xs text-xs font-bold">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === "all"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Semua ({reports.length})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === "pending"
                  ? "bg-amber-500 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Pending ({reports.filter((r) => r.status === "pending").length})
            </button>
            <button
              onClick={() => setStatusFilter("resolved")}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === "resolved"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Selesai ({reports.filter((r) => r.status === "resolved").length})
            </button>
          </div>

          {/* Reason Filter Dropdown */}
          {uniqueReasons.length > 0 && (
            <div className="relative">
              <select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
                className="h-10 pl-3.5 pr-8 bg-white border border-slate-200/90 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-primary appearance-none cursor-pointer shadow-2xs"
              >
                <option value="all">Semua Kategori Alasan</option>
                {uniqueReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* 2. REPORTS TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200/90 font-mono uppercase text-[11px] tracking-wider">
            <tr>
              <th
                scope="col"
                className="px-5 py-3.5 font-bold cursor-pointer select-none group hover:text-slate-900 transition-colors"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Waktu Laporan</span>
                  <SortIcon columnKey="createdAt" />
                </div>
              </th>
              <th
                scope="col"
                className="px-5 py-3.5 font-bold cursor-pointer select-none group hover:text-slate-900 transition-colors"
                onClick={() => handleSort("job.title")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Lowongan Terlapor</span>
                  <SortIcon columnKey="job.title" />
                </div>
              </th>
              <th
                scope="col"
                className="px-5 py-3.5 font-bold cursor-pointer select-none group hover:text-slate-900 transition-colors"
                onClick={() => handleSort("reason")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Alasan &amp; Keterangan</span>
                  <SortIcon columnKey="reason" />
                </div>
              </th>
              <th
                scope="col"
                className="px-5 py-3.5 font-bold cursor-pointer select-none group hover:text-slate-900 transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  <SortIcon columnKey="status" />
                </div>
              </th>
              <th scope="col" className="px-5 py-3.5 font-bold text-right">
                Tindakan
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {processedReports.length > 0 ? (
              processedReports.map((report) => {
                const isPending = report.status === "pending";
                return (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Waktu */}
                    <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{formatDate(report.createdAt)}</span>
                      </div>
                    </td>

                    {/* Lowongan & Perusahaan */}
                    <td className="px-5 py-4 min-w-[220px] max-w-xs">
                      <div className="space-y-1">
                        <Link
                          href={`/job/${report.jobId}`}
                          target="_blank"
                          className="font-extrabold text-slate-900 hover:text-primary transition-colors line-clamp-1 flex items-center gap-1 group/link"
                        >
                          <span className="truncate">{report.job?.title || "Lowongan #" + report.jobId}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-primary shrink-0" />
                        </Link>

                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{report.job?.company?.name || "Perusahaan"}</span>
                          {report.job?.category && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              {report.job.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Alasan & Keterangan */}
                    <td className="px-5 py-4 max-w-sm">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getReasonBadgeClass(
                            report.reason
                          )}`}
                        >
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{report.reason}</span>
                        </span>

                        {report.details ? (
                          <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                            {report.details}
                          </p>
                        ) : (
                          <p className="text-slate-400 italic text-[11px]">Tanpa keterangan tambahan</p>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {isPending ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/90 shadow-2xs">
                          <Clock className="w-3 h-3" />
                          <span>Perlu Tindak Lanjut</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-2xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Selesai Ditangani</span>
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Quick Toggle Status Button */}
                        <button
                          onClick={() => handleToggleStatus(report.id, report.status)}
                          disabled={isProcessing}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all shadow-2xs cursor-pointer disabled:opacity-50 ${
                            isPending
                              ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                          }`}
                          title={isPending ? "Tandai Laporan Selesai" : "Kembalikan ke Pending"}
                        >
                          {isPending ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="hidden sm:inline">Selesai</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                              <span className="hidden sm:inline">Reopen</span>
                            </>
                          )}
                        </button>

                        {/* View Detail Modal Button */}
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setIsDetailOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                          title="Lihat Detail Laporan"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Delete Report Button */}
                        <button
                          onClick={() => {
                            setActionTargetReport(report);
                            setIsDeleteReportOpen(true);
                          }}
                          disabled={isProcessing}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                          title="Hapus Laporan Ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-14 text-center">
                  <div className="max-w-xs mx-auto flex flex-col items-center justify-center text-center space-y-3">
                    {searchQuery || statusFilter !== "all" || reasonFilter !== "all" ? (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center shadow-2xs">
                          <Search className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 text-sm">Tidak ada laporan yang cocok</p>
                          <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter status Anda.</p>
                        </div>
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                            setReasonFilter("all");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                        >
                          Reset Filter
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-2xs">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">Semua Aman!</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Belum ada laporan lowongan mencurigakan atau bermasalah yang masuk dari pencari kerja.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. MODAL DETAIL LAPORAN */}
      {isDetailOpen && selectedReport && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-lg p-0 overflow-hidden border border-slate-200/90 rounded-3xl">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-extrabold text-slate-900 leading-snug">
                    Detail Laporan Lowongan
                  </DialogTitle>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID Laporan: {selectedReport.id}
                  </p>
                </div>
              </div>

              {selectedReport.status === "pending" ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                  Pending
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Selesai
                </span>
              )}
            </div>

            {/* Body Content */}
            <div className="p-6 space-y-5 text-left text-xs max-h-[70vh] overflow-y-auto">
              
              {/* Alasan Laporan Card */}
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-rose-800 font-extrabold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Kategori Alasan: {selectedReport.reason}</span>
                </div>
                <div className="text-slate-700 text-xs leading-relaxed pl-5 whitespace-pre-wrap">
                  {selectedReport.details || <span className="italic text-slate-400">Tidak ada keterangan tertulis dari pelapor.</span>}
                </div>
                <div className="text-[10px] text-slate-400 pl-5 pt-1">
                  Dilaporkan pada {formatDate(selectedReport.createdAt)}
                </div>
              </div>

              {/* Lowongan Terkait Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                  Informasi Lowongan Pekerjaan
                </span>
                
                <div className="space-y-1">
                  <div className="font-extrabold text-sm text-slate-900">
                    {selectedReport.job?.title || "Lowongan ID: " + selectedReport.jobId}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-xs">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold">{selectedReport.job?.company?.name || "Perusahaan"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {selectedReport.job?.location && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {selectedReport.job.location}
                    </span>
                  )}
                  {selectedReport.job?.category && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px]">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      {selectedReport.job.category}
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/job/${selectedReport.jobId}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline font-bold text-xs"
                  >
                    <span>Buka Halaman Lowongan Publik</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              
              {/* Tombol Hapus Lowongan Bermasalah (Kritis) */}
              <button
                onClick={() => {
                  setActionTargetReport(selectedReport);
                  setIsDeleteJobOpen(true);
                }}
                disabled={isProcessing}
                className="h-10 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Hapus Lowongan Permanen</span>
              </button>

              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="h-10 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs transition-all cursor-pointer"
                >
                  Tutup
                </button>

                <button
                  onClick={() => handleToggleStatus(selectedReport.id, selectedReport.status)}
                  disabled={isProcessing}
                  className={`h-10 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50 ${
                    selectedReport.status === "pending"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-slate-800 hover:bg-slate-900 text-white"
                  }`}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : selectedReport.status === "pending" ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Tandai Selesai</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Kembalikan ke Pending</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 4. MODAL KONFIRMASI HAPUS LAPORAN */}
      {isDeleteReportOpen && actionTargetReport && (
        <Dialog open={isDeleteReportOpen} onOpenChange={setIsDeleteReportOpen}>
          <DialogContent className="sm:max-w-md p-6 rounded-3xl text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-rose-200 shadow-2xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <DialogTitle className="text-base font-extrabold text-slate-900">
                Hapus Laporan Ini?
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 leading-relaxed">
                Laporan untuk lowongan <strong>{actionTargetReport.job?.title || actionTargetReport.jobId}</strong> akan dihapus dari daftar moderasi.
              </DialogDescription>
            </div>

            <DialogFooter className="flex gap-2.5 pt-2 sm:justify-center">
              <button
                type="button"
                onClick={() => setIsDeleteReportOpen(false)}
                disabled={isProcessing}
                className="h-10 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex-1 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteReport}
                disabled={isProcessing}
                className="h-10 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs flex-1 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus Laporan"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 5. MODAL KONFIRMASI HAPUS LOWONGAN BERMASALAH */}
      {isDeleteJobOpen && actionTargetReport && (
        <Dialog open={isDeleteJobOpen} onOpenChange={setIsDeleteJobOpen}>
          <DialogContent className="sm:max-w-md p-6 rounded-3xl text-center space-y-4 border-rose-200">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-rose-200 shadow-2xs">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <DialogTitle className="text-base font-extrabold text-slate-900">
                Hapus Lowongan Permanen?
              </DialogTitle>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 truncate">
                {actionTargetReport.job?.title || actionTargetReport.jobId}
              </div>
              <DialogDescription className="text-xs text-rose-600 font-medium leading-relaxed">
                Peringatan: Tindakan ini akan <strong>menghapus lowongan kerja secara permanen</strong> dari database dan website publik beserta seluruh data laporannya.
              </DialogDescription>
            </div>

            <DialogFooter className="flex gap-2.5 pt-2 sm:justify-center">
              <button
                type="button"
                onClick={() => setIsDeleteJobOpen(false)}
                disabled={isProcessing}
                className="h-10 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex-1 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteJob}
                disabled={isProcessing}
                className="h-10 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs flex-1 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus Lowongan"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
