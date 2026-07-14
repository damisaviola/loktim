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
    <div className="container mx-auto px-4 lg:px-0 max-w-[1200px] py-6">

      {/* Bento Header */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-primary text-white rounded-[24px] p-6 sm:p-8 flex flex-col justify-center shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-2">
              Cari Karier
            </h1>
            <p className="text-blue-100 font-medium mb-6">
              Temukan pekerjaan impian di Mimika
            </p>
            <div className="flex gap-5 items-center">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">450+</span>
                <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">Lowongan</span>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">82</span>
                <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">Perusahaan</span>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-400/20 blur-3xl rounded-full"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full mix-blend-overlay"></div>
        </div>

        <div className="bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[24px] p-5 sm:p-8 lg:col-span-2 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 to-transparent pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row gap-3 w-full relative z-10">
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-2 shadow-inner">
              <TypewriterSearch
                searchQuery={inputValue}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                className="h-12 w-12 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm lg:hidden"
                onClick={() => setIsFilterOpen(true)}
              >
                <Settings2 className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="flex-1 sm:flex-none h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-[0_4px_12px_rgba(2,108,160,0.2)] flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 font-bold"
              >
                <Search className="w-4 h-4" />
                <span className="sm:hidden">Cari</span>
              </button>
            </div>
          </div>

          <div className="mt-4 hidden sm:flex items-center gap-3 relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Populer:</span>
            <div className="flex gap-2">
              {['Freeport', 'Admin', 'Operator', 'IT Support'].map(kw => (
                <button 
                  key={kw} 
                  onClick={() => {
                    handleSearchChange(kw);
                    setTimeout(() => handleSearchSubmit(), 100);
                  }} 
                  className="px-3 py-1.5 bg-slate-50/80 border border-slate-200/80 rounded-lg text-xs font-bold text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rekomendasi Section (Horizontal Scroll) */}
      {!searchQuery && activeCategory === 'Semua' && activeType === 'Semua' && (
        <div className="mb-6 w-full">
          <div className="flex justify-between items-end mb-3 px-1">
            <div>
              <h2 className="font-bold text-lg text-slate-900">Rekomendasi</h2>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 transition-colors text-slate-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 transition-colors text-slate-500"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div
            ref={carouselRef}
            className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 px-1 -mx-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {latestJobs.map(job => (
              <div key={`latest-${job.id}`} className="w-[85vw] sm:w-[340px] shrink-0 flex">
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

      {/* Main Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left Sidebar - Filters (Desktop) */}
        <div className="hidden lg:flex flex-col w-[260px] shrink-0 gap-4">
          <div className="bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[24px] p-5 sticky top-24">
            <h3 className="font-bold text-base text-slate-900 mb-4">Kategori</h3>
            <div className="flex flex-col gap-1.5">
              {jobCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <hr className="my-6 border-slate-100" />
            
            <h3 className="font-bold text-base text-slate-900 mb-4">Tipe Pekerjaan</h3>
            <div className="flex flex-col gap-2.5">
              {jobTypes.map((type) => (
                <label key={type} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="jobType"
                    checked={activeType === type}
                    onChange={() => setActiveType(type as any)}
                    className="w-4 h-4 text-blue-600 accent-blue-600"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter - Mobile */}
        <div className="w-full overflow-x-auto pb-4 pt-1 px-1 -mx-1 lg:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-2.5 min-w-max">
            {jobCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl whitespace-nowrap text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Feed */}
        <div className={`flex-1 transition-all duration-300 min-w-0`}>
          <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between items-start gap-2 px-1">
            <h2 className="font-bold text-lg text-slate-900">
              {searchQuery || activeCategory !== 'Semua' || activeType !== 'Semua' ? 'Hasil Pencarian' : 'Semua Lowongan'}
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0">
              {filteredJobs.length} Lowongan
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))
            ) : displayedJobs.length > 0 ? (
              displayedJobs.map(job => (
                <JobCard key={job.id} job={job} onClick={setSelectedJob} />
              ))
            ) : (
              <div className="py-16 px-6 flex flex-col items-center justify-center text-center bg-white rounded-[24px] border border-slate-200 border-dashed">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  <SearchX className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Tidak ditemukan</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Coba sesuaikan filter atau kata kunci pencarian Anda.
                </p>
                <Button
                  variant="outline"
                  className="font-semibold rounded-xl"
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
                  Reset Filter
                </Button>
              </div>
            )}
          </div>

          {!isLoading && visibleCount < filteredJobs.length && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setVisibleCount(filteredJobs.length)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-colors text-sm shadow-sm bg-white"
              >
                Tampilkan lebih banyak
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar - Job Details (Desktop Bento) */}
        {selectedJob && (
          <div className="hidden lg:flex flex-col w-[380px] shrink-0 transition-all duration-300">
            <div className="sticky top-24 bg-white rounded-[24px] border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-[calc(100vh-7rem)] animate-in fade-in slide-in-from-right-4">
              
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white/80 backdrop-blur z-10">
                <h2 className="font-bold text-slate-900">Detail</h2>
                <button onClick={() => setSelectedJob(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-6">
                
                {/* Title Section */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative w-14 h-14 bg-white border border-slate-100 flex items-center justify-center rounded-2xl shrink-0 shadow-sm">
                    {selectedJob.company?.logoUrl ? (
                      <Image src={selectedJob.company.logoUrl as string} alt={selectedJob.company.name} fill sizes="56px" className="object-contain p-2" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 leading-tight mb-1">{selectedJob.title}</h1>
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{selectedJob.company?.name}</span>
                    </div>
                  </div>
                </div>

                {/* Micro Bento Info Grid */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60">
                    <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Lokasi</span>
                    <span className="text-sm font-semibold text-slate-700">{selectedJob.company?.location}</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60">
                    <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Tipe</span>
                    <span className="text-sm font-semibold text-slate-700">{selectedJob.type}</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60">
                    <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Pengalaman</span>
                    <span className="text-sm font-semibold text-slate-700">{selectedJob.experience}</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60">
                    <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Pendidikan</span>
                    <span className="text-sm font-semibold text-slate-700">{selectedJob.education}</span>
                  </div>
                  {selectedJob.salaryMin && (
                    <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/60 col-span-2">
                      <span className="block text-[10px] font-bold uppercase text-emerald-600/70 mb-1">Gaji</span>
                      <span className="text-sm font-bold text-emerald-700">
                        {selectedJob.salaryMax && selectedJob.salaryMax !== selectedJob.salaryMin
                          ? `Rp ${selectedJob.salaryMin.toLocaleString('id-ID')} - Rp ${selectedJob.salaryMax.toLocaleString('id-ID')}`
                          : `Rp ${selectedJob.salaryMin.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Deskripsi Pekerjaan</h3>
                  {selectedJob.description ? (
                    <div
                      className="text-slate-600 text-sm leading-relaxed prose prose-sm prose-slate max-w-none prose-p:mb-3 prose-ul:mb-3 prose-li:my-0.5"
                      dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                    />
                  ) : (
                    <div className="text-slate-500 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                      Deskripsi tidak tersedia.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 bg-white border-t border-slate-100 z-10">
                <Link href={`/job/${selectedJob.id}`} className="block w-full">
                  <button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm">
                    Lamar Pekerjaan
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-primary/40 backdrop-blur-sm">
          <div className="bg-white w-full sm:max-w-md max-h-[85vh] rounded-t-[24px] sm:rounded-[24px] p-5 flex flex-col relative animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
              <h2 className="font-bold text-lg">Filter</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 space-y-6 pb-20">
              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wide">Tipe Pekerjaan</h3>
                <div className="grid grid-cols-2 gap-2">
                  {jobTypes.map((type) => (
                    <label key={type} className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-colors text-sm font-semibold ${activeType === type ? 'bg-primary border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <input
                        type="radio"
                        name="jobTypeMobile"
                        checked={activeType === type}
                        onChange={() => setActiveType(type as any)}
                        className="hidden"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              {/* Additional filters can be added here in similar bento style */}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 sm:rounded-b-[24px]">
              <button className="w-full font-bold h-12 rounded-xl bg-primary text-white" onClick={() => setIsFilterOpen(false)}>
                Terapkan ({filteredJobs.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Side Drawer (Mobile Only) */}
      {selectedJob && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-[110] bg-primary/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={() => setSelectedJob(null)} />
          <div className="fixed inset-y-0 right-0 z-[120] w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h2 className="font-bold">Detail</h2>
              <button onClick={() => setSelectedJob(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Same content as desktop drawer */}
            <div className="overflow-y-auto flex-1 p-5">
              <div className="flex items-start gap-4 mb-6">
                  <div className="relative w-14 h-14 bg-white border border-slate-100 flex items-center justify-center rounded-2xl shrink-0 shadow-sm">
                    {selectedJob.company?.logoUrl ? (
                      <Image src={selectedJob.company.logoUrl as string} alt={selectedJob.company.name} fill sizes="56px" className="object-contain p-2" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-slate-900 leading-tight mb-1">{selectedJob.title}</h1>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{selectedJob.company?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60">
                    <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Lokasi</span>
                    <span className="text-sm font-semibold text-slate-700">{selectedJob.company?.location}</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60">
                    <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Tipe</span>
                    <span className="text-sm font-semibold text-slate-700">{selectedJob.type}</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60">
                    <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Pengalaman</span>
                    <span className="text-sm font-semibold text-slate-700">{selectedJob.experience}</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60">
                    <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Pendidikan</span>
                    <span className="text-sm font-semibold text-slate-700">{selectedJob.education}</span>
                  </div>
                  {selectedJob.salaryMin && (
                    <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/60 col-span-2">
                      <span className="block text-[10px] font-bold uppercase text-emerald-600/70 mb-1">Gaji</span>
                      <span className="text-sm font-bold text-emerald-700">
                        {selectedJob.salaryMax && selectedJob.salaryMax !== selectedJob.salaryMin
                          ? `Rp ${selectedJob.salaryMin.toLocaleString('id-ID')} - Rp ${selectedJob.salaryMax.toLocaleString('id-ID')}`
                          : `Rp ${selectedJob.salaryMin.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Deskripsi</h3>
                  {selectedJob.description ? (
                    <div
                      className="text-slate-600 text-sm leading-relaxed prose prose-sm prose-slate max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                    />
                  ) : (
                    <div className="text-slate-500 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                      Deskripsi tidak tersedia.
                    </div>
                  )}
                </div>
            </div>
            <div className="p-4 bg-white border-t border-slate-100">
              <Link href={`/job/${selectedJob.id}`} className="block w-full">
                <button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                  Lamar Pekerjaan
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
