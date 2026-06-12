import { getJobReportsAction } from "@/app/actions/report";
import { Flag } from "lucide-react";
import ReportsNativeTable from "./ReportsNativeTable";

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

      {/* Reports Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 p-4 sm:p-6 bg-gray-50/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Total:</span>
            <span className="inline-flex items-center justify-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
              {reports.length} Laporan
            </span>
          </div>
        </div>

        {/* Native Table Implementation with Sorting/Searching */}
        <ReportsNativeTable reports={reports} />
      </div>
    </div>
  );
}
