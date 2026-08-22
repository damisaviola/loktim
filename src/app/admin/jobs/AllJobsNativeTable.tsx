"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Briefcase, 
  Search, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Building2,
  MapPin,
  Banknote,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  SlidersHorizontal,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus
} from "lucide-react";
import JobActionButtons from "../JobActionButtons";
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

function AllJobsTableContent({ jobs }: { jobs: JobItem[] }) {
  const searchParams = useSearchParams();
  const defaultSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(defaultSearch);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extract unique categories & types for dropdowns
  const categories = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.category) set.add(j.category);
    });
    return Array.from(set).sort();
  }, [jobs]);

  const employmentTypes = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.type) set.add(j.type);
    });
    return Array.from(set).sort();
  }, [jobs]);

  // Filtered & Sorted Jobs
  const filteredAndSortedJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      // 1. Status Filter
      if (statusFilter !== "all" && job.status !== statusFilter) {
        return false;
      }

      // 2. Category Filter
      if (categoryFilter !== "all" && job.category !== categoryFilter) {
        return false;
      }

      // 3. Type Filter
      if (typeFilter !== "all" && job.type !== typeFilter) {
        return false;
      }

      // 4. Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCompany = (job.company?.name || "").toLowerCase().includes(q);
        const matchCategory = job.category.toLowerCase().includes(q);
        const matchLocation = (job.location || "").toLowerCase().includes(q);
        return matchTitle || matchCompany || matchCategory || matchLocation;
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "title_asc") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "company_asc") {
        return (a.company?.name || "").localeCompare(b.company?.name || "");
      }
      return 0;
    });

    return result;
  }, [jobs, statusFilter, categoryFilter, typeFilter, searchQuery, sortBy]);

  // Counts for tabs
  const counts = useMemo(() => {
    const total = jobs.length;
    const approved = jobs.filter((j) => j.status === "approved").length;
    const pending = jobs.filter((j) => j.status === "pending").length;
    const rejected = jobs.filter((j) => j.status === "rejected").length;
    return { total, approved, pending, rejected };
  }, [jobs]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedJobs.slice(start, start + itemsPerPage);
  }, [filteredAndSortedJobs, currentPage]);

  const isFiltered = statusFilter !== "all" || categoryFilter !== "all" || typeFilter !== "all" || searchQuery.trim() !== "" || sortBy !== "newest";

  const handleResetFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setTypeFilter("all");
    setSearchQuery("");
    setSortBy("newest");
    setCurrentPage(1);
  };

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

  const getStatusBadge = (status?: string | null) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Aktif / Tayang
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Menunggu Review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
            {status || "Draft"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* 1. FILTER CONTROLS PANEL */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Status Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100"
            }`}
          >
            <span>Semua Lowongan</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${statusFilter === "all" ? "bg-slate-800 text-slate-200" : "bg-slate-200 text-slate-700 font-semibold"}`}>
              {counts.total}
            </span>
          </button>

          <button
            onClick={() => { setStatusFilter("approved"); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "approved"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50/50"
            }`}
          >
            <span>Aktif / Tayang</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${statusFilter === "approved" ? "bg-emerald-700 text-white" : "bg-emerald-100 text-emerald-800 font-semibold"}`}>
              {counts.approved}
            </span>
          </button>

          <button
            onClick={() => { setStatusFilter("pending"); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "pending"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white text-amber-700 border border-amber-200 hover:bg-amber-50/50"
            }`}
          >
            <span>Menunggu Review</span>
            {counts.pending > 0 && (
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${statusFilter === "pending" ? "bg-amber-700 text-white" : "bg-amber-100 text-amber-800"}`}>
                {counts.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => { setStatusFilter("rejected"); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "rejected"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white text-rose-700 border border-rose-200 hover:bg-rose-50/50"
            }`}
          >
            <span>Ditolak</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${statusFilter === "rejected" ? "bg-rose-700 text-white" : "bg-rose-100 text-rose-800 font-semibold"}`}>
              {counts.rejected}
            </span>
          </button>
        </div>

        {/* Filter Toolbar: Search + Category + Type + Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 pt-1 border-t border-slate-100">
          
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Cari judul lowongan, perusahaan, lokasi..."
              className="w-full h-10 pl-10 pr-9 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3 relative">
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 pl-3.5 pr-7 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-primary transition-all cursor-pointer appearance-none"
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

          {/* Employment Type Filter */}
          <div className="lg:col-span-2 relative">
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 pl-3.5 pr-7 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-primary transition-all cursor-pointer appearance-none"
            >
              <option value="all">Semua Tipe</option>
              {employmentTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-3 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 pl-9 pr-7 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-primary transition-all cursor-pointer appearance-none"
            >
              <option value="newest">Urutkan: Terbaru</option>
              <option value="oldest">Urutkan: Terlama</option>
              <option value="title_asc">Judul: A - Z</option>
              <option value="company_asc">Perusahaan: A - Z</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

        </div>

        {/* Active Filter Indicators & Reset */}
        {isFiltered && (
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs flex-wrap">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              <span>
                Menampilkan <strong>{filteredAndSortedJobs.length}</strong> hasil filter dari total <strong>{jobs.length}</strong> lowongan
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          </div>
        )}

      </div>

      {/* 2. DATA VIEW SECTION (DESKTOP TABLE + MOBILE CARD VIEW) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredAndSortedJobs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">Tidak ada lowongan ditemukan</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {isFiltered
                  ? "Coba sesuaikan kata kunci pencarian atau klik Reset Filter untuk menampilkan semua lowongan."
                  : "Belum ada lowongan pekerjaan yang tersimpan di sistem."}
              </p>
            </div>
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* A. MOBILE VIEW: RESPONSIVE CARDS (< md) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {paginatedJobs.map((job) => (
                <div
                  key={job.id}
                  className={`p-4 space-y-3 transition-colors ${
                    job.status === "pending" ? "bg-amber-50/20" : ""
                  }`}
                >
                  {/* Top Bar: Company + Date + Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {job.company?.logoUrl ? (
                        <div className="w-6 h-6 rounded-md bg-white border border-slate-200 overflow-hidden relative shrink-0">
                          <Image 
                            src={job.company.logoUrl} 
                            alt={job.company.name} 
                            fill 
                            sizes="24px" 
                            className="object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-md bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                          {job.company?.name?.charAt(0) || "?"}
                        </div>
                      )}
                      <span className="font-bold text-slate-700 text-xs truncate max-w-[130px]">
                        {job.company?.name || "Perusahaan"}
                      </span>
                    </div>
                    <div>
                      {getStatusBadge(job.status)}
                    </div>
                  </div>

                  {/* Job Title & Badges */}
                  <div className="space-y-1.5">
                    <Link
                      href={`/job/${job.id}`}
                      target="_blank"
                      className="font-extrabold text-slate-900 text-sm hover:text-primary transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="line-clamp-1">{job.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary shrink-0" />
                    </Link>

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {job.type}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px]">
                        {job.category}
                      </span>
                      {job.location && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[100px]">{job.location}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Salary & Date Bar */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{formatSalary(job)}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {formatDate(job.createdAt)}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                    <JobActionButtons job={job} />
                  </div>
                </div>
              ))}
            </div>

            {/* B. DESKTOP VIEW: REFINED MODERN TABLE (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Posisi &amp; Info</th>
                    <th className="py-3.5 px-4">Perusahaan</th>
                    <th className="py-3.5 px-4">Kategori &amp; Gaji</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedJobs.map((job) => (
                    <tr 
                      key={job.id} 
                      className={`hover:bg-slate-50/80 transition-colors group ${
                        job.status === "pending" ? "bg-amber-50/20" : ""
                      }`}
                    >
                      {/* Job Title & Badges */}
                      <td className="py-4 px-6 align-top">
                        <div className="space-y-1 max-w-[280px] lg:max-w-[340px]">
                          <Link
                            href={`/job/${job.id}`}
                            target="_blank"
                            className="font-extrabold text-slate-900 text-sm hover:text-primary transition-colors flex items-center gap-1.5 group/link"
                            title="Lihat Pratinjau Lowongan"
                          >
                            <span className="truncate">{job.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity text-primary shrink-0" />
                          </Link>

                          <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500 font-normal">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                              {job.type}
                            </span>
                            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(job.createdAt)}</span>
                            </div>
                            {job.location && (
                              <div className="flex items-center gap-0.5 text-slate-400 text-[11px]">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[120px]">{job.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Company Info */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-2.5">
                          {job.company?.logoUrl ? (
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/90 overflow-hidden relative shrink-0 shadow-2xs">
                              <Image 
                                src={job.company.logoUrl} 
                                alt={job.company.name} 
                                fill 
                                sizes="32px" 
                                className="object-cover" 
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                              {job.company?.name?.charAt(0) || "?"}
                            </div>
                          )}
                          <div className="min-w-0 max-w-[160px]">
                            <span className="font-bold text-slate-900 truncate block">
                              {job.company?.name || "Perusahaan"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Salary */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-100">
                            {job.category}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-slate-700 font-medium">
                            <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate max-w-[150px]">{formatSalary(job)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap align-top">
                        {getStatusBadge(job.status)}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 whitespace-nowrap align-top text-right">
                        <JobActionButtons job={job} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div>
                  Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong> (Total <strong>{filteredAndSortedJobs.length}</strong> lowongan)
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}

export default function AllJobsNativeTable({ jobs }: { jobs: any[] }) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400 text-xs">Memuat tabel lowongan...</div>}>
      <AllJobsTableContent jobs={jobs} />
    </Suspense>
  );
}
