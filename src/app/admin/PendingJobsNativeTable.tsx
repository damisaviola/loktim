"use client";

import { useTableSortAndSearch } from "@/hooks/useTableSortAndSearch";
import { CheckCircle2, Search, ArrowUpDown, ChevronDown, ChevronUp, Briefcase, MapPin, Building } from "lucide-react";
import Image from "next/image";
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
    if (sortKey !== columnKey) return <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity inline-block ml-1" />;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 text-primary inline-block ml-1" /> : <ChevronDown className="w-4 h-4 text-primary inline-block ml-1" />;
  };

  return (
    <div className="w-full">
      {/* Search Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari posisi, perusahaan, atau kategori..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-10 h-10 bg-white border-slate-200/80 rounded-xl text-xs font-semibold focus-visible:ring-primary/20"
          />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Hasil:</span>
          <span className="inline-flex items-center justify-center rounded-full bg-slate-200/60 px-2.5 py-0.5 text-xs font-extrabold text-slate-700">
            {processedData.length}
          </span>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[11px] font-extrabold border-b border-slate-100 select-none">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3.5 cursor-pointer group hover:text-slate-900 transition-colors"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-1.5">
                  Posisi Pekerjaan <SortIcon columnKey="title" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3.5 cursor-pointer group hover:text-slate-900 transition-colors"
                onClick={() => handleSort('company.name')}
              >
                <div className="flex items-center gap-1.5">
                  Perusahaan <SortIcon columnKey="company.name" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3.5 cursor-pointer group hover:text-slate-900 transition-colors"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1.5">
                  Kategori <SortIcon columnKey="category" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3.5">Status Review</th>
              <th scope="col" className="px-6 py-3.5 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {processedData.length > 0 ? (
              processedData.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Posisi & Tipe */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-extrabold text-slate-900 text-sm group-hover:text-primary transition-colors">{job.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px]">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        {job.type}
                      </span>
                      {job.location && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Perusahaan */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-2xs">
                        {job.company?.logoUrl ? (
                          <Image 
                            src={job.company.logoUrl} 
                            alt={job.company.name} 
                            fill 
                            sizes="36px" 
                            loading="lazy" 
                            className="object-contain p-1" 
                          />
                        ) : (
                          <Building className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <span className="font-bold text-slate-800">{job.company?.name || "Perusahaan Baru"}</span>
                    </div>
                  </td>

                  {/* Kategori */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/60">
                      {job.category}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700 border border-amber-200/60 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Menunggu Persetujuan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200/60 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Disetujui
                      </span>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <JobActionButtons job={job} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    {inputValue ? (
                       <>
                         <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-3">
                           <Search className="h-6 w-6" />
                         </div>
                         <p className="font-bold text-slate-900 text-sm">Pencarian Tidak Ditemukan</p>
                         <p className="text-xs text-slate-400 mt-1">Tidak ada lowongan yang cocok dengan "{inputValue}".</p>
                       </>
                    ) : (
                       <>
                         <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-3 border border-emerald-100 shadow-2xs">
                           <CheckCircle2 className="h-7 w-7" />
                         </div>
                         <p className="font-extrabold text-slate-900 text-sm">Semua Lowongan Telah Ditinjau!</p>
                         <p className="text-xs text-slate-500 mt-1">Tidak ada permohonan lowongan yang menunggu persetujuan admin saat ini.</p>
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
