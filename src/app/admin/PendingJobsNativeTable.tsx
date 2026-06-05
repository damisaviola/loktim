"use client";

import { useTableSortAndSearch } from "@/hooks/useTableSortAndSearch";
import { CheckCircle2, Search, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import JobActionButtons from "./JobActionButtons";
import { Input } from "@/components/ui/Input";

export default function PendingJobsNativeTable({ pendingJobs }: { pendingJobs: any[] }) {
  const {
    inputValue,
    setInputValue,
    sortKey,
    sortDirection,
    handleSort,
    processedData
  } = useTableSortAndSearch(
    pendingJobs,
    (job, query) => 
      job.title.toLowerCase().includes(query) || 
      (job.company?.name || "").toLowerCase().includes(query) ||
      job.category.toLowerCase().includes(query)
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
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-1.5">
                  Posisi <SortIcon columnKey="title" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 font-medium cursor-pointer select-none group hover:text-gray-900 transition-colors"
                onClick={() => handleSort('company.name')}
              >
                <div className="flex items-center gap-1.5">
                  Perusahaan <SortIcon columnKey="company.name" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 font-medium cursor-pointer select-none group hover:text-gray-900 transition-colors"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1.5">
                  Kategori <SortIcon columnKey="category" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 font-medium">Status</th>
              <th scope="col" className="px-6 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {processedData.length > 0 ? (
              processedData.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{job.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{job.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {job.company?.logoUrl ? (
                        <img 
                          src={job.company.logoUrl} 
                          alt={job.company.name} 
                          className="h-8 w-8 rounded bg-gray-100 object-cover border border-gray-200" 
                        />
                      ) : (
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {job.company?.name?.charAt(0) || "?"}
                        </div>
                      )}
                      <span className="font-medium">{job.company?.name || "Tidak diketahui"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-1.5">
                      {job.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 border border-blue-200">
                          Menunggu Approval
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600 border border-emerald-200">
                          Aktif
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <JobActionButtons job={job} />
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
                         <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-3 opacity-50" />
                         <p className="font-medium text-gray-900">Semua Beres!</p>
                         <p className="text-sm mt-1">Tidak ada lowongan yang menunggu persetujuan saat ini.</p>
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
