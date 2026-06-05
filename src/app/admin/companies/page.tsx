"use client";

import { useState } from "react";
import { companies, jobs } from "@/lib/dummy-data";
import { 
  Building, 
  MapPin, 
  Eye, 
  Edit, 
  Trash2,
  Briefcase,
  X,
  ChevronRight
} from "lucide-react";

export default function CompaniesPage() {
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

  // Hitung jumlah lowongan per perusahaan dan saring hanya yang memiliki lowongan
  const companiesWithJobs = Object.values(companies).map(company => {
    const jobCount = jobs.filter(job => job.companyId === company.id).length;
    return {
      ...company,
      jobCount
    };
  }).filter(company => company.jobCount > 0);

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

      {/* Table Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 p-4 sm:p-6 bg-gray-50/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Total:</span>
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {companiesWithJobs.length} Perusahaan
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Perusahaan</th>
                <th scope="col" className="px-6 py-3 font-medium">Lokasi</th>
                <th scope="col" className="px-6 py-3 font-medium text-center">Total Lowongan</th>
                <th scope="col" className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {companiesWithJobs.length > 0 ? (
                companiesWithJobs.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        {company.logoUrl ? (
                          <img 
                            src={company.logoUrl} 
                            alt={company.name} 
                            className="h-10 w-10 rounded-lg bg-white object-cover border border-gray-200 shadow-sm" 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                            {company.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{company.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            ID: {company.id.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {company.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                        <Briefcase className="h-3.5 w-3.5" />
                        {company.jobCount} Lowongan
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => setSelectedCompany(company)}
                          className="text-primary hover:text-primary/80 hover:bg-primary/5 p-1.5 rounded-md transition-colors" 
                          title="Lihat Profil"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-1.5 rounded-md transition-colors" title="Edit Data">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors" title="Hapus">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Building className="h-10 w-10 text-gray-300 mb-3" />
                      <p className="font-medium text-gray-900">Belum Ada Data</p>
                      <p className="text-sm mt-1">Tidak ditemukan perusahaan yang memiliki lowongan aktif.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </div>

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
                <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  {selectedCompany.logoUrl ? (
                    <img src={selectedCompany.logoUrl} alt={selectedCompany.name} className="w-full h-full object-contain p-2" />
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
                  {jobs.filter(j => j.companyId === selectedCompany.id).map(job => (
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
                  ))}
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
