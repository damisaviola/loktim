'use client';

import { useState, useEffect } from 'react';
import { jobs } from '@/lib/dummy-data';
import { JobCard } from '@/components/JobCard';
import { JobCardSkeleton } from '@/components/JobCardSkeleton';
import { Button } from '@/components/ui/Button';
import { JobType, EducationLevel, ExperienceLevel, Job } from '@/types';
import { Settings2, X, Search, SearchX, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [activeType, setActiveType] = useState<JobType | 'Semua'>('Semua');
  const [activeEdu, setActiveEdu] = useState<EducationLevel | 'Semua'>('Semua');
  const [activeExp, setActiveExp] = useState<ExperienceLevel | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchType = activeType === 'Semua' || job.type === activeType;
    const matchEdu = activeEdu === 'Semua' || job.education === activeEdu || job.education === 'Semua' || !job.education;
    const matchExp = activeExp === 'Semua' || job.experience === activeExp || job.experience === 'Semua' || !job.experience;
    const matchQuery = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.company?.name && job.company.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchEdu && matchExp && matchQuery;
  });

  const jobTypes = ['Semua', 'Full-time', 'Part-time', 'Magang', 'Freelance'];
  const eduLevels = ['Semua', 'SMA/SMK', 'D3', 'S1', 'S2'];
  const expLevels = ['Semua', 'Tanpa Pengalaman', '1-3 Tahun', '3-5 Tahun', '> 5 Tahun'];

  return (
    <div className="container mx-auto px-4 lg:px-0 max-w-[1128px]">
      
      {/* Banner / Header */}
      <div className="bg-card rounded-2xl p-6 sm:p-10 mb-8 text-foreground relative overflow-hidden border border-border/60 shadow-sm">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-72 h-72 bg-emerald-600/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-5">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full bg-secondary/30 p-2 rounded-2xl sm:rounded-full border border-border/40">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari posisi (mekanik, barista, admin)..." 
                className="w-full h-12 sm:h-14 pl-12 pr-10 bg-background border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl sm:rounded-full focus:outline-none text-sm sm:text-base text-foreground font-medium placeholder:text-muted-foreground transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs font-bold bg-secondary w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button 
                type="button"
                onClick={() => handleSearchChange(searchQuery)}
                className="flex-1 sm:flex-none h-12 sm:h-14 px-6 sm:w-14 sm:px-0 rounded-xl sm:rounded-full shadow-md bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-sm"
                title="Cari"
              >
                <Search className="w-5 h-5" />
                <span className="sm:hidden">Cari</span>
              </button>
              <button 
                type="button" 
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-full shrink-0 shadow-sm bg-background hover:bg-secondary text-foreground flex items-center justify-center transition-all cursor-pointer border border-border"
                onClick={() => setIsFilterOpen(true)}
                title="Filter Lanjutan"
              >
                <Settings2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-muted-foreground font-medium">Populer:</span>
            {['Freeport', 'Mekanik', 'Barista', 'Admin Gudang', 'Kuala Kencana'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleSearchChange(tag)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-foreground hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium cursor-pointer"
              >
                <Search className="w-3 h-3 text-muted-foreground" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">

        {/* Main Content - Feed */}
        <div className="w-full">
          <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 px-1">
            <div>
              <h2 className="font-bold text-lg sm:text-xl">Rekomendasi untuk Anda</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Berdasarkan profil dan riwayat pencarian</p>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">{filteredJobs.length} Lowongan</span>
          </div>

          <div className="flex flex-col">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} onClick={setSelectedJob} />
                ))
              ) : (
                <div className="py-16 px-6 flex flex-col items-center justify-center text-center bg-card/50 rounded-2xl border border-border/60 border-dashed my-4">
                  <div className="w-24 h-24 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center mb-5 text-blue-500">
                    <SearchX className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Pekerjaan tidak ditemukan</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
                    Maaf, kami tidak dapat menemukan lowongan yang sesuai dengan kata kunci atau filter pencarian Anda. Coba gunakan kata kunci lain atau hapus beberapa filter.
                  </p>
                  <Button 
                    variant="outline" 
                    className="font-semibold rounded-full px-6 border-border hover:bg-secondary transition-colors"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveType('Semua');
                      setActiveEdu('Semua');
                      setActiveExp('Semua');
                    }}
                  >
                    Hapus Semua Filter
                  </Button>
                </div>
              )}
            </div>

            {!isLoading && filteredJobs.length > 0 && (
              <div className="mt-4 text-center">
                <Button variant="outline" className="w-full sm:w-auto px-8 rounded-full border-primary text-primary hover:bg-primary/5 font-bold">
                  Tampilkan lebih banyak
                </Button>
              </div>
            )}
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60">
          <div className="bg-card w-full sm:max-w-md max-h-[85vh] rounded-t-2xl sm:rounded-2xl p-4 flex flex-col relative animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 overflow-hidden">

            <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
              <h2 className="text-lg font-bold">Filter Lanjutan</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-1 rounded-full hover:bg-secondary">
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-6 pb-20">
              <div>
                <h3 className="font-bold text-base mb-3">Tipe Pekerjaan</h3>
                <div className="flex flex-col gap-3">
                  {jobTypes.map((type) => (
                    <label key={type} className="flex items-center gap-3 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="jobTypeMobile"
                        checked={activeType === type}
                        onChange={() => setActiveType(type as any)}
                        className="w-5 h-5 text-primary accent-primary"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-bold text-base mb-3">Pengalaman Kerja</h3>
                <div className="flex flex-col gap-3">
                  {expLevels.map((level) => (
                    <label key={level} className="flex items-center gap-3 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="expLevelMobile"
                        checked={activeExp === level}
                        onChange={() => setActiveExp(level as any)}
                        className="w-5 h-5 text-primary accent-primary"
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-bold text-base mb-3">Tingkat Pendidikan</h3>
                <div className="flex flex-col gap-3">
                  {eduLevels.map((level) => (
                    <label key={level} className="flex items-center gap-3 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="eduLevelMobile"
                        checked={activeEdu === level}
                        onChange={() => setActiveEdu(level as any)}
                        className="w-5 h-5 text-primary accent-primary"
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border sm:rounded-b-2xl">
              <Button size="lg" className="w-full font-bold h-12 rounded-full" onClick={() => setIsFilterOpen(false)}>
                Terapkan Filter ({filteredJobs.length} Lowongan)
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Job Detail Side Drawer */}
      {selectedJob && (
        <>
          <div 
            className="fixed inset-0 z-[110] bg-black/60 transition-opacity animate-in fade-in duration-300"
            onClick={() => setSelectedJob(null)}
          />
          
          <div className="fixed inset-y-0 right-0 z-[120] w-full max-w-md bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-border overflow-hidden">
            <div className="flex justify-between items-center p-5 pb-4 border-b border-border">
              <h2 className="text-lg font-bold">Detail Pekerjaan</h2>
              <button onClick={() => setSelectedJob(null)} className="p-1 rounded-full hover:bg-secondary">
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white border border-border/50 flex items-center justify-center overflow-hidden rounded-lg shadow-sm shrink-0">
                  {selectedJob.company?.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selectedJob.company.logoUrl} alt={selectedJob.company.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-primary leading-tight">{selectedJob.title}</h1>
                  <div className="flex items-center gap-2 text-foreground mt-1.5">
                    <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="font-medium text-sm">{selectedJob.company?.name}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm bg-secondary/20 p-4 rounded-xl border border-border/40">
                 <div className="flex justify-between items-center py-2 border-b border-border/50">
                   <span className="text-muted-foreground">Lokasi</span>
                   <span className="font-semibold text-right">{selectedJob.company?.location}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-border/50">
                   <span className="text-muted-foreground">Tipe</span>
                   <span className="font-semibold text-[#057642] text-right">{selectedJob.type}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-border/50">
                   <span className="text-muted-foreground">Pengalaman</span>
                   <span className="font-semibold text-right">{selectedJob.experience}</span>
                 </div>
                 <div className="flex justify-between items-center py-2">
                   <span className="text-muted-foreground">Pendidikan</span>
                   <span className="font-semibold text-right">{selectedJob.education}</span>
                 </div>
                 {selectedJob.salaryMin && (
                   <div className="flex justify-between items-center py-2 border-t border-border/50">
                     <span className="text-muted-foreground">Gaji</span>
                     <span className="font-semibold text-[#057642] text-right">
                       {selectedJob.salaryMax && selectedJob.salaryMax !== selectedJob.salaryMin
                         ? `Rp ${selectedJob.salaryMin.toLocaleString('id-ID')} - Rp ${selectedJob.salaryMax.toLocaleString('id-ID')}`
                         : `Rp ${selectedJob.salaryMin.toLocaleString('id-ID')}`}
                     </span>
                   </div>
                 )}
              </div>
              
              <div className="mt-8">
                <h3 className="font-bold mb-3 text-lg">Deskripsi Pekerjaan</h3>
                <div className="text-foreground/80 text-sm whitespace-pre-wrap leading-relaxed">
                  {selectedJob.description || "Deskripsi tidak tersedia."}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-border bg-card">
              <Link href={`/job/${selectedJob.id}`} className="block w-full">
                <Button size="lg" className="w-full font-bold h-12 rounded-full shadow-md bg-blue-600 hover:bg-blue-700 text-white">
                  Lihat Selengkapnya & Lamar
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
