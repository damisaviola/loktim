"use client";

import { useState, useMemo } from "react";
import { Briefcase, Search, ArrowUpDown, ExternalLink, MapPin, Banknote, Clock, Building2, X } from "lucide-react";
import JobActionButtons from "../../JobActionButtons";
import Image from "next/image";
import Link from "next/link";

interface JobItem {
  id: string;
  title: string;
  type: string;
  location?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  isSalaryNegotiable?: boolean;
  category: string;
  status?: string | null;
  createdAt: string | Date;
  company?: {
    id?: string;
    name: string;
    logoUrl?: string | null;
  } | null;
}

export default function ActiveJobsNativeTable({ activeJobs }: { activeJobs: JobItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    activeJobs.forEach((j) => {
      if (j.category) set.add(j.category);
    });
    return Array.from(set).sort();
  }, [activeJobs]);

  const filteredJobs = useMemo(() => {
    return activeJobs.filter((job) => {
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
  }, [activeJobs, categoryFilter, searchQuery]);

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

  const formatSalary = (job: JobItem) => {
    if (job.salaryMin && job.salaryMax) {
      return `Rp ${job.salaryMin.toLocaleString("id-ID")} - Rp ${job.salaryMax.toLocaleString("id-ID")}`;
    } else if (job.salaryMin) {
      return `Mulai Rp ${job.salaryMin.toLocaleString("id-ID")}`;
    } else if (job.isSalaryNegotiable) {
      return "Negosiasi";
    }
    return "Dirahasiakan";
  };

  return (
    <div className="w-full space-y-4">
      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari lowongan aktif, perusahaan..."
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
      </div>

      {/* Content: Mobile Cards + Desktop Table */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center text-slate-400 space-y-2">
          <Briefcase className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-xs font-semibold text-slate-600">Tidak ada lowongan aktif ditemukan</p>
        </div>
      ) : (
        <>
          {/* Mobile Card List */}
          <div className="block md:hidden divide-y divide-slate-100">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-700 text-xs truncate max-w-[150px]">
                    {job.company?.name || "Perusahaan"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Aktif
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

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span className="text-slate-700 font-medium">{formatSalary(job)}</span>
                  <span>{formatDate(job.createdAt)}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                  <JobActionButtons job={job} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Posisi Pekerjaan</th>
                  <th className="px-4 py-3.5">Perusahaan</th>
                  <th className="px-4 py-3.5">Kategori &amp; Gaji</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/job/${job.id}`}
                        target="_blank"
                        className="font-extrabold text-slate-900 text-sm hover:text-primary transition-colors flex items-center gap-1.5 group"
                      >
                        <span className="truncate max-w-xs">{job.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-semibold text-slate-600">{job.type}</span>
                        <span>•</span>
                        <span>{formatDate(job.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {job.company?.logoUrl ? (
                          <div className="w-7 h-7 rounded-md bg-white border border-slate-200 overflow-hidden relative shrink-0">
                            <Image src={job.company.logoUrl} alt={job.company.name} fill sizes="28px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-md bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                            {job.company?.name?.charAt(0) || "?"}
                          </div>
                        )}
                        <span className="font-bold text-slate-800 truncate max-w-[140px]">
                          {job.company?.name || "Perusahaan"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px]">
                          {job.category}
                        </span>
                        <div className="text-[11px] text-slate-600 font-medium">{formatSalary(job)}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Aktif
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
