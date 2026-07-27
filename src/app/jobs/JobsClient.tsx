'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { JobCard } from '@/components/JobCard';
import { JobCardSkeleton } from '@/components/JobCardSkeleton';
import { Button } from '@/components/ui/Button';
import { JobType, EducationLevel, ExperienceLevel, Job } from '@/types';
import { Settings2, X, Search, SearchX, Building2, ChevronLeft, ChevronRight, Filter, RotateCcw, Briefcase, MapPin, GraduationCap, Award, Banknote, Sparkles, ExternalLink } from 'lucide-react';
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
  const [visibleCount, setVisibleCount] = useState(6);

  const carouselRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
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
    setVisibleCount(6);
  }, [searchQuery, activeType, activeCategory, activeEdu, activeExp, activeDate]);

  const hasActiveFilters = activeCategory !== 'Semua' || activeType !== 'Semua' || activeEdu !== 'Semua' || activeExp !== 'Semua' || activeDate !== 'Semua' || searchQuery !== '';

  const resetAllFilters = () => {
    setInputValue('');
    setSearchQuery('');
    setActiveCategory('Semua');
    setActiveType('Semua');
    setActiveEdu('Semua');
    setActiveExp('Semua');
    setActiveDate('Semua');
  };

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

  // Infinite Scroll Trigger via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 6, filteredJobs.length));
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [filteredJobs.length]);

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
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6">

      {/* Modern Hero Search Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Left Hero Headline Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden min-h-[220px]">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Portal Lowongan Kerja Mimika</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight pt-1">
              Temukan Karir Impianmu
            </h1>
            <p className="text-slate-300 text-sm font-medium pt-0.5 max-w-sm">
              Eksplorasi ratusan peluang kerja terbaru di Timika & sekitarnya.
            </p>
          </div>

          <div className="relative z-10 pt-6 flex items-center gap-6 border-t border-white/10">
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-white tracking-tight">{initialJobs.length}+</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lowongan Aktif</span>
            </div>
            <div className="w-px h-8 bg-white/15"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-white tracking-tight">85+</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Perusahaan</span>
            </div>
          </div>

          {/* Abstract ambient glows */}
          <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-primary/30 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-400/10 blur-2xl rounded-full pointer-events-none"></div>
        </div>

        {/* Right Search & Quick Filters Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 shadow-xs rounded-3xl p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Pencarian Lowongan</h2>
              {hasActiveFilters && (
                <button 
                  onClick={resetAllFilters}
                  className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Filter
                </button>
              )}
            </div>

            {/* Input Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-2xl p-1 transition-all focus-within:border-primary/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                <TypewriterSearch
                  searchQuery={inputValue}
                  onSearchChange={handleSearchChange}
                  onSearchSubmit={handleSearchSubmit}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  className="h-12 w-12 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 flex items-center justify-center transition-colors lg:hidden shrink-0"
                  onClick={() => setIsFilterOpen(true)}
                  aria-label="Buka Filter"
                >
                  <Filter className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="flex-1 sm:flex-none h-12 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-sm flex items-center justify-center gap-2 transition-all font-bold text-sm shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Cari</span>
                </button>
              </div>
            </div>

            {/* Popular Search Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Populer:</span>
              {['Freeport', 'Admin', 'Operator', 'IT Support', 'Barista', 'Mekanik'].map(kw => (
                <button 
                  key={kw} 
                  onClick={() => {
                    handleSearchChange(kw);
                    setTimeout(() => handleSearchSubmit(), 100);
                  }} 
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200/70 rounded-full text-xs font-semibold text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium gap-2">
            <span>Filter Aktif: <strong className="text-slate-800 font-bold">{activeCategory}</strong> {activeType !== 'Semua' && `• ${activeType}`}</span>
            <span>Menampilkan <strong className="text-slate-900 font-bold">{filteredJobs.length}</strong> hasil</span>
          </div>

        </div>
      </div>

      {/* Rekomendasi Section (Horizontal Scroll Carousel) */}
      {!searchQuery && activeCategory === 'Semua' && activeType === 'Semua' && (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">Rekomendasi Lowongan</h2>
              <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">Terbaru</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 transition-colors text-slate-600 shadow-2xs"
                aria-label="Previous recommendation"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 transition-colors text-slate-600 shadow-2xs"
                aria-label="Next recommendation"
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
              <div key={`latest-${job.id}`} className="w-[85vw] sm:w-[350px] shrink-0 flex">
                <JobCard
                  job={job}
                  onClick={setSelectedJob}
                  className="w-full flex-col !flex-col mb-0 h-full border-slate-200/90"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-6 pt-2">

        {/* Desktop Left Sidebar Filter */}
        <div className="hidden lg:flex flex-col w-[260px] shrink-0 gap-5">
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-5 sticky top-24 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Filter Lowongan</h3>
              {hasActiveFilters && (
                <button 
                  onClick={resetAllFilters}
                  className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Kategori */}
            <div>
              <label className="block font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Kategori</label>
              <div className="flex flex-col gap-1 max-h-[240px] overflow-y-auto pr-1">
                {jobCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeCategory === cat
                        ? 'bg-primary text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipe Pekerjaan */}
            <div className="border-t border-slate-100 pt-4">
              <label className="block font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Tipe Pekerjaan</label>
              <div className="flex flex-col gap-2">
                {jobTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer hover:text-slate-900">
                    <input
                      type="radio"
                      name="jobTypeDesktop"
                      checked={activeType === type}
                      onChange={() => setActiveType(type as any)}
                      className="w-3.5 h-3.5 text-primary accent-primary rounded"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pendidikan */}
            <div className="border-t border-slate-100 pt-4">
              <label className="block font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Pendidikan Minimal</label>
              <div className="flex flex-wrap gap-1.5">
                {eduLevels.map((edu) => (
                  <button
                    key={edu}
                    onClick={() => setActiveEdu(edu as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeEdu === edu
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100'
                    }`}
                  >
                    {edu}
                  </button>
                ))}
              </div>
            </div>

            {/* Pengalaman */}
            <div className="border-t border-slate-100 pt-4">
              <label className="block font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Pengalaman</label>
              <div className="flex flex-col gap-1.5">
                {expLevels.map((exp) => (
                  <button
                    key={exp}
                    onClick={() => setActiveExp(exp as any)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeExp === exp
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Horizontal Category Pills */}
        <div className="w-full overflow-x-auto pb-2 pt-1 px-1 -mx-1 lg:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-2 min-w-max">
            {jobCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Feed Container */}
        <div className="flex-1 transition-all duration-300 min-w-0 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">
              {searchQuery || activeCategory !== 'Semua' || activeType !== 'Semua' ? 'Hasil Filter Lowongan' : 'Semua Lowongan Kerja'}
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full shrink-0">
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
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onClick={setSelectedJob} 
                  className={selectedJob?.id === job.id ? 'ring-2 ring-primary border-primary/40' : ''}
                />
              ))
            ) : (
              <div className="py-16 px-6 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-200/80 border-dashed">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                  <SearchX className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Lowongan Tidak Ditemukan</h3>
                <p className="text-sm text-slate-500 max-w-sm mb-6">
                  Tidak ada lowongan yang sesuai dengan kriteria filter atau kata kunci Anda.
                </p>
                <Button
                  variant="outline"
                  className="font-bold text-xs rounded-xl"
                  onClick={resetAllFilters}
                >
                  Reset Semua Filter
                </Button>
              </div>
            )}
          </div>

          {!isLoading && visibleCount < filteredJobs.length && (
            <div ref={loadMoreRef} className="mt-8 text-center pt-2">
              <button
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl border border-slate-200/80 text-slate-700 hover:bg-slate-50 font-bold transition-all text-xs shadow-2xs bg-white cursor-pointer"
              >
                Muat Lowongan Lainnya ({filteredJobs.length - visibleCount})
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar - Job Details (Desktop Split-View / Side Panel) */}
        {selectedJob && (
          <div className="hidden lg:flex flex-col w-[380px] shrink-0 transition-all duration-300">
            <div className="sticky top-24 bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden flex flex-col h-[calc(100vh-7rem)] animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white/90 backdrop-blur z-10">
                <span className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Detail Pekerjaan</span>
                <button 
                  onClick={() => setSelectedJob(null)} 
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-6 space-y-6">
                
                {/* Title Section */}
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center rounded-2xl shrink-0 shadow-2xs">
                    {selectedJob.company?.logoUrl ? (
                      <Image src={selectedJob.company.logoUrl as string} alt={selectedJob.company.name} fill sizes="56px" className="object-contain p-2" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg font-bold text-slate-900 leading-snug mb-1">{selectedJob.title}</h1>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{selectedJob.company?.name}</span>
                    </div>
                  </div>
                </div>

                {/* Micro Bento Info Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Lokasi</span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{selectedJob.location || selectedJob.company?.location || '-'}</span>
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Tipe</span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedJob.type}</span>
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Pengalaman</span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedJob.experience || 'Semua'}</span>
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Pendidikan</span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedJob.education || 'Semua'}</span>
                    </span>
                  </div>
                  {selectedJob.salaryMin && (
                    <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-100 col-span-2">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Kisaran Gaji</span>
                      <span className="text-sm font-extrabold text-emerald-700 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        {selectedJob.salaryMax && selectedJob.salaryMax !== selectedJob.salaryMin
                          ? `Rp ${selectedJob.salaryMin.toLocaleString('id-ID')} - Rp ${selectedJob.salaryMax.toLocaleString('id-ID')}`
                          : `Rp ${selectedJob.salaryMin.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Deskripsi Pekerjaan</h3>
                  {selectedJob.description ? (
                    <div
                      className="text-slate-600 text-xs leading-relaxed prose prose-xs prose-slate max-w-none prose-p:mb-2 prose-ul:mb-2 prose-li:my-0.5"
                      dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                    />
                  ) : (
                    <div className="text-slate-400 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      Deskripsi lengkap belum disediakan oleh pengunggah loker.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 bg-white border-t border-slate-100 z-10">
                <Link href={`/job/${selectedJob.id}`} className="block w-full">
                  <button className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer text-xs">
                    <span>Lamar Pekerjaan Sekarang</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filter Sheet Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full sm:max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl p-6 flex flex-col relative animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h2 className="font-extrabold text-base text-slate-900">Filter Lowongan</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-1 rounded-xl hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 space-y-5 pb-16 pr-1">
              <div>
                <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wide mb-2.5">Tipe Pekerjaan</h3>
                <div className="grid grid-cols-2 gap-2">
                  {jobTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveType(type as any)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                        activeType === type
                          ? 'bg-primary border-primary text-white shadow-2xs'
                          : 'bg-slate-50 border-slate-200/70 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wide mb-2.5">Pendidikan Minimal</h3>
                <div className="flex flex-wrap gap-2">
                  {eduLevels.map((edu) => (
                    <button
                      key={edu}
                      onClick={() => setActiveEdu(edu as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                        activeEdu === edu
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-slate-50 border-slate-200/70 text-slate-700'
                      }`}
                    >
                      {edu}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wide mb-2.5">Pengalaman</h3>
                <div className="grid grid-cols-2 gap-2">
                  {expLevels.map((exp) => (
                    <button
                      key={exp}
                      onClick={() => setActiveExp(exp as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        activeExp === exp
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-slate-50 border-slate-200/70 text-slate-700'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 rounded-b-3xl flex gap-2">
              <button 
                className="w-1/3 font-bold h-11 rounded-2xl border border-slate-200 text-slate-600 text-xs"
                onClick={resetAllFilters}
              >
                Reset
              </button>
              <button 
                className="flex-1 font-bold h-11 rounded-2xl bg-primary text-white text-xs shadow-2xs" 
                onClick={() => setIsFilterOpen(false)}
              >
                Terapkan ({filteredJobs.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Side Drawer (Mobile Only) */}
      {selectedJob && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-300" onClick={() => setSelectedJob(null)} />
          <div className="fixed inset-y-0 right-0 z-[120] w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Detail Pekerjaan</span>
              <button onClick={() => setSelectedJob(null)} className="p-1 rounded-xl hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-5">
              <div className="flex items-start gap-4">
                <div className="relative w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center rounded-2xl shrink-0 shadow-2xs">
                  {selectedJob.company?.logoUrl ? (
                    <Image src={selectedJob.company.logoUrl as string} alt={selectedJob.company.name} fill sizes="56px" className="object-contain p-2" />
                  ) : (
                    <Building2 className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-slate-900 leading-tight mb-1">{selectedJob.title}</h1>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{selectedJob.company?.name}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Lokasi</span>
                  <span className="text-xs font-bold text-slate-700">{selectedJob.location || selectedJob.company?.location || '-'}</span>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Tipe</span>
                  <span className="text-xs font-bold text-slate-700">{selectedJob.type}</span>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Pengalaman</span>
                  <span className="text-xs font-bold text-slate-700">{selectedJob.experience || 'Semua'}</span>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Pendidikan</span>
                  <span className="text-xs font-bold text-slate-700">{selectedJob.education || 'Semua'}</span>
                </div>
                {selectedJob.salaryMin && (
                  <div className="bg-emerald-50/70 rounded-2xl p-3 border border-emerald-100 col-span-2">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-0.5">Gaji</span>
                    <span className="text-xs font-extrabold text-emerald-700">
                      {selectedJob.salaryMax && selectedJob.salaryMax !== selectedJob.salaryMin
                        ? `Rp ${selectedJob.salaryMin.toLocaleString('id-ID')} - Rp ${selectedJob.salaryMax.toLocaleString('id-ID')}`
                        : `Rp ${selectedJob.salaryMin.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 mb-2 text-xs uppercase tracking-wider">Deskripsi Pekerjaan</h3>
                {selectedJob.description ? (
                  <div
                    className="text-slate-600 text-xs leading-relaxed prose prose-xs prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                  />
                ) : (
                  <div className="text-slate-400 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    Deskripsi belum tersedia.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <Link href={`/job/${selectedJob.id}`} className="block w-full">
                <button className="w-full h-11 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs shadow-2xs">
                  <span>Lamar Pekerjaan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
