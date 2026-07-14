import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { jobs } from '@/lib/dummy-data';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { Building2, Briefcase, ExternalLink, Banknote, MapPin, GraduationCap, Users, Flag, MessageSquare, CalendarRange } from 'lucide-react';
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

  let companyJobs: any[] = [];
  if (job.companyId) {
    const dbCompanyJobs = await prisma.job.findMany({
      where: { companyId: job.companyId, status: 'approved' },
      include: { company: true },
      orderBy: { postedAt: 'desc' }
    });
    const dummyCompanyJobs = jobs.filter(j => j.companyId === job.companyId);

    const combined = [...dbCompanyJobs, ...dummyCompanyJobs].filter(j => j.id !== job.id);
    const uniqueMap = new Map();
    combined.forEach(j => uniqueMap.set(j.id, j));
    companyJobs = Array.from(uniqueMap.values());
  } else if (job.company?.name) {
    companyJobs = jobs.filter(j => j.company?.name === job.company?.name && j.id !== job.id);
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
    "from-blue-600 to-primary",
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

  const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;

  return (
    <div className="container mx-auto px-4 lg:px-0 max-w-[1200px] mt-4 mb-24 sm:mb-10 py-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Job Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Bento */}
          <div className="bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[24px]">
            {/* Header Banner */}
            <div className={`h-24 sm:h-32 relative bg-primary rounded-t-[24px] overflow-hidden`}>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400 to-transparent"></div>
            </div>

            <div className="px-6 sm:px-8 pb-8 relative">
              <div className="absolute -top-12 left-6 sm:left-8 w-20 h-20 sm:w-24 sm:h-24 bg-white border-4 border-white rounded-2xl overflow-hidden shadow-sm flex items-center justify-center z-10">
                {(job.imageUrl || job.company?.logoUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={job.imageUrl || job.company?.logoUrl} alt={job.company?.name || "Company Logo"} className="w-full h-full object-contain p-2" />
                ) : (
                  <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300" />
                )}
              </div>

              <div className="pt-14 sm:pt-16">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-2">{job.title}</h1>
                    <div className="text-sm flex flex-wrap gap-2 sm:gap-3 items-center">
                      <Link href={`/perusahaan/${job.companyId || job.company?.id || ''}`} className="font-bold flex items-center gap-1.5 hover:text-blue-600 cursor-pointer text-slate-600 transition-colors">
                        <Building2 className="w-4 h-4 shrink-0" />
                        {job.company?.name}
                      </Link>
                      <span className="text-slate-300 hidden sm:inline text-xs mt-0.5"> • </span>
                      <span className="text-slate-500 font-medium">Diposting: {new Date(job.postedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      {job.deadline && (
                        <>
                          <span className="text-slate-300 hidden sm:inline text-xs mt-0.5"> • </span>
                          <span className={`font-bold ${isExpired ? 'text-red-500' : 'text-orange-500'}`}>
                            Batas: {new Date(job.deadline).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Micro Bento Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60 flex items-center gap-3">
                     <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                     <div className="min-w-0">
                       <span className="block text-[10px] font-bold uppercase text-slate-400">Lokasi</span>
                       <span className="text-sm font-semibold text-slate-700 truncate block">{job.company?.location}</span>
                     </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60 flex items-center gap-3">
                     <Briefcase className="w-5 h-5 text-slate-400 shrink-0" />
                     <div className="min-w-0">
                       <span className="block text-[10px] font-bold uppercase text-slate-400">Tipe</span>
                       <span className="text-sm font-semibold text-slate-700 truncate block">{job.type}</span>
                     </div>
                  </div>
                  {job.education && (
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60 flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase text-slate-400">Pendidikan</span>
                        <span className="text-sm font-semibold text-slate-700 truncate block">{job.education === 'Semua' ? 'Semua' : job.education}</span>
                      </div>
                    </div>
                  )}
                  {job.salaryMin && (
                    <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/60 flex items-center gap-3">
                      <Banknote className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase text-emerald-600/70">Gaji</span>
                        <span className="text-sm font-bold text-emerald-700 block whitespace-nowrap overflow-hidden text-ellipsis" title={job.salaryMax && job.salaryMax !== job.salaryMin ? `${formatSalary(job.salaryMin)} - ${formatSalary(job.salaryMax)}` : formatSalary(job.salaryMin)}>
                          {job.salaryMax && job.salaryMax !== job.salaryMin
                            ? `${formatSalary(job.salaryMin)} - ${formatSalary(job.salaryMax)}`
                            : formatSalary(job.salaryMin)}
                        </span>
                      </div>
                    </div>
                  )}
                  {job.gender && (
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60 flex items-center gap-3">
                      <Users className="w-5 h-5 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase text-slate-400">Gender</span>
                        <span className="text-sm font-semibold text-slate-700 truncate block">{job.gender}</span>
                      </div>
                    </div>
                  )}
                  {job.ageRange && (
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60 flex items-center gap-3">
                      <CalendarRange className="w-5 h-5 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase text-slate-400">Usia</span>
                        <span className="text-sm font-semibold text-slate-700 truncate block">{job.ageRange}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Action Buttons */}
                <div className="mt-8 hidden sm:flex flex-row gap-3 w-full">
                  <ApplyModal job={job} isExpired={isExpired} />
                  <ShareButton title={job.title} className="rounded-xl w-12 h-12 shrink-0 relative bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 shadow-sm" />
                  <JobMoreOptions jobId={job.id} />
                </div>
              </div>
            </div>
          </div>

          {/* Description Bento */}
          <div className="bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[24px] p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-6 text-slate-900">Tentang Pekerjaan</h2>
            <div
              className="text-slate-600 leading-relaxed mb-8 prose prose-slate max-w-none prose-p:mb-4 prose-ul:mb-4 prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />

            {job.requirements && job.requirements.length > 0 && (
              <>
                <h3 className="text-base font-bold mb-4 text-slate-900 uppercase tracking-wide text-sm">Persyaratan Khusus:</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-2">
                  {job.requirements.map((req: string, i: number) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Sidebar Left - Company info & Ads */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[24px] p-6">
            <h2 className="font-bold text-lg mb-5 text-slate-900">Tentang Perusahaan</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 rounded-2xl">
                {(job.imageUrl || job.company?.logoUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={job.imageUrl || job.company?.logoUrl} alt={job.company?.name || "Company Logo"} className="w-full h-full object-contain p-2" />
                ) : (
                  <Building2 className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <div className="font-bold hover:text-blue-600 transition-colors cursor-pointer text-slate-900 leading-tight">
                {job.company?.name}
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {job.company?.about || `${job.company?.name} adalah perusahaan terkemuka yang berlokasi di ${job.company?.location}.`}
            </p>
            <Link href={`/perusahaan/${job.companyId || job.company?.id || ''}`} className="block w-full">
              <button className="w-full h-10 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl transition-colors text-sm">
                Lihat Lowongan Lainnya ({companyJobs.length + 1})
              </button>
            </Link>
          </div>

          <div className="bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[24px] p-6">
            <h2 className="font-bold text-lg mb-5 text-slate-900">Rekomendasi</h2>
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
                  <Link key={relatedJob.id} href={`/job/${relatedJob.id}`} className="group flex items-start gap-3 border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <div className="w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden rounded-xl mt-0.5 transition-transform group-hover:scale-105">
                      {relatedJob.company?.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={relatedJob.company.logoUrl} alt={relatedJob.company.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <Building2 className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm leading-tight mb-1 truncate">{relatedJob.title}</h3>
                      <div className="text-xs text-slate-600 font-medium mb-1 truncate">{relatedJob.company?.name}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0" /> {relatedJob.company?.location}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
            <button className="w-full text-sm font-bold mt-2 text-slate-500 hover:text-slate-900 transition-colors">Lihat Semua</button>
          </div>
        </div>

      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex flex-row gap-2 z-50 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        <ApplyModal job={job} isMobile={true} isExpired={isExpired} />

        <ShareButton title={job.title} className="rounded-xl w-12 h-12 shrink-0 relative bg-slate-50 border border-slate-200 text-slate-600" />
        <JobMoreOptions jobId={job.id} />
      </div>

    </div>
  );
}
