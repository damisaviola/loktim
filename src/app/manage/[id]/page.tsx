import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  ExternalLink,
  CalendarDays,
  CalendarClock,
  Banknote,
  GraduationCap,
  Award,
  LayoutGrid,
  LifeBuoy,
  CheckCircle2,
  Clock,
  XCircle,
  Check,
  ListChecks,
} from "lucide-react";
import CloseJobButton from "./CloseJobButton";

const STATUS_CONFIG = {
  approved: {
    label: "Aktif",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    Icon: CheckCircle2,
  },
  pending: {
    label: "Menunggu Review",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    Icon: Clock,
  },
  rejected: {
    label: "Ditolak",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    Icon: XCircle,
  },
  closed: {
    label: "Ditutup",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
    Icon: XCircle,
  },
} as const;

function getStatus(status?: string | null) {
  return (
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? {
      label: status || "Draft",
      badge: "bg-slate-100 text-slate-600 border-slate-200",
      dot: "bg-slate-400",
      Icon: Clock,
    }
  );
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const formatDate = (d?: Date | null) => (d ? dateFormatter.format(new Date(d)) : "—");

const formatSalary = (job: {
  salaryMin?: number | null;
  salaryMax?: number | null;
}) => {
  if (job.salaryMin && job.salaryMax) {
    return `Rp ${job.salaryMin.toLocaleString("id-ID")} - ${job.salaryMax.toLocaleString("id-ID")}`;
  }
  if (job.salaryMin) return `Rp ${job.salaryMin.toLocaleString("id-ID")}`;
  return "Dibicarakan";
};

export default async function ManageJobPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const job = await prisma.job.findUnique({
    where: { id: resolvedParams.id },
    include: { company: true },
  });

  if (!job) {
    return notFound();
  }

  const status = getStatus(job.status);

  const infoCells = [
    { label: "Tipe", value: job.type, Icon: Briefcase },
    { label: "Kategori", value: job.category, Icon: LayoutGrid },
    { label: "Lokasi", value: job.location || job.company.location, Icon: MapPin },
    { label: "Gaji", value: formatSalary(job), Icon: Banknote },
    { label: "Pendidikan", value: job.education || "Semua", Icon: GraduationCap },
    { label: "Pengalaman", value: job.experience || "Semua", Icon: Award },
    { label: "Diposting", value: formatDate(job.createdAt), Icon: CalendarDays },
    { label: "Batas Lamaran", value: formatDate(job.deadline), Icon: CalendarClock },
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="mx-auto max-w-6xl px-6 pt-8 sm:px-8">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke Dasbor
        </Link>

        {/* Header */}
        <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Kelola Lowongan
              </p>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {job.title}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-secondary/60 px-3 py-1 text-xs font-semibold text-foreground">
                  <Building2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {job.company.name}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-secondary/60 px-3 py-1 text-xs font-semibold text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {job.location || job.company.location}
                </span>
              </div>
            </div>

            <span
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold ${status.badge}`}
            >
              <span className={`h-2 w-2 rounded-full ${status.dot}`} aria-hidden="true" />
              {status.label}
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Detail Lowongan */}
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-2.5 text-lg font-bold text-foreground">
                <span className="h-5 w-1 rounded-full bg-primary" aria-hidden="true" />
                Detail Lowongan
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                {infoCells.map((cell) => (
                  <div
                    key={cell.label}
                    className="rounded-xl border border-border/60 bg-muted/20 p-3.5"
                  >
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <cell.Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {cell.label}
                    </p>
                    <p className="mt-1.5 truncate text-sm font-semibold text-foreground" title={cell.value}>
                      {cell.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status information */}
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-2.5 text-lg font-bold text-foreground">
                <span className="h-5 w-1 rounded-full bg-primary" aria-hidden="true" />
                Papan Informasi
              </h2>

              <div className="mt-6">
                {job.status === "approved" && (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-sm leading-relaxed text-emerald-900">
                    <p className="mb-2 flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                      Lowongan Sedang Tayang
                    </p>
                    Lowongan Anda saat ini sedang tayang dan dapat dilihat oleh publik di beranda.
                    Jika Anda sudah menemukan kandidat yang cocok atau lowongan sudah tidak
                    tersedia, segera tutup lowongan ini agar tidak ada lagi pelamar yang
                    mengirimkan lamaran.
                  </div>
                )}
                {job.status === "pending" && (
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5 text-sm leading-relaxed text-amber-900">
                    <p className="mb-2 flex items-center gap-2 font-semibold">
                      <Clock className="h-5 w-5 text-amber-500" aria-hidden="true" />
                      Dalam Proses Antrean
                    </p>
                    Lowongan Anda sedang dalam antrean review oleh tim admin. Proses ini biasanya
                    memakan waktu maksimal 1x24 jam kerja. Anda tidak perlu melakukan apapun saat
                    ini, silakan pantau berkala halaman ini.
                  </div>
                )}
                {job.status === "rejected" && (
                  <div className="rounded-2xl border border-red-100 bg-red-50/60 p-5 text-sm leading-relaxed text-red-900">
                    <p className="mb-2 flex items-center gap-2 font-semibold">
                      <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                      Lowongan Ditolak
                    </p>
                    Lowongan Anda tidak memenuhi syarat dan ketentuan platform kami (misalnya:
                    duplikasi, data tidak lengkap, atau menyalahi aturan). Lowongan ini tidak akan
                    ditayangkan.
                  </div>
                )}
                {job.status === "closed" && (
                  <div className="rounded-2xl border border-border bg-muted/40 p-5 text-sm leading-relaxed text-muted-foreground">
                    <p className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                      <XCircle className="h-5 w-5" aria-hidden="true" />
                      Lowongan Telah Ditutup
                    </p>
                    Lowongan ini telah Anda tutup secara manual. Lowongan ini tidak akan lagi
                    muncul di halaman publik dan hasil pencarian. Terima kasih telah mempercayakan
                    rekrutmen Anda di platform kami!
                  </div>
                )}
              </div>
            </div>

            {/* Persyaratan */}
            {job.requirements.length > 0 && (
              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
                <h2 className="flex items-center gap-2.5 text-lg font-bold text-foreground">
                  <span className="h-5 w-1 rounded-full bg-primary" aria-hidden="true" />
                  Persyaratan
                </h2>
                <ul className="mt-6 space-y-3">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                      <span className="text-foreground/80">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick actions */}
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">Tindakan Cepat</h3>
              <div className="mt-5 space-y-4">
                {job.status === "approved" && (
                  <Link href={`/job/${job.id}`} className="block">
                    <Button className="h-12 w-full gap-2 rounded-xl font-bold shadow-sm">
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      Lihat di Publik
                    </Button>
                  </Link>
                )}

                {(job.status === "approved" || job.status === "pending") && (
                  <div className="border-t border-border/60 pt-4">
                    <p className="mb-3 text-center text-[13px] font-medium text-muted-foreground">
                      Sudah menemukan kandidat atau ingin membatalkan rekrutmen?
                    </p>
                    <CloseJobButton jobId={job.id} />
                  </div>
                )}

                {(job.status === "closed" || job.status === "rejected") && (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/40 p-4 text-sm font-medium text-muted-foreground">
                    <ListChecks className="h-4 w-4" aria-hidden="true" />
                    Tidak ada tindakan yang tersedia.
                  </div>
                )}
              </div>
            </div>

            {/* Help */}
            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-sky-500/5 p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <LifeBuoy className="h-5 w-5 text-primary" aria-hidden="true" />
                Butuh Bantuan?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Punya pertanyaan tentang status lowongan Anda atau kendala teknis? Tim support
                kami siap membantu.
              </p>
              <Link href="/contact" className="mt-5 block">
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-xl border-primary/25 font-bold text-primary shadow-sm transition-colors hover:bg-primary/5"
                >
                  Hubungi Dukungan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}