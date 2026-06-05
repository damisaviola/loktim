import prisma from "@/lib/prisma";
import { 
  Briefcase, 
  MapPin, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import JobActionButtons from "../../JobActionButtons";

export default async function ActiveJobsPage() {
  // Ambil lowongan yang aktif (status: approved)
  const activeJobs = await prisma.job.findMany({
    where: { status: 'approved' },
    include: { company: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Lowongan Aktif
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar semua lowongan pekerjaan yang saat ini sedang tayang dan aktif.
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 p-4 sm:p-6 bg-gray-50/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Total:</span>
            <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
              {activeJobs.length} Lowongan
            </span>
          </div>
        </div>

        {/* Data Table */}
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
              {activeJobs.length > 0 ? (
                activeJobs.map((job) => (
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
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600 border border-emerald-200">
                          Aktif
                        </span>
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
                      <Briefcase className="h-10 w-10 text-gray-300 mb-3" />
                      <p className="font-medium text-gray-900">Belum Ada Data</p>
                      <p className="text-sm mt-1">Tidak ditemukan lowongan yang aktif saat ini.</p>
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
