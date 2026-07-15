"use client";

import React, { useState } from 'react';
import { Building2, Info } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';

interface CompanyMobileModalProps {
  job: any;
  companyJobsCount: number;
}

export function CompanyMobileModal({ job, companyJobsCount }: CompanyMobileModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-6 h-6 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 rounded-full transition-colors flex items-center justify-center lg:hidden flex-shrink-0" title="Tentang Perusahaan">
          <Info className="w-3.5 h-3.5" />
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] max-w-[calc(100vw-2rem)] w-full rounded-2xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-slate-900">Tentang Perusahaan</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 rounded-2xl">
              {(job.imageUrl || job.company?.logoUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={job.imageUrl || job.company?.logoUrl} alt={job.company?.name || "Company Logo"} className="w-full h-full object-contain p-2" />
              ) : (
                <Building2 className="w-7 h-7 text-slate-300" />
              )}
            </div>
            <div className="font-bold text-lg text-slate-900 leading-tight">
              {job.company?.name}
            </div>
          </div>
          
          <p className="text-sm text-slate-600 leading-relaxed max-h-[40vh] overflow-y-auto">
            {job.company?.about || `${job.company?.name} adalah perusahaan terkemuka yang berlokasi di ${job.company?.location}.`}
          </p>
          
          <Link href={`/perusahaan/${job.companyId || job.company?.id || ''}`} className="block w-full mt-2" onClick={() => setOpen(false)}>
            <button className="w-full h-12 border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold rounded-xl transition-colors text-sm">
              Lihat Lowongan Lainnya ({companyJobsCount + 1})
            </button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
