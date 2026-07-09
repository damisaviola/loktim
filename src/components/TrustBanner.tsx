"use client";

import { Building2, Users, Briefcase, CheckCircle2 } from "lucide-react";

export function TrustBanner() {
  const stats = [
    {
      icon: <Briefcase className="w-6 h-6 text-blue-500" />,
      value: "500+",
      label: "Lowongan Aktif",
    },
    {
      icon: <Building2 className="w-6 h-6 text-blue-500" />,
      value: "150+",
      label: "Perusahaan",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      value: "10K+",
      label: "Pencari Kerja",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
      value: "100%",
      label: "Terverifikasi",
    },
  ];

  return (
    <div className="w-full mt-4 sm:mt-10 mb-8 sm:mb-16 relative z-10 px-4">
      <div className="container mx-auto max-w-[1000px]">
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 divide-x-0 md:divide-x divide-slate-200/60">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center justify-center text-center px-4 animate-fade-slide-up hover:-translate-y-1 transition-transform duration-300 cursor-default stagger-${(index % 5) + 1}`}
              >
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl mb-3 shadow-sm">
                  {stat.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
