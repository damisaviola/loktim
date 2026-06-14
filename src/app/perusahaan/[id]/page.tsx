import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { companies, jobs as dummyJobs } from '@/lib/dummy-data';
import { JobCard } from '@/components/JobCard';
import { Building2, MapPin, Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function PerusahaanPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const companyId = resolvedParams.id;

  let company: any = companies[companyId];
  let jobs: any[] = [];

  if (!company) {
    const dbCompany = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (dbCompany) {
      company = dbCompany;
    }
  }

  if (!company) {
    // If we still don't find it, maybe search in dummyJobs if company name matched
    const jobWithCompany = dummyJobs.find(j => j.company?.id === companyId || j.companyId === companyId);
    if (jobWithCompany) {
      company = jobWithCompany.company;
    } else {
      notFound();
    }
  }

  // Find all jobs for this company
  const dbJobs = await prisma.job.findMany({
    where: { companyId: companyId, status: 'approved' },
    include: { company: true },
    orderBy: { postedAt: 'desc' }
  });
  
  const dJobs = dummyJobs.filter(j => j.companyId === companyId || j.company?.id === companyId);
  
  const combined = [...dbJobs, ...dJobs];
  const uniqueMap = new Map();
  combined.forEach(j => uniqueMap.set(j.id, j));
  jobs = Array.from(uniqueMap.values());

  return (
    <div className="container mx-auto px-4 lg:px-0 max-w-[800px] mt-8 mb-24">
      <div className="bg-card rounded-2xl border border-border overflow-hidden mb-8 shadow-sm">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-10 left-6 w-20 h-20 bg-white border-4 border-white rounded-xl overflow-hidden shadow-md flex items-center justify-center">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain p-2" />
            ) : (
              <Building2 className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="pt-14 px-6 pb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">{company.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>{company.location}</span>
          </div>
          <p className="text-foreground/80 text-sm leading-relaxed max-w-2xl">
            {company.about || `${company.name} adalah perusahaan terkemuka yang berlokasi di ${company.location}. Kami berkomitmen untuk memberikan layanan terbaik dan membuka kesempatan karir bagi talenta-talenta berbakat.`}
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Lowongan Pekerjaan ({jobs.length})
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job.id} className="block">
              <JobCard job={job} />
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-border border-dashed">
            <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-foreground mb-1">Belum ada lowongan</h3>
            <p className="text-muted-foreground text-sm">Perusahaan ini belum membuka lowongan pekerjaan baru.</p>
          </div>
        )}
      </div>
    </div>
  );
}
