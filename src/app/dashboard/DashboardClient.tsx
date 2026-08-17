"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTableSortAndSearch } from "@/hooks/useTableSortAndSearch";
import Link from "next/link";
import { toast } from "sonner";
import { logout } from "@/app/auth/actions";
import {
  Briefcase,
  Clock,
  XCircle,
  Layers,
  Search,
  SearchX,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Zap,
  Trophy,
  Shield,
  CheckCircle2,
  X,
  ExternalLink,
  Settings2,
  Plus,
  Building2,
  MapPin,
  Mail,
  LogOut,
  Sparkles,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

interface CompanyData {
  id: string;
  name: string;
  location: string;
  logoUrl: string | null;
  email: string | null;
}

export interface DashboardJob {
  id: string;
  title: string;
  category: string;
  location: string | null;
  status: string | null;
  isPremium: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  postedAt: string;
  deadline: string | null;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; badge: string; dot: string }
> = {
  approved: {
    label: "Aktif",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Menunggu Review",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  rejected: {
    label: "Ditolak",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  closed: {
    label: "Ditutup",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

function getStatus(status?: string | null) {
  return STATUS_CONFIG[status ?? ""] ?? {
    label: status || "Draft",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  };
}

const formatDate = (iso?: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatSalary = (job: DashboardJob) => {
  if (job.salaryMin && job.salaryMax) {
    return `Rp ${job.salaryMin.toLocaleString("id-ID")} - ${job.salaryMax.toLocaleString("id-ID")}`;
  }
  if (job.salaryMin) return `Rp ${job.salaryMin.toLocaleString("id-ID")}`;
  return "Dibicarakan";
};

export default function DashboardClient({
  company,
  hrdJobs,
  userEmail,
}: {
  company: CompanyData | null;
  hrdJobs: DashboardJob[];
  userEmail: string | null;
}) {
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>("premium");

  const handleBoostClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setShowBoostModal(true);
  };

  const { inputValue, setInputValue, sortKey, sortDirection, handleSort, processedData } =
    useTableSortAndSearch(hrdJobs, (job, query) => {
      const haystack = [job.title, job.category, job.location, getStatus(job.status).label]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });

  const renderSortIcon = (columnKey: string) => {
    if (sortKey !== columnKey)
      return (
        <ArrowUpDown className="ml-1 inline-block h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
      );
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 inline-block h-4 w-4 text-primary" />
    ) : (
      <ChevronDown className="ml-1 inline-block h-4 w-4 text-primary" />
    );
  };

  const totalJobs = hrdJobs.length;
  const activeJobs = hrdJobs.filter((j) => j.status === "approved").length;
  const pendingJobs = hrdJobs.filter((j) => j.status === "pending").length;
  const closedJobs = hrdJobs.filter(
    (j) => j.status === "closed" || j.status === "rejected",
  ).length;

  const statCards = [
    {
      label: "Lowongan Aktif",
      value: activeJobs,
      icon: Briefcase,
      chip: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    },
    {
      label: "Menunggu Review",
      value: pendingJobs,
      icon: Clock,
      chip: "bg-amber-50 text-amber-600 ring-amber-100",
    },
    {
      label: "Ditutup",
      value: closedJobs,
      icon: XCircle,
      chip: "bg-slate-100 text-slate-600 ring-slate-200",
    },
    {
      label: "Total Lowongan",
      value: totalJobs,
      icon: Layers,
      chip: "bg-primary/10 text-primary ring-primary/20",
    },
  ];

  const packages = [
    {
      id: "basic",
      name: "Promosi Basic",
      price: "Rp 25.000",
      duration: "Per hari",
      features: ["Tampil di halaman utama", "Highlight warna khusus"],
      icon: Zap,
    },
    {
      id: "premium",
      name: "Premium Prioritas",
      price: "Rp 99.000",
      duration: "Selama 7 hari",
      features: [
        "Posisi teratas di pencarian",
        "Highlight eksklusif",
        "Notifikasi ke kandidat yang cocok",
      ],
      icon: Trophy,
      recommended: true,
    },
  ];

  const todayLabel = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* HERO */}
      <div className="relative overflow-hidden bg-slate-900">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-28 right-[-6rem] h-96 w-96 rounded-full bg-primary/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-36 left-[-4rem] h-96 w-96 rounded-full bg-sky-500/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-12">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10 text-lg font-bold text-white ring-1 ring-white/20 backdrop-blur-sm sm:h-20 sm:w-20">
                {company?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={company.logoUrl}
                    alt={`Logo ${company.name}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-8 w-8" aria-hidden="true" />
                )}
              </div>
              <div>
                <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-sky-300/90">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Portal Perusahaan
                </p>
                <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {company ? company.name : "Dasbor Perusahaan"}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
                  {company && (
                    <>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-sky-300/80" aria-hidden="true" />
                        {company.location}
                      </span>
                      {company.email && (
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-sky-300/80" aria-hidden="true" />
                          {company.email}
                        </span>
                      )}
                    </>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-sky-300/80" aria-hidden="true" />
                    {todayLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col xl:flex-row">
              <Link href="/post">
                <Button className="h-12 w-full gap-2 bg-white px-6 font-bold text-slate-900 shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-slate-100 sm:w-auto">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Pasang Lowongan Baru
                </Button>
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Keluar
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Selamat datang kembali,
              </p>
              <p className="font-serif text-2xl font-medium leading-snug text-white sm:text-3xl">
                kelola karir tim Anda hari ini.
              </p>
            </div>
            {activeJobs > 0 && (
              <Link
                href="/jobs"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-sky-300 transition-colors hover:text-sky-200"
              >
                Lihat profil publik perusahaan
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-6 pt-8 sm:px-8">
        {/* Empty state: no company linked yet */}
        {!company ? (
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-primary/80 px-6 py-10 text-center sm:px-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20">
                <Briefcase className="h-8 w-8" aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-white">
                Mulai Rekrut Talenta Pertama Anda
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-300">
                Pasang lowongan kerja pertama Anda dengan email{" "}
                <span className="font-semibold text-white">
                  {userEmail || "Anda"}
                </span>
                . Setelah itu, lowongan yang Anda buat akan muncul di dasbor ini
                secara otomatis.
              </p>
            </div>
            <div className="px-6 py-8 text-center">
              <Link href="/post">
                <Button className="h-12 gap-2 px-8 font-semibold">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Pasang Lowongan Sekarang
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="group rounded-2xl border border-border/60 bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`rounded-xl p-2.5 ring-1 ${stat.chip}`}>
                      <stat.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="text-[13px] font-semibold text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Jobs Table */}
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
              <div className="flex flex-col gap-4 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight text-foreground">
                    Daftar Lowongan
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Pantau status dan kelola setiap lowongan yang Anda pasang.
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    placeholder="Cari posisi, kategori, atau status..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="h-9 border-border/60 pl-9 text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/10 text-[11px] uppercase tracking-wider text-muted-foreground">
                      <th
                        className="group w-[38%] cursor-pointer select-none px-6 py-4 font-bold transition-colors hover:text-foreground"
                        onClick={() => handleSort("title")}
                      >
                        Posisi Pekerjaan {renderSortIcon("title")}
                      </th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold">Batas Lamaran</th>
                      <th className="px-6 py-4 font-bold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {processedData.length > 0 ? (
                      processedData.map((job) => {
                        const status = getStatus(job.status);
                        return (
                          <tr
                            key={job.id}
                            className="group transition-colors hover:bg-muted/10"
                          >
                            <td className="px-6 py-5">
                              <Link
                                href={`/manage/${job.id}`}
                                className="mb-1 block text-base font-bold text-foreground transition-colors hover:text-primary"
                              >
                                {job.title}
                              </Link>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                <span>Dibuat: {formatDate(job.postedAt)}</span>
                                <span className="text-border">•</span>
                                <span>{formatSalary(job)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.badge}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                                  aria-hidden="true"
                                />
                                {status.label}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-sm font-medium text-foreground">
                              {formatDate(job.deadline)}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center justify-end gap-2">
                                {job.status === "approved" && (
                                  <Link
                                    href={`/job/${job.id}`}
                                    title="Lihat di publik"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                                  >
                                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                  </Link>
                                )}
                                {!job.isPremium && job.status !== "closed" && job.status !== "rejected" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBoostClick(job.id)}
                                    className="h-9 border-primary/20 text-xs font-semibold text-primary hover:bg-primary/5"
                                  >
                                    <Zap className="mr-1.5 h-3.5 w-3.5 fill-current opacity-70" aria-hidden="true" />
                                    Promosikan
                                  </Button>
                                )}
                                <Link
                                  href={`/manage/${job.id}`}
                                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 px-3 text-xs font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                                >
                                  <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
                                  Kelola
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-14 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50">
                              <SearchX className="h-6 w-6" aria-hidden="true" />
                            </div>
                            {hrdJobs.length === 0 ? (
                              <>
                                <p className="mt-4 font-semibold text-foreground">
                                  Belum ada lowongan
                                </p>
                                <p className="mt-1 text-sm">
                                  Mulai dengan memasang lowongan kerja pertama Anda.
                                </p>
                              </>
                            ) : (
                              <p className="mt-4 text-sm">
                                Tidak ada lowongan yang cocok dengan pencarian Anda.
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Boost Modal */}
      {showBoostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="relative border-b border-border/60 bg-muted/10 p-6 md:p-8">
              <button
                onClick={() => setShowBoostModal(false)}
                className="absolute right-6 top-6 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
                  <Zap className="h-6 w-6 fill-current" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    Tingkatkan Visibilitas Lowongan
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Jangkau hingga 3x lebih banyak kandidat berkualitas.
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8">
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {packages.map((pkg) => (
                  <label
                    key={pkg.id}
                    className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-5 transition-all ${
                      selectedPackage === pkg.id
                        ? "border-primary bg-primary/5"
                        : "border-border/60 hover:border-border hover:bg-secondary/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="boost_package"
                      value={pkg.id}
                      checked={selectedPackage === pkg.id}
                      onChange={(e) => setSelectedPackage(e.target.value)}
                      className="sr-only"
                    />
                    {pkg.recommended && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                        Rekomendasi
                      </span>
                    )}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <pkg.icon
                          className={`h-5 w-5 ${
                            selectedPackage === pkg.id ? "text-primary" : "text-muted-foreground"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="text-lg font-bold text-foreground">{pkg.name}</span>
                      </div>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          selectedPackage === pkg.id ? "border-primary" : "border-muted-foreground/30"
                        }`}
                      >
                        {selectedPackage === pkg.id && (
                          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-2xl font-black text-foreground">{pkg.price}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{pkg.duration}</div>
                    </div>
                    <ul className="mt-auto flex-1 space-y-2.5 text-sm">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-foreground/80">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </label>
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" aria-hidden="true" />
                  <span>Pembayaran aman &amp; terenkripsi</span>
                </div>
                <div className="flex w-full gap-3 sm:w-auto">
                  <Button
                    variant="outline"
                    className="hidden h-12 w-auto px-6 font-semibold sm:flex"
                    onClick={() => setShowBoostModal(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    className="h-12 w-full px-8 text-base font-bold shadow-lg shadow-primary/20 sm:w-auto"
                    onClick={() => {
                      toast.info(
                        `Melanjutkan pembayaran paket: ${
                          packages.find((p) => p.id === selectedPackage)?.name
                        }${selectedJobId ? ` untuk lowongan ${selectedJobId.slice(0, 8)}` : ""}`,
                      );
                      setShowBoostModal(false);
                    }}
                  >
                    Lanjutkan Pembayaran
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}