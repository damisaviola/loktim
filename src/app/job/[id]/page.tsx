import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { jobs } from '@/lib/dummy-data';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { Building2, Briefcase, Bookmark, ExternalLink, Banknote, MapPin, GraduationCap, Users, Flag, MessageSquare, CalendarRange } from 'lucide-react';
import Link from 'next/link';
import { ShareButton } from '@/components/ShareButton';
import { JobMoreOptions } from '@/components/JobMoreOptions';
import { ApplyModal } from '@/components/ApplyModal';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  let job: any = jobs.find(j => j.id === resolvedParams.id);
  if (!job) {
    job = await prisma.job.findUnique({
      where: { id: resolvedParams.id },
      include: { company: true }
    });
  }

  if (!job) {
    return {
      title: 'Lowongan Tidak Ditemukan',
    };
  }

  return {
    title: `${job.title} di ${job.company?.name}`,
    description: job.description.substring(0, 160) + '...',
  };
}

export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  // Artificial delay to demonstrate skeleton loading
  await new Promise(resolve => setTimeout(resolve, 800));

  let job: any = jobs.find(j => j.id === resolvedParams.id);
  if (!job) {
    const dbJob = await prisma.job.findUnique({
      where: { id: resolvedParams.id },
      include: { company: true }
    });
    if (dbJob) {
      job = {
        ...dbJob,
        postedAt: dbJob.postedAt.toISOString(),
      };
    }
  }

  if (!job) {
    notFound();
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min) return "Gaji Dirahasiakan";
    const formatNumber = (num: number) => {
      return `Rp ${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    };
    if (max && min !== max) return `${formatNumber(min)} - ${formatNumber(max)}`;
    return formatNumber(min);
  };

  const gradients = [
    "from-blue-600 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-purple-600 to-fuchsia-600",
    "from-orange-500 to-amber-500",
    "from-pink-500 to-rose-500",
    "from-cyan-600 to-blue-500",
  ];
  
  const getGradient = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  const bgGradient = getGradient(job.id);

  return (
    <div className="container mx-auto px-4 lg:px-0 max-w-[1128px] mt-4 mb-24 sm:mb-10">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Job Details */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border overflow-hidden">

            {/* Header Banner */}
            <div className={`h-24 sm:h-32 relative bg-gradient-to-r ${bgGradient}`}>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>
              <div className="absolute -bottom-8 sm:-bottom-10 left-4 sm:left-6 w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-white rounded-md overflow-hidden shadow-sm flex items-center justify-center z-10">
                {(job.imageUrl || job.company?.logoUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={job.imageUrl || job.company?.logoUrl} alt={job.company?.name || "Company Logo"} className="w-full h-full object-contain p-1" />
                ) : (
                  <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                )}
              </div>
            </div>

            <div className="pt-12 sm:pt-14 px-4 sm:px-6 pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">{job.title}</h1>
                  <div className="mt-2 text-sm flex flex-wrap gap-2 sm:gap-3 items-center">
                    <span className="font-bold flex items-center gap-1.5 hover:underline cursor-pointer text-primary">
                      <Building2 className="w-4 h-4 shrink-0" />
                      {job.company?.name}
                    </span>
                    <span className="text-muted-foreground hidden sm:inline text-xs mt-0.5"> • </span>
                    <span className="text-muted-foreground">Diposting: {new Date(job.postedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{job.company?.location}</span>
                    </div>
                    {job.education && job.education !== 'Semua' && (
                      <>
                        <span className="text-muted-foreground/60">•</span>
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 shrink-0" />
                          <span>Min. {job.education}</span>
                        </div>
                      </>
                    )}
                    {job.gender && (
                      <>
                        <span className="text-muted-foreground/60">•</span>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 shrink-0" />
                          <span>{job.gender}</span>
                        </div>
                      </>
                    )}
                    {job.ageRange && (
                      <>
                        <span className="text-muted-foreground/60">•</span>
                        <div className="flex items-center gap-1.5">
                          <CalendarRange className="w-4 h-4 shrink-0" />
                          <span>{job.ageRange}</span>
                        </div>
                      </>
                    )}
                    <span className="text-muted-foreground/60">•</span>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 shrink-0" />
                      <span>{job.type}</span>
                    </div>
                    <span className="text-muted-foreground/60">•</span>
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <Banknote className="w-4 h-4 shrink-0" />
                      <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Action Buttons */}
              <div className="mt-8 hidden sm:flex flex-row gap-3 w-full">
                <ApplyModal job={job} />
                <Button variant="outline" size="icon" className="rounded-full w-12 h-12 shrink-0 text-muted-foreground hover:text-primary transition-colors" title="Simpan lowongan">
                  <Bookmark className="w-5 h-5" />
                </Button>
                <ShareButton title={job.title} className="rounded-full w-12 h-12 shrink-0 relative" />
                <JobMoreOptions />
              </div>
            </div>

            <hr className="border-border" />

            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Tentang Pekerjaan</h2>
              <div className="text-sm leading-relaxed whitespace-pre-line mb-6">
                {job.description}
              </div>

              <h3 className="text-base font-bold mb-3">Persyaratan Khusus:</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm mb-2">
                {job.requirements?.map((req: string, i: number) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Left - Company info & Ads */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
            <h2 className="font-bold text-lg mb-4">Tentang Perusahaan</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white border border-border flex items-center justify-center shrink-0">
                {(job.imageUrl || job.company?.logoUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={job.imageUrl || job.company?.logoUrl} alt={job.company?.name || "Company Logo"} className="w-full h-full object-contain p-1" />
                ) : (
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="font-semibold hover:underline cursor-pointer text-primary leading-tight">
                {job.company?.name}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {job.company?.about || `${job.company?.name} adalah perusahaan terkemuka yang berlokasi di ${job.company?.location}.`}
            </p>
            <Button variant="outline" className="w-full font-bold">+ Ikuti Perusahaan</Button>
          </div>

          <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
            <h2 className="font-bold text-lg mb-4">Rekomendasi Lowongan</h2>
            <div className="flex flex-col gap-4">
              {jobs
                .filter(j => j.id !== job.id)
                .map(j => {
                  let score = 0;
                  if (j.category === job.category) score += 3;
                  if (j.companyId === job.companyId) score += 2;
                  if (j.company?.location === job.company?.location) score += 1;
                  if (j.type === job.type) score += 1;
                  return { ...j, _score: score };
                })
                .sort((a, b) => b._score - a._score)
                .slice(0, 4)
                .map(relatedJob => (
                <Link key={relatedJob.id} href={`/job/${relatedJob.id}`} className="group flex items-start gap-3 border-b border-border last:border-0 pb-3 last:pb-0">
                  <div className="w-10 h-10 shrink-0 bg-white border border-border flex items-center justify-center overflow-hidden rounded-sm mt-0.5">
                    {relatedJob.company?.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={relatedJob.company.logoUrl} alt={relatedJob.company.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary group-hover:underline text-sm leading-tight mb-1 truncate">{relatedJob.title}</h3>
                    <div className="text-xs text-foreground font-medium mb-1 truncate">{relatedJob.company?.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0" /> {relatedJob.company?.location}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Button variant="ghost" className="w-full text-sm font-bold mt-4 text-muted-foreground">Lihat Semua</Button>
          </div>
        </div>

      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex flex-row gap-2 z-50 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.05)] dark:shadow-none">
        <ApplyModal job={job} isMobile={true} />
        <Button variant="outline" size="icon" className="rounded-full w-12 h-12 shrink-0 text-muted-foreground hover:text-primary transition-colors bg-card" title="Simpan lowongan">
          <Bookmark className="w-5 h-5" />
        </Button>
        <ShareButton title={job.title} className="rounded-full w-12 h-12 shrink-0 relative bg-card" />
        <JobMoreOptions />
      </div>

    </div>
  );
}
