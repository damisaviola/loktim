import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Clock, XCircle, Briefcase, Building, MapPin, ExternalLink } from "lucide-react";

export default async function ManageJobPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const job = await prisma.job.findUnique({
    where: { id: resolvedParams.id },
    include: { company: true }
  });

  if (!job) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-3xl">
      <div className="bg-card rounded-[2rem] border border-border p-8 sm:p-12 shadow-xl shadow-blue-500/5 relative overflow-hidden">
        {/* Status Header */}
        <div className="flex flex-col items-center text-center mb-10">
          {job.status === "approved" && (
            <>
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm rotate-3">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Lowongan Aktif</h1>
              <p className="text-muted-foreground mt-2 max-w-md">Lowongan Anda telah disetujui dan saat ini sedang tayang.</p>
            </>
          )}
          {job.status === "pending" && (
            <>
              <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm -rotate-3">
                <Clock className="w-10 h-10" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Menunggu Review</h1>
              <p className="text-muted-foreground mt-2 max-w-md">Lowongan Anda sedang direview oleh tim admin kami sebelum ditayangkan.</p>
            </>
          )}
          {job.status === "rejected" && (
            <>
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm rotate-3">
                <XCircle className="w-10 h-10" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Lowongan Ditolak</h1>
              <p className="text-muted-foreground mt-2 max-w-md">Mohon maaf, lowongan Anda tidak memenuhi syarat dan ketentuan kami.</p>
            </>
          )}
        </div>

        {/* Job Info */}
        <div className="bg-secondary/30 rounded-2xl p-6 border border-border/50 mb-8">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-500" /> Detail Lowongan
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Posisi</p>
              <p className="font-semibold text-foreground text-lg">{job.title}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Perusahaan</p>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{job.company.name}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Lokasi</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{job.company.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/" className="inline-block w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto font-bold rounded-xl px-8 h-12 border-border hover:bg-secondary transition-all">
              Kembali ke Beranda
            </Button>
          </Link>
          {job.status === "approved" && (
            <Link href={`/job/${job.id}`} className="inline-block w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-bold rounded-xl px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all gap-2">
                Lihat Halaman Lowongan <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
