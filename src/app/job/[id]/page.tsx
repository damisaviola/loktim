import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { jobs } from '@/lib/dummy-data';
import prisma from '@/lib/prisma';
import { 
  Building2, 
  Briefcase, 
  Banknote, 
  MapPin, 
  GraduationCap, 
  Users, 
  CalendarRange, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Award, 
  ShieldCheck, 
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BookmarkButton } from '@/components/BookmarkButton';
import { JobMoreOptions } from '@/components/JobMoreOptions';
import { ApplyModal } from '@/components/ApplyModal';
import DOMPurify from '@/lib/sanitize';


export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  let job: any = jobs.find(j => j.id === resolvedParams.id);
  if (!job) {
    try {
      job = await prisma.job.findUnique({
        where: { id: resolvedParams.id },
        include: { company: true }
      });
    } catch (error) {
      console.error("Database unavailable, falling back to dummy data:", error);
    }
  }

  if (!job) {
    return {
      title: 'Lowongan Tidak Ditemukan',
    };
  }

  const cleanDescription = (job.description || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  const snippet = cleanDescription.length > 160 ? cleanDescription.substring(0, 157) + '...' : cleanDescription;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lokertimika.com';
  const pageUrl = `${baseUrl}/job/${job.id}`;
  const companyName = job.company?.name || 'Perusahaan';

  return {
    title: `Lowongan Kerja ${job.title} di ${companyName}`,
    description: snippet,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `Lowongan Kerja ${job.title} - ${companyName}`,
      description: snippet,
      url: pageUrl,
      type: 'article',
      siteName: 'LokerTimika',
      images: [
        {
          url: job.imageUrl || job.company?.logoUrl || '/icon.png',
          alt: `${job.title} di ${companyName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Lowongan Kerja ${job.title} - ${companyName}`,
      description: snippet,
      images: [job.imageUrl || job.company?.logoUrl || '/icon.png'],
    },
  };
}

export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  let job: any = jobs.find(j => j.id === resolvedParams.id);
  if (!job) {
    try {
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
    } catch (error) {
      console.error("Database unavailable for job detail, falling back to dummy data:", error);
    }
  }

  if (!job) {
    notFound();
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min) return null;
    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        const val = (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1);
        return `Rp ${val} Jt`;
      }
      return `Rp ${num.toLocaleString('id-ID')}`;
    };
    if (max && min !== max) return `${formatNumber(min)} - ${formatNumber(max)} / bln`;
    return `${formatNumber(min)} / bln`;
  };

  const salary = formatSalary(job.salaryMin, job.salaryMax);
  const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;
  const isPremium = job.isPremium;

  const mapEmploymentType = (type?: string) => {
    if (!type) return "FULL_TIME";
    const t = type.toLowerCase();
    if (t.includes("penuh") || t.includes("full")) return "FULL_TIME";
    if (t.includes("paruh") || t.includes("part")) return "PART_TIME";
    if (t.includes("kontrak") || t.includes("contract")) return "CONTRACTOR";
    if (t.includes("magang") || t.includes("intern")) return "INTERN";
    if (t.includes("freelance") || t.includes("lepas")) return "OTHER";
    return "FULL_TIME";
  };

  const postedDate = job.postedAt ? new Date(job.postedAt) : new Date();
  const validThroughDate = job.deadline
    ? new Date(job.deadline)
    : new Date(postedDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.company?.name || "LokerTimika",
      "value": job.id,
    },
    "datePosted": postedDate.toISOString(),
    "validThrough": validThroughDate.toISOString(),
    "employmentType": mapEmploymentType(job.type),
    "directApply": true,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company?.name || "Perusahaan",
      "sameAs": job.contactUrl || undefined,
      "logo": job.company?.logoUrl || job.imageUrl || undefined,
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": job.location || "Timika",
        "addressLocality": job.location?.includes("Kuala Kencana") ? "Kuala Kencana" : "Timika",
        "addressRegion": "Papua Tengah",
        "postalCode": "99910",
        "addressCountry": "ID",
      },
    },
    ...(job.salaryMin ? {
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "IDR",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": job.salaryMin,
          "maxValue": job.salaryMax || job.salaryMin,
          "unitText": "MONTH",
        },
      },
    } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 mb-24 sm:mb-12">
        
        {/* Top Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 font-medium">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-primary transition-colors font-bold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Semua Lowongan</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
              {job.category || 'Umum'}
            </span>
          </div>
        </div>

        {/* 1. HERO HEADER CARD (Clean & Modern) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          
          {/* Company & Job Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="flex items-start gap-4 min-w-0 flex-1">
              
              {/* Company Logo */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {(job.imageUrl || job.company?.logoUrl) ? (
                  <Image
                    src={(job.imageUrl || job.company?.logoUrl) as string}
                    alt={job.company?.name || "Company Logo"}
                    fill
                    sizes="64px"
                    priority
                    className="object-contain p-1.5"
                  />
                ) : (
                  <Building2 className="w-7 h-7 text-slate-300" />
                )}
              </div>

              {/* Title, Badges & Company */}
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/perusahaan/${job.companyId || job.company?.id || ''}`}
                    className="font-bold text-xs sm:text-sm text-slate-600 hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span>{job.company?.name}</span>
                  </Link>

                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" /> Terverifikasi
                  </span>

                  {isPremium && (
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" /> Prioritas
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {job.title}
                </h1>
              </div>

            </div>

            {/* Top Right Action Icons */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <BookmarkButton jobId={job.id} jobTitle={job.title} className="w-11 h-11 rounded-xl shadow-2xs" iconClassName="w-4 h-4" />
              <JobMoreOptions jobId={job.id} jobTitle={job.title} />
            </div>
          </div>

          {/* Symmetrical Inline Metadata Strip with Salary */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
            {salary && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 text-xs">
                <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{salary}</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{job.location || job.company?.location || 'Timika, Papua'}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 font-medium">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{job.type || 'Full-time'}</span>
            </span>

            {job.education && job.education !== 'Semua' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Min. {job.education}</span>
              </span>
            )}

            {job.experience && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 font-medium">
                <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{job.experience}</span>
              </span>
            )}

            {job.gender && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 font-medium">
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{job.gender}</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Diposting {new Date(job.postedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
            </span>
          </div>

          {/* Action Row: Reassurance & Primary Apply Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Lamaran dikirim langsung ke perusahaan resmi tanpa perantara</span>
            </div>

            {/* Desktop Apply CTA */}
            <div className="hidden sm:block">
              <ApplyModal 
                job={job} 
                isExpired={isExpired}
                label="Lamar Sekarang"
                className="h-11 px-7 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-md"
              />
            </div>
          </div>

        </div>

        {/* 2. MAIN BODY GRID: DESCRIPTION + SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ===================== LEFT: DESCRIPTION & QUALIFICATIONS (Col 8) ===================== */}
          <div className="lg:col-span-8 space-y-6">

            {/* Description Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Deskripsi &amp; Tanggung Jawab
              </h2>

              {/* Description Content */}
              {(() => {
                const isHtml = job.description.includes('<p>') || job.description.includes('<ul>') || job.description.includes('<br>') || job.description.includes('<li>');
                const textLines = !isHtml && job.description.includes('\n') 
                  ? job.description.split('\n').map((l: string) => l.trim()).filter(Boolean)
                  : [];

                if (textLines.length > 1) {
                  return (
                    <div className="space-y-2.5 text-slate-700 text-sm leading-relaxed">
                      {textLines.map((line: string, i: number) => {
                        const numberMatch = line.match(/^(\(?\d+[\.\)]|\(?[a-zA-Z][\.\)]|\(?[ivxIVX]+[\.\)])\s*(.*)$/);
                        if (numberMatch) {
                          return (
                            <div key={i} className="flex items-start gap-2.5">
                              <span className="font-bold text-primary shrink-0 min-w-[20px]">{numberMatch[1]}</span>
                              <span className="flex-1 text-slate-700">{numberMatch[2]}</span>
                            </div>
                          );
                        }
                        const cleanText = line.replace(/^([•\-\*–—✓→]\s*)/, '');
                        return (
                          <div key={i} className="flex items-start gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                            <span className="flex-1 text-slate-700">{cleanText}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <div
                    className="text-slate-700 text-sm leading-relaxed prose prose-slate max-w-none prose-p:mb-3 prose-ul:mb-3 prose-li:my-1 prose-strong:font-bold break-words"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description) }}
                  />
                );
              })()}

              {/* Requirements Content */}
              {job.requirements && (Array.isArray(job.requirements) ? job.requirements.length > 0 : Boolean(job.requirements)) && (
                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Kualifikasi &amp; Persyaratan
                  </h3>
                  <div className="space-y-2.5 text-slate-700 text-sm leading-relaxed">
                    {(Array.isArray(job.requirements)
                      ? job.requirements
                      : typeof job.requirements === "string"
                      ? job.requirements.replace(/<li[^>]*>(.*?)<\/li>/gi, "$1\n").replace(/<\/p>|<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "").split("\n")
                      : []
                    ).map((req: string, i: number) => {
                      const trimmed = req.trim();
                      if (!trimmed) return null;

                      // 1. Check for number prefix (1., 2., a., etc)
                      const numberMatch = trimmed.match(/^(\(?\d+[\.\)]|\(?[a-zA-Z][\.\)]|\(?[ivxIVX]+[\.\)])\s*(.*)$/);
                      if (numberMatch) {
                        return (
                          <div key={i} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="font-bold text-primary shrink-0 min-w-[20px]">{numberMatch[1]}</span>
                            <span className="flex-1 text-slate-700">{numberMatch[2]}</span>
                          </div>
                        );
                      }

                      // 2. Always display bullet dot for every item
                      const cleanText = trimmed.replace(/^([•\-\*–—✓→]\s*)/, '');
                      return (
                        <div key={i} className="flex items-start gap-2.5 leading-relaxed">
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                          <span className="flex-1 text-slate-700">{cleanText}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Anti-Fraud Banner */}
            <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-5 space-y-1.5 text-amber-900">
              <div className="font-bold text-xs sm:text-sm flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Himbauan Bebas Pungli &amp; Penipuan</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-800/90">
                Seluruh proses perekrutan di LokerTimika <strong>100% GRATIS</strong>. Jangan pernah membayar biaya seragam, akomodasi, atau tiket kepada siapapun.
              </p>
            </div>

          </div>

          {/* ===================== RIGHT: STICKY SIDEBAR (Col 4) ===================== */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24">

            {/* Company Info Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <h2 className="font-bold text-xs text-slate-400 uppercase tracking-wider font-mono">Tentang Perusahaan</h2>

              <div className="flex items-start gap-3.5">
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
                    <Building2 className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/perusahaan/${job.companyId || job.company?.id || ''}`} className="font-bold hover:text-primary transition-colors text-slate-900 text-sm leading-snug block truncate">
                    {job.company?.name}
                  </Link>
                  <span className="text-xs font-medium text-slate-400 block truncate mt-0.5">{job.company?.location || 'Timika'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                {job.company?.about || `${job.company?.name} adalah perusahaan terverifikasi yang beroperasi di wilayah Timika dan sekitarnya.`}
              </p>

              <Link href={`/perusahaan/${job.companyId || job.company?.id || ''}`} className="block w-full">
                <button className="w-full h-10 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl transition-all text-xs shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>Lihat Profil Perusahaan</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </Link>
            </div>

            {/* Related Jobs Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-xs text-slate-400 uppercase tracking-wider font-mono">Lowongan Serupa</h2>
                <Link href="/jobs" className="text-[11px] font-bold text-primary hover:underline">
                  Lihat Semua
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                {jobs
                  .filter(j => j.id !== job.id)
                  .slice(0, 4)
                  .map(relatedJob => (
                    <Link key={relatedJob.id} href={`/job/${relatedJob.id}`} className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                      <div className="w-10 h-10 shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden rounded-xl mt-0.5 shadow-2xs relative">
                        {relatedJob.company?.logoUrl ? (
                          <Image
                            src={relatedJob.company.logoUrl}
                            alt={relatedJob.company.name}
                            fill
                            sizes="40px"
                            loading="lazy"
                            className="object-contain p-1"
                          />
                        ) : (
                          <Building2 className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-xs leading-snug truncate mb-0.5">{relatedJob.title}</h3>
                        <div className="text-[11px] text-slate-500 font-medium truncate">{relatedJob.company?.name}</div>
                        <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 truncate mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" /> {relatedJob.location || 'Timika'}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

          </aside>

        </div>

        {/* 3. MOBILE STICKY BOTTOM ACTION BAR */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 flex flex-row gap-2 z-50 shadow-lg pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <ApplyModal job={job} isMobile={true} isExpired={isExpired} />
          <BookmarkButton jobId={job.id} jobTitle={job.title} className="rounded-xl w-11 h-11 shrink-0 relative" />
          <JobMoreOptions jobId={job.id} jobTitle={job.title} />
        </div>

      </div>
    </>
  );
}
