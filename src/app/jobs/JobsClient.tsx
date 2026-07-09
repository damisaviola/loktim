'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { JobCard } from '@/components/JobCard';
import { JobCardSkeleton } from '@/components/JobCardSkeleton';
import { Button } from '@/components/ui/Button';
import { JobType, EducationLevel, ExperienceLevel, Job } from '@/types';
import { Settings2, X, Search, SearchX, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { TypewriterSearch } from '@/components/TypewriterSearch';

export function JobsClient({ initialJobs }: { initialJobs: Job[] }) {
  const [activeType, setActiveType] = useState<JobType | 'Semua'>('Semua');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [activeEdu, setActiveEdu] = useState<EducationLevel | 'Semua'>('Semua');
  const [activeExp, setActiveExp] = useState<ExperienceLevel | 'Semua'>('Semua');
  const [activeDate, setActiveDate] = useState<string>('Semua');
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleSearchChange = (query: string) => {
    setInputValue(query);
    if (query === '') {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = () => {
    setSearchQuery(inputValue);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  useEffect(() => {
    setVisibleCount(5);
  }, [searchQuery, activeType, activeCategory, activeEdu, activeExp, activeDate]);

  const filteredJobs = useMemo(() => {
    return initialJobs.filter(job => {
      const matchType = activeType === 'Semua' || job.type === activeType;
      const matchCategory = activeCategory === 'Semua' ||
        job.category === activeCategory ||
        (activeCategory.includes('IT') && job.category?.includes('IT')) ||
        (activeCategory.includes('Admin') && job.category?.includes('Admin'));
      const matchEdu = activeEdu === 'Semua' || job.education === activeEdu || job.education === 'Semua' || !job.education;
      const matchExp = activeExp === 'Semua' || job.experience === activeExp || job.experience === 'Semua' || !job.experience;
      const matchDate = activeDate === 'Semua' || (() => {
        if (!job.postedAt) return false;
        const diffDays = (new Date().getTime() - new Date(job.postedAt).getTime()) / (1000 * 60 * 60 * 24);
        if (activeDate === '24 Jam Terakhir') return diffDays <= 1;
        if (activeDate === '3 Hari Terakhir') return diffDays <= 3;
        if (activeDate === '7 Hari Terakhir') return diffDays <= 7;
        if (activeDate === 'Bulan Ini') return diffDays <= 30;
        return true;
      })();
      const matchQuery = !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.company?.name && job.company.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchType && matchCategory && matchEdu && matchExp && matchDate && matchQuery;
    }).sort((a, b) => {
      const dateA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
      const dateB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [initialJobs, activeType, activeCategory, activeEdu, activeExp, activeDate, searchQuery]);

  const displayedJobs = filteredJobs.slice(0, visibleCount);

  const jobCategories = ['Semua', 'Pertambangan', 'Teknik & Engineering', 'Operasional', 'Admin & HR (Administrasi)', 'IT & Software', 'F&B', 'Pelayanan', 'Logistik', 'Desain/Kreatif'];
  const jobTypes = ['Semua', 'Full-time', 'Part-time', 'Kontrak', 'Magang', 'Freelance'];
  const eduLevels = ['Semua', 'SMA/SMK', 'D3', 'S1', 'S2'];
  const expLevels = ['Semua', 'Tanpa Pengalaman', '1-3 Tahun', '3-5 Tahun', '> 5 Tahun'];
  const dateFilters = ['Semua', '24 Jam Terakhir', '3 Hari Terakhir', '7 Hari Terakhir', 'Bulan Ini'];

  const latestJobs = useMemo(() => {
    return [...initialJobs]
      .filter(j => j.postedAt)
      .sort((a, b) => {
        const timeDiff = new Date(b.postedAt!).getTime() - new Date(a.postedAt!).getTime();
        if (timeDiff === 0) return a.id.localeCompare(b.id);
        return timeDiff;
      })
      .slice(0, 6);
  }, [initialJobs]);

  return (
    <div className="container mx-auto px-4 lg:px-0 max-w-[1128px]">

      {/* Compact Search Header for Jobs Page */}
      <div className="mt-4 w-full mb-10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Cari Lowongan Kerja
            </h1>
            <p className="text-base text-slate-500 font-medium mt-2">
              Temukan pekerjaan impian Anda di kawasan Mimika
            </p>
          </div>

          <div className="w-full md:flex-1 max-w-xl">
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-slate-50 p-1.5 rounded-2xl sm:rounded-full border border-slate-200">
              <div className="flex-1 px-2">
                <TypewriterSearch
                  searchQuery={inputValue}
                  onSearchChange={handleSearchChange}
                  onSearchSubmit={handleSearchSubmit}
                />
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  className="h-12 w-12 sm:h-12 sm:w-12 rounded-xl sm:rounded-full shrink-0 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                  onClick={() => setIsFilterOpen(true)}
                  title="Filter Lanjutan"
                >
                  <Settings2 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="flex-1 sm:flex-none h-12 sm:h-12 px-8 rounded-xl sm:rounded-full bg-primary hover:bg-primary/90 text-white shadow-sm flex items-center justify-center gap-2 transition-all hover-lift cursor-pointer font-bold"
                >
                  <Search className="w-4 h-4" />
                  <span className="sm:hidden">Cari</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rekomendasi Section (Horizontal Scroll) */}
      {!searchQuery && activeCategory === 'Semua' && activeType === 'Semua' && (
        <div className="mb-10 w-full overflow-hidden">
          <div className="flex justify-between items-end mb-4 px-1">
            <div>
              <h2 className="font-bold text-lg sm:text-xl">Rekomendasi untuk Anda</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Berdasarkan profil dan riwayat pencarian</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center bg-card hover:bg-secondary shadow-sm transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center bg-card hover:bg-secondary shadow-sm transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div
            ref={carouselRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 px-1 -mx-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {latestJobs.map(job => (
              <div key={`latest-${job.id}`} className="w-[85vw] sm:w-[350px] shrink-0 flex">
                <JobCard
                  job={job}
                  onClick={setSelectedJob}
                  className="w-full flex-col !flex-col mb-0 h-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

        {/* Category Filter - Mobile */}
        <div className="w-full overflow-x-auto pb-4 pt-2 px-2 -mx-2 lg:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-3 min-w-max">
            {jobCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-300 ${activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-md -translate-y-0.5'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Feed */}
        <div className={`w-full ${selectedJob ? 'lg:w-[45%]' : 'lg:w-3/4'} flex-1 transition-all duration-300`}>
          <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 px-1">
            <div>
              <h2 className="font-bold text-lg sm:text-xl">
                {searchQuery || activeCategory !== 'Semua' || activeType !== 'Semua' ? 'Hasil Pencarian' : 'Lowongan Terbaru'}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                {searchQuery || activeCategory !== 'Semua' || activeType !== 'Semua'
                  ? 'Lowongan yang sesuai dengan kriteria Anda'
                  : 'Pekerjaan yang baru saja ditambahkan'}
              </p>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">{filteredJobs.length} Lowongan</span>
          </div>

          <div className="flex flex-col gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))
            ) : displayedJobs.length > 0 ? (
              displayedJobs.map(job => (
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
                    setInputValue('');
                    setSearchQuery('');
                    setActiveCategory('Semua');
                    setActiveType('Semua');
                    setActiveEdu('Semua');
                    setActiveExp('Semua');
                    setActiveDate('Semua');
                  }}
                >
                  Hapus Semua Filter
                </Button>
              </div>
            )}
          </div>

          {!isLoading && visibleCount < filteredJobs.length && (
            <div className="mt-4 text-center">
              <Button
                onClick={() => setVisibleCount(filteredJobs.length)}
                variant="outline"
                className="w-full sm:w-auto px-8 rounded-full border-primary text-primary hover:bg-primary/5 font-bold"
              >
                Tampilkan lebih banyak
              </Button>
            </div>
          )}
        </div>

        {/* Right Sidebar - Desktop Categories or Job Details */}
        <div className={`hidden lg:flex flex-col ${selectedJob ? 'lg:w-[55%]' : 'w-1/4'} shrink-0 transition-all duration-300`}>
          {selectedJob ? (
            <div className="sticky top-24 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center p-6 pb-4 bg-white z-10">
                <h2 className="text-lg font-bold">Detail Pekerjaan</h2>
                <button onClick={() => setSelectedJob(null)} className="p-1 rounded-full hover:bg-slate-100 transition-colors">
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 lg:p-8 bg-white">
                <div className="flex items-start gap-5 mb-8">
                  <div className="relative w-16 h-16 bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden rounded-2xl shrink-0 mt-1">
                    {selectedJob.company?.logoUrl ? (
                      <Image src={selectedJob.company.logoUrl as string} alt={selectedJob.company.name} fill sizes="64px" className="object-contain p-1" />
                    ) : (
                      <Building2 className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">{selectedJob.title}</h1>
                    <div className="flex items-center gap-2 text-slate-600 mt-2.5">
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span className="font-semibold text-sm lg:text-base">{selectedJob.company?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-sm bg-slate-50/50 p-6 rounded-2xl border border-slate-100 mb-8">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-muted-foreground">Lokasi</span>
                    <span className="font-semibold text-right">{selectedJob.company?.location}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-muted-foreground">Tipe</span>
                    <span className="font-semibold text-[#057642] text-right">{selectedJob.type}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-muted-foreground">Pengalaman</span>
                    <span className="font-semibold text-right">{selectedJob.experience}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Pendidikan</span>
                    <span className="font-semibold text-right">{selectedJob.education}</span>
                  </div>
                  {selectedJob.salaryMin && (
                    <div className="flex justify-between items-center py-2 border-t border-slate-100">
                      <span className="text-muted-foreground">Gaji</span>
                      <span className="font-semibold text-[#057642] text-right">
                        {selectedJob.salaryMax && selectedJob.salaryMax !== selectedJob.salaryMin
                          ? `Rp ${selectedJob.salaryMin.toLocaleString('id-ID')} - Rp ${selectedJob.salaryMax.toLocaleString('id-ID')}`
                          : `Rp ${selectedJob.salaryMin.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-4 text-lg">Deskripsi Pekerjaan</h3>
                  {selectedJob.description ? (
                    <div
                      className="text-foreground/80 text-sm leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>li]:mb-1.5"
                      dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                    />
                  ) : (
                    <div className="text-foreground/80 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                      Deskripsi tidak tersedia.
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white z-10 border-t border-slate-50">
                <Link href={`/job/${selectedJob.id}`} className="block w-full">
                  <Button size="lg" className="w-full font-bold h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white hover:-translate-y-0.5 transition-all duration-300">
                    Lihat Selengkapnya & Lamar
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-foreground">Kategori Pekerjaan</h3>
              <div className="flex flex-col gap-2">
                {jobCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center justify-between ${activeCategory === cat
                      ? 'bg-slate-900 text-white shadow-md translate-x-2'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 hover:border-slate-200'
                      }`}
                  >
                    {cat}
                    {activeCategory === cat && <span className="w-2 h-2 rounded-full bg-white shrink-0"></span>}
                  </button>
                ))}
              </div>
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

              <div className="border-t border-border pt-4">
                <h3 className="font-bold text-base mb-3">Waktu Tayang</h3>
                <div className="flex flex-col gap-3">
                  {dateFilters.map((filter) => (
                    <label key={filter} className="flex items-center gap-3 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="dateFilterMobile"
                        checked={activeDate === filter}
                        onChange={() => setActiveDate(filter)}
                        className="w-5 h-5 text-primary accent-primary"
                      />
                      {filter}
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

      {/* Job Detail Side Drawer (Mobile Only) */}
      {selectedJob && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-[110] bg-black/60 transition-opacity animate-in fade-in duration-300"
            onClick={() => setSelectedJob(null)}
          />

          <div className="fixed inset-y-0 right-0 z-[120] w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-slate-200 overflow-hidden">
            <div className="flex justify-between items-center p-5 pb-4 border-b border-border">
              <h2 className="text-lg font-bold">Detail Pekerjaan</h2>
              <button onClick={() => setSelectedJob(null)} className="p-1 rounded-full hover:bg-secondary">
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 bg-white border border-border/50 flex items-center justify-center overflow-hidden rounded-lg shadow-sm shrink-0">
                  {selectedJob.company?.logoUrl ? (
                    <Image src={selectedJob.company.logoUrl as string} alt={selectedJob.company.name} fill sizes="64px" className="object-contain p-1" />
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
                {selectedJob.description ? (
                  <div
                    className="text-foreground/80 text-sm leading-relaxed [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>li]:mb-1"
                    dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                  />
                ) : (
                  <div className="text-foreground/80 text-sm leading-relaxed">
                    Deskripsi tidak tersedia.
                  </div>
                )}
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
        </div>
      )}
    </div>
  );
}
