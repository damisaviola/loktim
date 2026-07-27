import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { jobs } from '@/lib/dummy-data';
import prisma from '@/lib/prisma';
import { Building2, Briefcase, Banknote, MapPin, GraduationCap, Users, CalendarRange, Clock, Sparkles, ChevronRight, Award, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ShareButton } from '@/components/ShareButton';
import { JobMoreOptions } from '@/components/JobMoreOptions';
import { ApplyModal } from '@/components/ApplyModal';
import { CompanyMobileModal } from '@/components/CompanyMobileModal';

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

  // Artificial delay for skeleton loading demo
  await new Promise(resolve => setTimeout(resolve, 400));

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
      if (num >= 1000000) {
        const val = (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1);
        return `Rp ${val} Jt`;
      }
      return `Rp ${num.toLocaleString('id-ID')}`;
    };
    if (max && min !== max) return `${formatNumber(min)} - ${formatNumber(max)}`;
    return formatNumber(min);
  };

  const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;
  const isPremium = job.isPremium;

  return (
    <div className="max-w-[1280px] mx-auto px-3 sm:px-6 py-3 sm:py-8 space-y-5 sm:space-y-6 mb-28 sm:mb-12">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-5 sm:space-y-6">
          
          {/* Header Card */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl sm:rounded-3xl relative">
            
            {/* Ambient Hero Banner */}
            <div className="h-24 sm:h-36 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 relative overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
                {isPremium && (
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" /> Promosi Lowongan
                  </span>
                )}
              </div>
            </div>

            {/* Profile Info Container */}
            <div className="px-4 sm:px-8 pb-6 sm:pb-8 relative">
              
              {/* Logo Avatar */}
              <div className="absolute -top-8 sm:-top-10 left-4 sm:left-8 w-16 h-16 sm:w-24 sm:h-24 bg-white border-2 sm:border-4 border-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md flex items-center justify-center z-10">
                {(job.imageUrl || job.company?.logoUrl) ? (
                  <Image 
                    src={(job.imageUrl || job.company?.logoUrl) as string} 
                    alt={job.company?.name || "Company Logo"} 
                    fill 
                    sizes="(max-width: 640px) 64px, 96px" 
                    priority 
                    className="object-contain p-1.5 sm:p-2" 
                  />
                ) : (
                  <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
                )}
              </div>

              {/* Title & Metadata */}
              <div className="pt-10 sm:pt-16 space-y-3 sm:space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                    <Link 
                      href={`/perusahaan/${job.companyId || job.company?.id || ''}`} 
                      className="font-bold text-xs sm:text-sm text-slate-600 hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[160px] sm:max-w-none">{job.company?.name}</span>
                    </Link>
                    <CompanyMobileModal job={job} companyJobsCount={companyJobs.length} />
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-600 shrink-0" /> Terverifikasi
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug break-words">
                    {job.title}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-500">
                  <span className="bg-slate-100 text-slate-700 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                    Diposting: {new Date(job.postedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {job.deadline && (
                    <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg ${isExpired ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                      Batas: {new Date(job.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>

                {/* Micro Bento Info Grid (100% Symmetrical 6-Grid Box) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                  
                  {/* Item 1: Lokasi */}
                  <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-slate-100/80 flex items-center gap-2.5 sm:gap-3 h-full">
                     <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 shadow-2xs">
                        <MapPin className="w-4 h-4" />
                     </div>
                     <div className="min-w-0 flex-1">
                       <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Lokasi Penempatan</span>
                       <span className="text-[11px] sm:text-xs font-bold text-slate-800 truncate block">{job.location || job.company?.location || '-'}</span>
                     </div>
                  </div>

                  {/* Item 2: Tipe Kontrak */}
                  <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-slate-100/80 flex items-center gap-2.5 sm:gap-3 h-full">
                     <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 shadow-2xs">
                        <Briefcase className="w-4 h-4" />
                     </div>
                     <div className="min-w-0 flex-1">
                       <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Tipe Kontrak</span>
                       <span className="text-[11px] sm:text-xs font-bold text-slate-800 truncate block">{job.type || 'Full-time'}</span>
                     </div>
                  </div>

                  {/* Item 3: Kisaran Gaji */}
                  <div className="bg-emerald-50/70 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-emerald-100 flex items-center gap-2.5 sm:gap-3 h-full">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-600">Kisaran Gaji</span>
                      <span className="text-[11px] sm:text-xs font-extrabold text-emerald-700 truncate block">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                    </div>
                  </div>

                  {/* Item 4: Pendidikan */}
                  <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-slate-100/80 flex items-center gap-2.5 sm:gap-3 h-full">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 shadow-2xs">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Pendidikan</span>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-800 truncate block">{!job.education || job.education === 'Semua' ? 'Semua Minimal' : job.education}</span>
                    </div>
                  </div>

                  {/* Item 5: Pengalaman */}
                  <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-slate-100/80 flex items-center gap-2.5 sm:gap-3 h-full">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 shadow-2xs">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Pengalaman</span>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-800 truncate block">{job.experience || 'Tanpa Pengalaman'}</span>
                    </div>
                  </div>

                  {/* Item 6: Gender */}
                  <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-slate-100/80 flex items-center gap-2.5 sm:gap-3 h-full">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 shadow-2xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Gender</span>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-800 truncate block">{job.gender || 'Pria/Wanita'}</span>
                    </div>
                  </div>

                </div>

                {/* Desktop Action CTA Buttons */}
                <div className="hidden sm:flex flex-row gap-3 pt-2 w-full">
                  <ApplyModal job={job} isExpired={isExpired} />
                  <ShareButton title={job.title} className="rounded-2xl w-11 h-11 shrink-0 relative bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600 shadow-2xs" />
                  <JobMoreOptions jobId={job.id} />
                </div>

              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">Deskripsi & Tanggung Jawab</h2>
            
            <div
              className="text-slate-600 text-xs sm:text-sm leading-relaxed prose prose-slate max-w-none prose-p:mb-3 sm:prose-p:mb-4 prose-ul:mb-3 sm:prose-ul:mb-4 prose-li:my-1 prose-strong:font-bold prose-headings:font-bold break-words overflow-hidden"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />

            {job.requirements && job.requirements.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">Persyaratan Khusus</h3>
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 break-words">
                  {job.requirements.map((req: string, i: number) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Mobile Company Summary Card */}
          <div className="lg:hidden bg-white border border-slate-200/80 shadow-xs rounded-2xl p-5 space-y-4">
            <h2 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Tentang Perusahaan</h2>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 rounded-xl shadow-2xs relative overflow-hidden">
                {(job.imageUrl || job.company?.logoUrl) ? (
                  <Image 
                    src={(job.imageUrl || job.company?.logoUrl) as string} 
                    alt={job.company?.name || "Company Logo"} 
                    fill 
                    sizes="48px" 
                    loading="lazy" 
                    className="object-contain p-1.5" 
                  />
                ) : (
                  <Building2 className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/perusahaan/${job.companyId || job.company?.id || ''}`} className="font-bold hover:text-primary transition-colors text-slate-900 text-xs sm:text-sm leading-snug block truncate">
                  {job.company?.name}
                </Link>
                <span className="text-[11px] font-medium text-slate-400 block truncate">{job.company?.location}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
              {job.company?.about || `${job.company?.name} berlokasi di ${job.company?.location} dan saat ini membuka lowongan kerja baru.`}
            </p>

            <Link href={`/perusahaan/${job.companyId || job.company?.id || ''}`} className="block w-full">
              <button className="w-full h-9 border border-slate-200/80 text-slate-700 hover:bg-slate-50 font-bold rounded-xl transition-all text-xs shadow-2xs flex items-center justify-center gap-1 cursor-pointer">
                <span>Profil & Lowongan Lainnya</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Company Summary Card (Desktop) */}
          <div className="hidden lg:block bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 space-y-5">
            <h2 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Tentang Perusahaan</h2>
            
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 rounded-2xl shadow-2xs relative overflow-hidden">
                {(job.imageUrl || job.company?.logoUrl) ? (
                  <Image 
                    src={(job.imageUrl || job.company?.logoUrl) as string} 
                    alt={job.company?.name || "Company Logo"} 
                    fill 
                    sizes="56px" 
                    loading="lazy" 
                    className="object-contain p-2" 
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <div className="min-w-0">
                <Link href={`/perusahaan/${job.companyId || job.company?.id || ''}`} className="font-bold hover:text-primary transition-colors text-slate-900 text-sm leading-snug block truncate">
                  {job.company?.name}
                </Link>
                <span className="text-xs font-medium text-slate-400 block truncate">{job.company?.location}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {job.company?.about || `${job.company?.name} berlokasi di ${job.company?.location} dan saat ini membuka lowongan kerja baru.`}
            </p>

            <Link href={`/perusahaan/${job.companyId || job.company?.id || ''}`} className="block w-full">
              <button className="w-full h-10 border border-slate-200/80 text-slate-700 hover:bg-slate-50 font-bold rounded-2xl transition-all text-xs shadow-2xs flex items-center justify-center gap-1 cursor-pointer">
                <span>Lihat Profil & Lowongan Lainnya</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </Link>
          </div>

          {/* Related Jobs Recommendation Card */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4">
            <h2 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">Lowongan Serupa</h2>
            
            <div className="flex flex-col gap-3">
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
                  <Link key={relatedJob.id} href={`/job/${relatedJob.id}`} className="group flex items-start gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden rounded-xl mt-0.5 shadow-2xs relative">
                      {relatedJob.company?.logoUrl ? (
                        <Image 
                          src={relatedJob.company.logoUrl} 
                          alt={relatedJob.company.name} 
                          fill 
                          sizes="44px" 
                          loading="lazy" 
                          className="object-contain p-1.5" 
                        />
                      ) : (
                        <Building2 className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-xs leading-snug truncate mb-0.5">{relatedJob.title}</h3>
                      <div className="text-[11px] text-slate-500 font-medium truncate mb-1">{relatedJob.company?.name}</div>
                      <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0" /> {relatedJob.location || relatedJob.company?.location || 'Timika'}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            <Link href="/jobs" className="block w-full text-center text-xs font-bold pt-2 text-slate-500 hover:text-slate-900 transition-colors">
              Lihat Semua Lowongan →
            </Link>
          </div>

        </div>

      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 flex flex-row gap-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <ApplyModal job={job} isMobile={true} isExpired={isExpired} />
        <ShareButton title={job.title} className="rounded-2xl w-11 h-11 shrink-0 relative bg-slate-50 border border-slate-200/80 text-slate-600" />
        <JobMoreOptions jobId={job.id} />
      </div>

    </div>
  );
}
