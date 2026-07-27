import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { companies as dummyCompanies } from '@/lib/dummy-data';
import Link from 'next/link';
import { Building2, MapPin, Briefcase, Search, Sparkles, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Daftar Perusahaan | Portal Loker Mimika',
  description: 'Jelajahi berbagai perusahaan mitra dan instansi di Mimika yang membuka lowongan kerja.',
};

export default async function PublicCompaniesPage() {
  let companiesList: any[] = [];

  try {
    const dbCompanies = await prisma.company.findMany({
      include: {
        jobs: {
          where: { status: 'approved' }
        }
      },
      orderBy: { name: 'asc' }
    });

    const formattedDbCompanies = dbCompanies.map(c => ({
      id: c.id,
      name: c.name,
      location: c.location,
      logoUrl: c.logoUrl,
      about: c.about,
      jobCount: c.jobs.length
    }));

    // Merge dummy companies if any
    const dummyList = Object.values(dummyCompanies).map(c => ({
      ...c,
      jobCount: 1
    }));

    const map = new Map();
    [...formattedDbCompanies, ...dummyList].forEach(comp => {
      if (!map.has(comp.name.toLowerCase())) {
        map.set(comp.name.toLowerCase(), comp);
      }
    });

    companiesList = Array.from(map.values());
  } catch (error) {
    console.error("Failed to load companies:", error);
    companiesList = Object.values(dummyCompanies).map(c => ({
      ...c,
      jobCount: 1
    }));
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 mb-24">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Perusahaan Terverifikasi</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Daftar Perusahaan Mitra
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-xl leading-relaxed">
            Temukan profil instansi, kontraktor, dan perusahaan yang sedang aktif membuka lowongan pekerjaan di wilayah Mimika & sekitarnya.
          </p>
        </div>
        
        {/* Glow */}
        <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>
      </div>

      {/* Grid of Company Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Semua Perusahaan ({companiesList.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {companiesList.map((company) => (
            <Link
              key={company.id}
              href={`/perusahaan/${company.id}`}
              className="bg-white border border-slate-200/80 hover:border-primary/40 shadow-2xs hover:shadow-md rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                    {company.logoUrl ? (
                      <Image
                        src={company.logoUrl}
                        alt={company.name}
                        fill
                        sizes="56px"
                        loading="lazy"
                        className="object-contain p-2"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <h3 className="font-bold text-base text-slate-900 leading-snug group-hover:text-primary transition-colors truncate">
                      {company.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{company.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 min-h-[36px]">
                  {company.about || `${company.name} berlokasi di ${company.location} dan siap merekrut talenta terbaik.`}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-100">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>{company.jobCount} Lowongan</span>
                </span>

                <span className="text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Lihat Profil <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
