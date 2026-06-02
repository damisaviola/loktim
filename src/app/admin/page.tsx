"use client";

import { jobs, companies } from "@/lib/dummy-data";
import { 
  Briefcase, 
  Building, 
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

export default function AdminDashboard() {
  // Hitung statistik
  const totalJobs = jobs.length;
  const expiredJobs = Math.floor(totalJobs * 0.2); // Anggap 20% kadaluarsa
  const activeJobs = totalJobs - expiredJobs;
  const totalCompanies = Object.keys(companies).length;

  // Ambil lowongan yang menunggu approval
  const pendingJobs = jobs.filter(job => job.status === 'pending');

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Widget 1: Total Lowongan */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Total Lowongan</p>
              <p className="text-3xl font-bold tracking-tight text-gray-900">{totalJobs}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Keseluruhan lowongan</span>
          </div>
        </div>

        {/* Widget 2: Lowongan Aktif */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Lowongan Aktif</p>
              <p className="text-3xl font-bold tracking-tight text-gray-900">{activeJobs}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Sedang menerima lamaran</span>
          </div>
        </div>

        {/* Widget 3: Lowongan Kadaluarsa */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Lowongan Kadaluarsa</p>
              <p className="text-3xl font-bold tracking-tight text-gray-900">{expiredJobs}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Melewati batas waktu</span>
          </div>
        </div>

        {/* Widget 4: Total Perusahaan */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Total Perusahaan</p>
              <p className="text-3xl font-bold tracking-tight text-gray-900">{totalCompanies}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-600">
              <Building className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Mitra terdaftar di platform</span>
          </div>
        </div>
      </div>

      {/* Table Pending Approval Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        
        {/* Table Header Area */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-gray-900">Menunggu Persetujuan</h2>
            <p className="text-sm text-gray-500">Daftar lowongan pekerjaan yang perlu ditinjau dan disetujui.</p>
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
                <th scope="col" className="px-6 py-3 font-medium">Status</th>
                <th scope="col" className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingJobs.length > 0 ? (
                pendingJobs.map((job) => (
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
                      <div className="flex justify-end gap-3">
                        {job.status === 'pending' && (
                          <button className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-md transition-colors" title="Approve">
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                        )}
                        <button className="text-primary hover:text-primary/80 hover:bg-primary/5 p-1.5 rounded-md transition-colors" title="Lihat Detail">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-1.5 rounded-md transition-colors" title="Edit">
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
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-3 opacity-50" />
                      <p className="font-medium text-gray-900">Semua Beres!</p>
                      <p className="text-sm mt-1">Tidak ada lowongan yang menunggu persetujuan saat ini.</p>
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
