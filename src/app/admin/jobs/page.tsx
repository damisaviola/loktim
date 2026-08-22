import prisma from "@/lib/prisma";
import AllJobsNativeTable from "./AllJobsNativeTable";
import { Briefcase, Plus } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola Lowongan - Admin LokerTimika",
  description: "Manajemen dan moderasi seluruh lowongan pekerjaan di LokerTimika.",
};

export default async function AllJobsPage() {
  // Ambil semua lowongan tanpa memfilter status
  const allJobs = await prisma.job.findMany({
    include: { company: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 pb-10">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider font-mono">
            <Briefcase className="w-4 h-4" />
            <span>Manajemen Lowongan</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Semua Lowongan Kerja
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar keseluruhan lowongan pekerjaan yang terdaftar di dalam platform LokerTimika.
          </p>
        </div>

        <Link
          href="/admin/jobs/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Lowongan Baru</span>
        </Link>
      </div>

      {/* 2. NATIVE TABLE & FILTER SECTION */}
      <AllJobsNativeTable jobs={allJobs} />
      
    </div>
  );
}
