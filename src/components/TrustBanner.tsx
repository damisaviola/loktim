"use client";

import { Building2, Users, Briefcase, CheckCircle2 } from "lucide-react";

export function TrustBanner() {
  const stats = [
    {
      icon: <Briefcase className="w-5 h-5 text-slate-500" />,
      value: "500+",
      label: "Lowongan Aktif",
    },
    {
      icon: <Building2 className="w-5 h-5 text-slate-500" />,
      value: "150+",
      label: "Perusahaan",
    },
    {
      icon: <Users className="w-5 h-5 text-slate-500" />,
      value: "10K+",
      label: "Pencari Kerja",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      value: "100%",
      label: "Terverifikasi",
    },
  ];

  return (
    <div className="w-full py-8 px-4">
      <div className="container mx-auto max-w-[1000px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                {stat.icon}
                <span className="text-xs sm:text-sm font-medium">{stat.label}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
