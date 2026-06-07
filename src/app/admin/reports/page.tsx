import { getJobReportsAction } from "@/app/actions/report";
import { Flag, Search, CheckCircle2, AlertTriangle, Building2 } from "lucide-react";
import { ReportActionButtons } from "./ReportActionButtons";
import Link from "next/link";

export const metadata = {
  title: "Kelola Laporan - Admin LokerTimika",
};

export default async function ReportsAdminPage() {
  const reports = await getJobReportsAction();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Flag className="w-6 h-6 text-destructive" /> Laporan Lowongan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola dan tindak lanjuti laporan dari pencari kerja terkait lowongan yang bermasalah.
          </p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {reports.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Semua Aman!</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              Belum ada laporan lowongan bermasalah yang masuk saat ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-900 font-semibold">
                <tr>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Pekerjaan</th>
                  <th className="px-6 py-4">Alasan & Detail</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report: any) => (
                  <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
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
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        report.status === 'resolved' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {report.status === 'resolved' ? 'Selesai' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ReportActionButtons report={report} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
