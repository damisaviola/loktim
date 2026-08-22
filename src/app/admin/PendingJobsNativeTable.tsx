"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Search, ArrowUpDown, ChevronDown, ChevronUp, Briefcase, MapPin, Building, ExternalLink, X, Clock } from "lucide-react";
import Image from "next/image";
import JobActionButtons from "./JobActionButtons";
import Link from "next/link";

interface JobItem {
  id: string;
  title: string;
  type: string;
  location?: string | null;
  category: string;
  status?: string | null;
  createdAt: string | Date;
  company?: {
    id?: string;
    name: string;
    logoUrl?: string | null;
  } | null;
}

export default function PendingJobsNativeTable({ pendingJobs }: { pendingJobs: JobItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    pendingJobs.forEach((j) => {
      if (j.category) set.add(j.category);
    });
    return Array.from(set).sort();
  }, [pendingJobs]);

  const filteredJobs = useMemo(() => {
    return pendingJobs.filter((job) => {
      if (categoryFilter !== "all" && job.category !== categoryFilter) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        return (
          job.title.toLowerCase().includes(q) ||
          (job.company?.name || "").toLowerCase().includes(q) ||
          job.category.toLowerCase().includes(q) ||
          (job.location || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [pendingJobs, categoryFilter, searchQuery]);

  const formatDate = (dateInput: string | Date) => {
    try {
      const d = new Date(dateInput);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return String(dateInput);
    }
  };

  return (
    <div className="w-full">
      {/* Search Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari lowongan pending, perusahaan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-8 bg-white border border-slate-200/90 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          {categories.length > 0 && (
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 pl-3.5 pr-8 bg-white border border-slate-200/90 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="all">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                ▼
              </div>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Total Pending:</span>
            <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              {filteredJobs.length}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-2xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Semua Lowongan Bersih!</h3>
            <p className="text-xs text-slate-400">Tidak ada permohonan lowongan yang sedang menunggu review admin saat ini.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card List (< md) */}
          <div className="block md:hidden divide-y divide-slate-100">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-4 space-y-3 bg-amber-50/15">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {job.company?.logoUrl ? (
                      <div className="w-6 h-6 rounded-md bg-white border border-slate-200 overflow-hidden relative shrink-0">
                        <Image src={job.company.logoUrl} alt={job.company.name} fill sizes="24px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {job.company?.name?.charAt(0) || "?"}
                      </div>
                    )}
                    <span className="font-bold text-slate-700 text-xs truncate max-w-[140px]">
                      {job.company?.name || "Perusahaan"}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Pending
                  </span>
                </div>

                <div className="space-y-1">
                  <Link
                    href={`/job/${job.id}`}
                    target="_blank"
                    className="font-extrabold text-slate-900 text-sm hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span>{job.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 font-medium">{job.type}</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">{job.category}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(job.createdAt)}</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                  <JobActionButtons job={job} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Posisi Pekerjaan</th>
                  <th scope="col" className="px-4 py-3.5">Perusahaan</th>
                  <th scope="col" className="px-4 py-3.5">Kategori</th>
                  <th scope="col" className="px-4 py-3.5">Status Review</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <Link
                        href={`/job/${job.id}`}
                        target="_blank"
                        className="font-extrabold text-slate-900 text-sm hover:text-primary transition-colors flex items-center gap-1.5 group"
                      >
                        <span className="truncate max-w-[260px]">{job.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-semibold text-slate-600">{job.type}</span>
                        <span>•</span>
                        <span>{formatDate(job.createdAt)}</span>
                        {job.location && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[120px]">{job.location}</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        {job.company?.logoUrl ? (
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 overflow-hidden relative shrink-0 shadow-2xs">
                            <Image src={job.company.logoUrl} alt={job.company.name} fill sizes="32px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {job.company?.name?.charAt(0) || "?"}
                          </div>
                        )}
                        <span className="font-bold text-slate-900 truncate max-w-[150px]">
                          {job.company?.name || "Perusahaan Baru"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">
                        {job.category}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 border border-amber-200 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Menunggu Persetujuan
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <JobActionButtons job={job} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
