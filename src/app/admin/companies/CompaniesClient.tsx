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
  ChevronDown,
  Mail,
  User,
  Copy,
  ExternalLink,
  Check
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useTableSortAndSearch } from "@/hooks/useTableSortAndSearch";
import Image from "next/image";
import { toast } from "sonner";

export default function CompaniesClient({ initialCompanies }: { initialCompanies: any[] }) {
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

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
      company.location.toLowerCase().includes(query) ||
      (company.email && company.email.toLowerCase().includes(query)) ||
      (company.picName && company.picName.toLowerCase().includes(query))
  );

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast.success("Email berhasil disalin!");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

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
            Perusahaan &amp; UMKM Mitra
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar lengkap instansi, perusahaan, dan UMKM yang telah mempublikasikan lowongan beserta kontak email resminya.
          </p>
        </div>
      </div>

      {/* Controls & Search Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Total Entitas:</span>
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-0.5 text-xs font-extrabold text-primary border border-primary/20">
            {companiesList.length} Perusahaan / UMKM
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama, email, lokasi, atau penanggung jawab..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-10 h-10 bg-slate-50/80 border-slate-200/80 rounded-xl text-xs font-semibold focus-visible:ring-primary/20"
            />
          </div>

          <button
            onClick={() => handleSort('jobCount')}
            className="h-10 px-3 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
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
                  
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="font-bold text-base text-slate-900 leading-snug group-hover:text-primary transition-colors truncate">
                      {company.name}
                    </h3>
                    
                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{company.location}</span>
                    </div>

                    {/* Email Display */}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 truncate pt-0.5">
                      <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                      {company.email ? (
                        <a 
                          href={`mailto:${company.email}`}
                          className="truncate hover:underline text-slate-700 font-semibold hover:text-primary transition-colors"
                          title={company.email}
                        >
                          {company.email}
                        </a>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Email belum tersedia</span>
                      )}
                    </div>

                    {/* Nama Penanggung Jawab if available */}
                    {company.picName && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">Penanggung Jawab: <strong className="text-slate-700 font-semibold">{company.picName}</strong></span>
                      </div>
                    )}
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
          <h3 className="text-base font-bold text-slate-900 mb-1">Perusahaan / UMKM Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Tidak ada data yang cocok dengan kata kunci pencarian Anda.
          </p>
          <button
            onClick={() => setInputValue('')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            Bersihkan Pencarian
          </button>
        </div>
      )}

      {/* Modal Detail Perusahaan */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900">Profil Perusahaan / UMKM</h2>
              <button 
                onClick={() => setSelectedCompany(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6 text-left">
              {/* Company Info */}
              <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs relative">
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
                    <Building className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <div className="pt-0.5 space-y-2 flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight truncate">
                    {selectedCompany.name}
                  </h1>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedCompany.location}</span>
                    </div>

                    {/* Email in modal */}
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-primary shrink-0" />
                      {selectedCompany.email ? (
                        <div className="flex items-center gap-1.5 min-w-0">
                          <a 
                            href={`mailto:${selectedCompany.email}`}
                            className="font-bold text-slate-800 hover:text-primary underline truncate"
                          >
                            {selectedCompany.email}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopyEmail(selectedCompany.email)}
                            className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer shrink-0"
                            title="Salin Email"
                          >
                            {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Email belum diisi</span>
                      )}
                    </div>

                    {selectedCompany.picName && (
                      <div className="flex items-center gap-1.5 sm:col-span-2">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Penanggung Jawab / Pemilik: <strong className="text-slate-900 font-bold">{selectedCompany.picName}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="pt-1">
                    <span className="text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-full font-bold border border-blue-100 inline-block">
                      {selectedCompany.jobCount} Lowongan Dipublikasikan
                    </span>
                  </div>
                </div>
              </div>

              {/* Company Description */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wider font-mono">
                  Deskripsi Profil
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                  {selectedCompany.about || `${selectedCompany.name} berlokasi di ${selectedCompany.location}.`}
                </p>
              </div>

              {/* Company Jobs */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider font-mono">
                  Daftar Lowongan ({selectedCompany.jobs?.length || 0})
                </h3>
                <div className="space-y-3">
                  {selectedCompany.jobs?.length > 0 ? (
                    selectedCompany.jobs.map((job: any) => (
                      <div key={job.id} className="border border-slate-200 rounded-xl p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-primary transition-colors">{job.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.type}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>{job.category}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {job.status === 'pending' ? (
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                              Aktif
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">{new Date(job.postedAt).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">Belum ada lowongan yang dipublikasikan.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedCompany(null)}
                className="px-5 py-2 font-bold text-xs text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
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
