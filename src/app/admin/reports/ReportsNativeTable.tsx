"use client";

import { useTableSortAndSearch } from "@/hooks/useTableSortAndSearch";
import { Flag, Search, ArrowUpDown, ChevronDown, ChevronUp, AlertTriangle, Building2, CheckCircle2 } from "lucide-react";
import { ReportActionButtons } from "./ReportActionButtons";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

export default function ReportsNativeTable({ reports }: { reports: any[] }) {
  const {
    inputValue,
    setInputValue,
    sortKey,
    sortDirection,
    handleSort,
    processedData
  } = useTableSortAndSearch(
    reports,
    (report, query) => 
      (report.job?.title || "").toLowerCase().includes(query) || 
      (report.job?.company?.name || "").toLowerCase().includes(query) ||
      report.reason.toLowerCase().includes(query)
  );

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortKey !== columnKey) return <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Cari lowongan atau perusahaan..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-9 bg-white border-gray-200 shadow-sm focus-visible:ring-primary/20"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-200">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 font-medium cursor-pointer select-none group hover:text-gray-900 transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-1.5">
                  Waktu <SortIcon columnKey="createdAt" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 font-medium cursor-pointer select-none group hover:text-gray-900 transition-colors"
                onClick={() => handleSort('job.title')}
              >
                <div className="flex items-center gap-1.5">
                  Pekerjaan <SortIcon columnKey="job.title" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 font-medium cursor-pointer select-none group hover:text-gray-900 transition-colors"
                onClick={() => handleSort('reason')}
              >
                <div className="flex items-center gap-1.5">
                  Alasan & Detail <SortIcon columnKey="reason" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 font-medium cursor-pointer select-none group hover:text-gray-900 transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1.5">
                  Status <SortIcon columnKey="status" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {processedData.length > 0 ? (
              processedData.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(report.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/job/${report.jobId}`} target="_blank" className="font-bold text-primary hover:underline line-clamp-1">
                      {report.job?.title || "Lowongan tidak ditemukan"}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                      <Building2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">{report.job?.company?.name || "-"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="inline-flex items-center gap-1.5 font-semibold text-destructive mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {report.reason}
                    </div>
                    <p className="text-gray-500 text-xs line-clamp-2">
                      {report.details || <span className="italic">Tidak ada detail tambahan</span>}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      report.status === 'resolved' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      {report.status === 'resolved' ? 'Selesai' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <ReportActionButtons report={report} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    {inputValue ? (
                       <>
                         <Search className="h-10 w-10 text-gray-300 mb-3" />
                         <p className="font-medium text-gray-900">Pencarian tidak ditemukan</p>
                       </>
                    ) : (
                       <>
                         <CheckCircle2 className="h-10 w-10 text-gray-300 mb-3" />
                         <p className="font-medium text-gray-900">Semua Aman!</p>
                         <p className="text-sm mt-1">Belum ada laporan lowongan bermasalah yang masuk saat ini.</p>
                       </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
