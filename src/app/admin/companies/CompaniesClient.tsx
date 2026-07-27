"use client";

import { useState } from "react";
import { 
  Building, 
  MapPin, 
  Eye, 
  Edit, 
  Trash2,
  Briefcase,
  X,
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useTableSortAndSearch } from "@/hooks/useTableSortAndSearch";
import Image from "next/image";

export default function CompaniesClient({ initialCompanies }: { initialCompanies: any[] }) {
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

  const companiesList = initialCompanies.map(company => ({
    ...company,
    jobCount: company.jobs?.length || 0
  }));

  const {
    inputValue,
    setInputValue,
    sortKey,
    sortDirection,
    handleSort,
    processedData
  } = useTableSortAndSearch(
    companiesList,
    (company, query) => 
      company.name.toLowerCase().includes(query) || 
      company.location.toLowerCase().includes(query)
  );

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortKey !== columnKey) return <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity inline-block ml-1" />;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 text-primary inline-block ml-1" /> : <ChevronDown className="w-4 h-4 text-primary inline-block ml-1" />;
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Perusahaan Mitra
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Menampilkan daftar perusahaan yang sudah mempublikasikan lowongan.
          </p>
        </div>
      </div>

      {/* Controls & Search Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Perusahaan:</span>
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-0.5 text-xs font-extrabold text-primary border border-primary/20">
            {companiesList.length} Perusahaan
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari perusahaan atau lokasi..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-10 h-10 bg-slate-50/80 border-slate-200/80 rounded-xl text-xs font-semibold focus-visible:ring-primary/20"
            />
          </div>

          <button
            onClick={() => handleSort('jobCount')}
            className="h-10 px-3 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
            title="Urutkan berdasarkan total lowongan"
          >
            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Urutkan Lowongan</span>
            <SortIcon columnKey="jobCount" />
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {processedData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {processedData.map((company) => (
            <div 
              key={company.id} 
              className="bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-md rounded-3xl p-5 transition-all duration-300 flex flex-col justify-between gap-4 group relative overflow-hidden"
            >
              <div className="space-y-3.5">
                {/* Header Card: Logo & Info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-2xs group-hover:scale-105 transition-transform relative">
                    {company.logoUrl ? (
                      <Image 
                        src={company.logoUrl} 
                        alt={company.name} 
                        fill 
                        sizes="56px" 
                        loading="lazy" 
                        className="object-contain p-2" 
                      />
                    ) : (
                      <Building className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base text-slate-900 leading-snug group-hover:text-primary transition-colors truncate">
                      {company.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500 mt-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{company.location}</span>
                    </div>
                  </div>
                </div>

                {/* About / Description snippet */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 min-h-[36px]">
                  {company.about || `${company.name} berlokasi di ${company.location}.`}
                </p>
              </div>

              {/* Footer Row: Badge & Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-100">
                  <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                  <span>{company.jobCount} Lowongan</span>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setSelectedCompany(company)}
                    className="p-2 text-primary hover:text-primary/80 hover:bg-primary/5 rounded-xl transition-colors cursor-pointer" 
                    title="Lihat Profil Detail"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer" 
                    title="Edit Data"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer" 
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 px-6 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-200/80 border-dashed">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 text-slate-400">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Perusahaan Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Tidak ada data perusahaan yang cocok dengan kata kunci pencarian Anda.
          </p>
          <button
            onClick={() => setInputValue('')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
          >
            Bersihkan Pencarian
          </button>
        </div>
      )}

      {/* Modal Detail Perusahaan */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Profil Perusahaan</h2>
              <button 
                onClick={() => setSelectedCompany(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6 text-left">
              {/* Company Info */}
              <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm relative">
                  {selectedCompany.logoUrl ? (
                    <Image 
                      src={selectedCompany.logoUrl} 
                      alt={selectedCompany.name} 
                      fill 
                      sizes="80px" 
                      loading="lazy" 
                      className="object-contain p-2" 
                    />
                  ) : (
                    <Building className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div className="pt-1">
                  <h1 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h1>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedCompany.location}</span>
                  </div>
                  <div className="mt-3 text-sm text-gray-600 bg-blue-50 text-blue-700 px-3 py-1 rounded-full inline-block font-medium border border-blue-100">
                    {selectedCompany.jobCount} Lowongan Dipublikasikan
                  </div>
                </div>
              </div>

              {/* Company Description */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Deskripsi Perusahaan</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedCompany.about || `${selectedCompany.name} adalah perusahaan terkemuka yang berlokasi di ${selectedCompany.location}. Perusahaan ini secara aktif merekrut talenta terbaik untuk berbagai posisi guna mendukung pertumbuhan bisnis.`}
                </p>
              </div>

              {/* Company Jobs */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Lowongan yang Dipublikasikan</h3>
                <div className="space-y-3">
                  {selectedCompany.jobs?.length > 0 ? (
                    selectedCompany.jobs.map((job: any) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                        <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{job.title}</h4>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 font-medium">
                            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.type}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{job.category}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {job.status === 'pending' ? (
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 border border-blue-200">
                              Pending Review
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-200">
                              Aktif
                            </span>
                          )}
                          <span className="text-xs text-gray-400">{new Date(job.postedAt).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Belum ada lowongan yang dipublikasikan.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
