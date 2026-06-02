"use client";

import { companies, jobs } from "@/lib/dummy-data";
import { 
  Building, 
  MapPin, 
  Eye, 
  Edit, 
  Trash2,
  Briefcase
} from "lucide-react";

export default function CompaniesPage() {
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
                        <button className="text-primary hover:text-primary/80 hover:bg-primary/5 p-1.5 rounded-md transition-colors" title="Lihat Profil">
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
    </div>
  );
}
