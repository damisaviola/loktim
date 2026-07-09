import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Clock, XCircle, Briefcase, Building, MapPin, ExternalLink, CalendarDays } from "lucide-react";
import CloseJobButton from "./CloseJobButton";

export default async function ManageJobPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const job = await prisma.job.findUnique({
    where: { id: resolvedParams.id },
    include: { company: true }
  });

  if (!job) {
    return notFound();
  }

  const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-secondary/10 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 sm:px-8 rounded-3xl border border-border/60 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Dashboard Pengelola</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Kelola status dan pantau detail lowongan Anda dari halaman ini.</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="rounded-xl font-semibold border-border hover:bg-secondary h-11 px-6">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Main Content (Left, spans 2 cols) */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            
            {/* Job Detail Card */}
            <div className="bg-card rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-2xl transition-all group-hover:bg-primary/10"></div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4 mb-8 relative z-10">
                <div>
                  <h2 className="text-2xl font-bold text-foreground leading-tight">{job.title}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-muted-foreground text-sm font-medium">
                    <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1 rounded-full border border-border/40">
                      <Building className="w-4 h-4 text-primary" />
                      <span>{job.company.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1 rounded-full border border-border/40">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{job.company.location}</span>
                    </div>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="shrink-0 mt-2 sm:mt-0">
                  {job.status === "approved" && (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold border border-emerald-200 shadow-sm">
                      <CheckCircle2 className="w-4 h-4" /> Aktif
                    </span>
                  )}
                  {job.status === "pending" && (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-bold border border-orange-200 shadow-sm">
                      <Clock className="w-4 h-4" /> Menunggu
                    </span>
                  )}
                  {job.status === "rejected" && (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-bold border border-red-200 shadow-sm">
                      <XCircle className="w-4 h-4" /> Ditolak
                    </span>
                  )}
                  {job.status === "closed" && (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary text-muted-foreground text-sm font-bold border border-border shadow-sm">
                      <XCircle className="w-4 h-4" /> Ditutup
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-secondary/30 p-5 rounded-2xl border border-border/40">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Tipe
                  </p>
                  <p className="font-semibold text-foreground text-sm">{job.type}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" /> Diposting
                  </p>
                  <p className="font-semibold text-foreground text-sm">{dateFormatter.format(new Date(job.createdAt))}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5">
                    Kategori
                  </p>
                  <p className="font-semibold text-foreground text-sm">{job.category}</p>
                </div>
              </div>
            </div>

            {/* Status Information Box */}
            <div className="bg-card rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
              <h3 className="font-bold text-lg mb-5 text-foreground flex items-center gap-2">
                <div className="w-2 h-6 bg-primary rounded-full"></div>
                Papan Informasi
              </h3>
              
              {job.status === "approved" && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 text-emerald-900 text-sm leading-relaxed">
                  <p className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Lowongan Sedang Tayang
                  </p>
                  Lowongan Anda saat ini sedang tayang dan dapat dilihat oleh publik di beranda. Jika Anda sudah menemukan kandidat yang cocok atau lowongan sudah tidak tersedia, segera tutup lowongan ini agar tidak ada lagi pelamar yang mengirimkan lamaran.
                </div>
              )}
              {job.status === "pending" && (
                <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5 text-orange-900 text-sm leading-relaxed">
                  <p className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" /> Dalam Proses Antrean
                  </p>
                  Lowongan Anda sedang dalam antrean review oleh tim admin. Proses ini biasanya memakan waktu maksimal 1x24 jam kerja. Anda tidak perlu melakukan apapun saat ini, silakan pantau berkala halaman ini.
                </div>
              )}
              {job.status === "rejected" && (
                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 text-red-900 text-sm leading-relaxed">
                  <p className="font-semibold mb-2 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" /> Lowongan Ditolak
                  </p>
                  Lowongan Anda tidak memenuhi syarat dan ketentuan platform kami (misalnya: duplikasi, data tidak lengkap, atau menyalahi aturan). Lowongan ini tidak akan ditayangkan.
                </div>
              )}
              {job.status === "closed" && (
                <div className="bg-secondary/50 border border-border rounded-2xl p-5 text-muted-foreground text-sm leading-relaxed">
                  <p className="font-semibold mb-2 flex items-center gap-2 text-foreground">
                    <XCircle className="w-5 h-5" /> Lowongan Telah Ditutup
                  </p>
                  Lowongan ini telah Anda tutup secara manual. Lowongan ini tidak akan lagi muncul di halaman publik dan hasil pencarian. Terima kasih telah mempercayakan rekrutmen Anda di platform kami!
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Actions (Right, spans 1 col) */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-card rounded-3xl border border-border/60 p-6 sm:p-7 shadow-sm flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4"></div>
              <h3 className="font-bold text-lg text-foreground relative z-10">Tindakan Cepat</h3>
              
              <div className="space-y-4 relative z-10">
                {job.status === "approved" && (
                  <Link href={`/job/${job.id}`} className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 font-bold rounded-xl h-12 gap-2 transition-all hover:-translate-y-0.5">
                      <ExternalLink className="w-4 h-4" /> Lihat di Publik
                    </Button>
                  </Link>
                )}

                {(job.status === "approved" || job.status === "pending") && (
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-[13px] text-muted-foreground mb-3 font-medium text-center">
                      Sudah menemukan kandidat atau ingin membatalkan rekrutmen?
                    </p>
                    <CloseJobButton jobId={job.id} />
                  </div>
                )}

                {(job.status === "closed" || job.status === "rejected") && (
                  <div className="text-center text-sm font-medium text-muted-foreground bg-secondary/50 p-4 rounded-xl border border-border/40">
                    Tidak ada tindakan yang tersedia.
                  </div>
                )}
              </div>
            </div>

            {/* Help / Support Sidebar */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 sm:p-7 shadow-sm">
              <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-3 text-lg">
                <Briefcase className="w-5 h-5 text-blue-600" /> Butuh Bantuan?
              </h3>
              <p className="text-blue-800/80 text-sm leading-relaxed mb-5 font-medium">
                Punya pertanyaan tentang status lowongan Anda atau kendala teknis? Tim support kami siap membantu.
              </p>
              <Link href="/contact" className="block">
                <Button variant="outline" className="w-full bg-white border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl h-11 font-bold shadow-sm transition-all">
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
