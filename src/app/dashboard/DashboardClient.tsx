'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BarChart2, Users, Eye, TrendingUp, X, MoreHorizontal, CheckCircle2, Zap, Trophy, Shield, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardClient({ hrdJobs }: { hrdJobs: any[] }) {
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('premium');

  const handleBoostClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setShowBoostModal(true);
  };

  const packages = [
    {
      id: 'basic',
      name: 'Promosi Basic',
      price: 'Rp 25.000',
      duration: 'Per hari',
      features: ['Tampil di halaman utama', 'Highlight warna khusus'],
      icon: Zap,
    },
    {
      id: 'premium',
      name: 'Premium Prioritas',
      price: 'Rp 99.000',
      duration: 'Selama 7 hari',
      features: ['Posisi teratas di pencarian', 'Highlight eksklusif', 'Notifikasi ke kandidat yang cocok'],
      icon: Trophy,
      recommended: true,
    }
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Header Area */}
      <div className="bg-background border-b border-border mb-8">
        <div className="container mx-auto px-4 max-w-6xl py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Dasbor Perusahaan</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">Kelola lowongan dan pantau performa rekrutmen Anda.</p>
            </div>
            <Link href="/post">
              <Button className="w-full sm:w-auto font-semibold h-11 px-6 shadow-sm">
                + Pasang Lowongan Baru
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Lowongan Aktif', value: hrdJobs.length.toString(), icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Total Pelamar', value: '142', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
            { label: 'Total Tayangan', value: '8.4K', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-100' },
            { label: 'Tingkat Konversi', value: '1.6%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
          ].map((stat, i) => (
            <div key={i} className="bg-background rounded-xl border border-border/60 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Jobs Table */}
        <div className="bg-background rounded-xl border border-border/60 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-border/60 flex items-center justify-between">
            <h2 className="text-lg font-bold">Daftar Lowongan</h2>
            <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border/60 bg-muted/10 text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold w-[45%]">Posisi Pekerjaan</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Performa</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {hrdJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-muted/10 transition-colors group">
                    <td className="px-6 py-5">
                      <Link href={`/job/${job.id}`} className="font-bold text-base text-foreground hover:text-primary transition-colors block mb-1">
                        {job.title}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Dibuat: {new Date(job.postedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>Berakhir: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {job.isPremium ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200">
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          Dipromosikan
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Aktif
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-5 text-sm">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">1.2K</span>
                          <span className="text-xs text-muted-foreground">Dilihat</span>
                        </div>
                        <div className="w-px h-8 bg-border/60"></div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">45</span>
                          <span className="text-xs text-muted-foreground">Pelamar</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-100 sm:opacity-80 group-hover:opacity-100 transition-opacity">
                        {!job.isPremium && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleBoostClick(job.id)} 
                            className="font-semibold text-xs h-9 border-primary/20 text-primary hover:bg-primary/5"
                          >
                            <Zap className="w-3.5 h-3.5 mr-1.5 fill-current opacity-70" />
                            Promosikan
                          </Button>
                        )}
                        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Professional Boost Modal */}
      {showBoostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-2xl p-0 relative shadow-2xl border border-border/60 overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-border/60 bg-muted/10 relative">
              <button 
                onClick={() => setShowBoostModal(false)} 
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground hover:bg-secondary p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Tingkatkan Visibilitas Lowongan</h3>
              </div>
              <p className="text-muted-foreground pl-11">Jangkau hingga 3x lebih banyak kandidat berkualitas dan isi posisi lebih cepat.</p>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {packages.map((pkg) => (
                  <label 
                    key={pkg.id}
                    className={`relative flex flex-col p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPackage === pkg.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border/60 hover:border-border hover:bg-secondary/20'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="boost_package" 
                      value={pkg.id} 
                      checked={selectedPackage === pkg.id}
                      onChange={(e) => setSelectedPackage(e.target.value)}
                      className="sr-only" 
                    />
                    
                    {pkg.recommended && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                        Rekomendasi
                      </span>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <pkg.icon className={`w-5 h-5 ${selectedPackage === pkg.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-bold text-lg">{pkg.name}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPackage === pkg.id ? 'border-primary' : 'border-muted-foreground/30'
                      }`}>
                        {selectedPackage === pkg.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-2xl font-black">{pkg.price}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{pkg.duration}</div>
                    </div>

                    <ul className="space-y-2.5 flex-1 text-sm mt-auto">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-foreground/80">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </label>
                ))}
              </div>

              {/* Security & Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Pembayaran aman & terenkripsi</span>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto h-12 px-6 font-semibold hidden sm:flex"
                    onClick={() => setShowBoostModal(false)}
                  >
                    Batal
                  </Button>
                  <Button 
                    className="w-full sm:w-auto h-12 px-8 font-bold text-base shadow-lg shadow-primary/20"
                    onClick={() => {
                      alert(`Melanjutkan pembayaran untuk paket: ${packages.find(p => p.id === selectedPackage)?.name}`);
                      setShowBoostModal(false);
                    }}
                  >
                    Lanjutkan Pembayaran
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
