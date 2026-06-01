'use client';

import { useState } from 'react';
import { jobs } from '@/lib/dummy-data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BarChart2, Users, Eye, TrendingUp, X, MoreHorizontal } from 'lucide-react';

export default function Dashboard() {
  const [showBoostModal, setShowBoostModal] = useState(false);

  const handleBoostClick = () => {
    setShowBoostModal(true);
  };

  const hrdJobs = jobs.filter(j => j.companyId === 'c1');

  return (
    <div className="container mx-auto px-4 max-w-[1128px] mt-4 mb-10">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Dasbor Perusahaan</h1>
        <Button className="w-full sm:w-auto font-bold">Pasang Lowongan Baru</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Loker Aktif', value: '3', icon: BarChart2 },
          { label: 'Total Pelamar', value: '142', icon: Users },
          { label: 'Tayangan', value: '8.4K', icon: Eye },
          { label: 'Konversi', value: '1.6%', icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-3 sm:p-5">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 text-muted-foreground">
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">{stat.label}</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border bg-secondary/20">
          <h2 className="text-base sm:text-lg font-bold">Kelola Lowongan</h2>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border text-xs sm:text-sm text-muted-foreground">
                <th className="p-3 sm:p-4 font-semibold w-1/2">Judul Pekerjaan</th>
                <th className="p-3 sm:p-4 font-semibold">Status</th>
                <th className="p-3 sm:p-4 font-semibold">Statistik</th>
                <th className="p-3 sm:p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {hrdJobs.map((job) => (
                <tr key={job.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="p-3 sm:p-4">
                    <div className="font-bold text-sm sm:text-base text-primary hover:underline cursor-pointer">{job.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">Dibuat: {new Date(job.postedAt).toLocaleDateString('id-ID')}</div>
                  </td>
                  <td className="p-3 sm:p-4">
                    {job.isPremium ? (
                      <Badge variant="premium">Promosi</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[#057642] border-[#057642]">Aktif</Badge>
                    )}
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex flex-col text-xs sm:text-sm text-muted-foreground">
                      <span>1.200 dilihat</span>
                      <span>45 pelamar</span>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!job.isPremium && (
                        <Button variant="outline" size="sm" onClick={handleBoostClick} className="font-semibold text-xs sm:text-sm">
                          Promosikan
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showBoostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-card w-full max-w-md rounded-lg p-5 sm:p-6 relative shadow-xl">
            <button onClick={() => setShowBoostModal(false)} className="absolute top-3 right-3 text-muted-foreground hover:bg-secondary p-1 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg sm:text-xl font-bold mb-2 pr-8">Promosikan Lowongan</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">Jangkau hingga 3x lebih banyak kandidat berkualitas.</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 sm:p-4 border border-border rounded-md hover:border-primary cursor-pointer">
                <div>
                  <div className="font-bold text-sm sm:text-base">Promosi Harian</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Ditagih harian</div>
                </div>
                <div className="font-bold text-sm sm:text-base">Rp 25.000</div>
              </div>
              <div className="flex justify-between items-center p-3 sm:p-4 border-2 border-primary bg-primary/5 rounded-md relative cursor-pointer">
                <div className="absolute -top-2.5 right-4 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">REKOMENDASI</div>
                <div>
                  <div className="font-bold text-sm sm:text-base">Premium 7 Hari</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Penempatan prioritas</div>
                </div>
                <div className="font-bold text-primary text-sm sm:text-base">Rp 99.000</div>
              </div>
            </div>

            <Button className="w-full font-bold" onClick={() => {
              alert('Simulasi pembayaran sukses!');
              setShowBoostModal(false);
            }}>
              Lanjutkan Pembayaran
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
