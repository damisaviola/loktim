"use client";

import { useState } from "react";
import { jobs, companies } from "@/lib/dummy-data";
import { 
  Search, 
  Briefcase, 
  Building, 
  Star,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  MoreVertical
} from "lucide-react";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalJobs = jobs.length;
  const premiumJobs = jobs.filter(j => j.isPremium).length;
  const totalCompanies = Object.keys(companies).length;

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        
        {/* Widget 1 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Total Lowongan</p>
              <p className="text-3xl font-bold tracking-tight text-gray-900">{totalJobs}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="mr-1.5 h-4 w-4 text-emerald-500" />
            <span className="font-medium text-emerald-600">12%</span>
            <span className="ml-2 text-gray-500">Peningkatan bulan ini</span>
          </div>
        </div>

        {/* Widget 2 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Lowongan Premium</p>
              <p className="text-3xl font-bold tracking-tight text-gray-900">{premiumJobs}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
              <Star className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="font-medium text-emerald-600">+2</span>
            <span className="ml-2 text-gray-500">Premium baru minggu ini</span>
          </div>
        </div>

        {/* Widget 3 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Mitra Perusahaan</p>
              <p className="text-3xl font-bold tracking-tight text-gray-900">{totalCompanies}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
              <Building className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Entitas aktif di platform</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        
        {/* Table Header Area */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-gray-900">Lowongan Pekerjaan</h2>
            <p className="text-sm text-gray-500">Kelola daftar lowongan di platform.</p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari..."
              className="w-full sm:w-64 rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Native Implementation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Posisi</th>
                <th scope="col" className="px-6 py-3 font-medium">Perusahaan</th>
                <th scope="col" className="px-6 py-3 font-medium">Kategori</th>
                <th scope="col" className="px-6 py-3 font-medium text-center">Status</th>
                <th scope="col" className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
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
                            {job.company?.name.charAt(0) || "?"}
                          </div>
                        )}
                        <span className="font-medium">{job.company?.name || "Tidak diketahui"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {job.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {job.isPremium ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-600 border border-amber-200">
                          <Star className="h-3 w-3 fill-current" />
                          Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                          Reguler
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {/* Hidden by default, visible on hover */}
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-gray-400 hover:text-primary transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-primary transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex justify-end group-hover:hidden">
                        <button className="text-gray-400">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search className="h-8 w-8 mb-3 opacity-50" />
                      <p className="text-sm font-medium text-gray-900">Tidak ada lowongan ditemukan</p>
                      <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="border-t border-gray-200 bg-gray-50/50 px-6 py-3 flex items-center justify-between text-sm text-gray-500">
          <span>Menampilkan <strong>{filteredJobs.length}</strong> dari <strong>{jobs.length}</strong> hasil</span>
        </div>

      </div>
    </div>
  );
}
