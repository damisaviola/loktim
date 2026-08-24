'use client';

import { useState, useMemo } from 'react';
import { JobCard } from '@/components/JobCard';
import { JobCardSkeleton } from '@/components/JobCardSkeleton';
import { Button } from '@/components/ui/Button';
import { JobType, EducationLevel, ExperienceLevel, Job } from '@/types';
import { 
  X, 
  Search, 
  SearchX, 
  ChevronDown,
  RotateCcw, 
  MapPin, 
  SlidersHorizontal,
  Briefcase,
  Sparkles,
  ArrowRight,
  Filter,
  GraduationCap,
  Award,
  Pickaxe,
  Wrench,
  Truck,
  Laptop,
  Utensils,
  Stethoscope,
  Settings,
  ShoppingBag
} from 'lucide-react';

export function JobsClient({ initialJobs }: { initialJobs: Job[] }) {
  const [activeType, setActiveType] = useState<JobType | 'Semua'>('Semua');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [activeEdu, setActiveEdu] = useState<EducationLevel | 'Semua'>('Semua');
  const [activeExp, setActiveExp] = useState<ExperienceLevel | 'Semua'>('Semua');
  const [activeLocation, setActiveLocation] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'newest' | 'salary'>('newest');
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { label: 'Semua', icon: Sparkles },
    { label: 'Pertambangan', icon: Pickaxe },
    { label: 'Teknik & Engineering', icon: Wrench },
    { label: 'Logistik & Driver', icon: Truck },
    { label: 'Admin & HR', icon: Briefcase },
    { label: 'IT & Digital', icon: Laptop },
    { label: 'F&B & Resto', icon: Utensils },
    { label: 'Kesehatan & K3', icon: Stethoscope },
    { label: 'Operasional', icon: Settings },
    { label: 'Penjualan & Retail', icon: ShoppingBag },
  ];

  const locations = [
    'Semua',
    'Timika',
    'Kuala Kencana',
    'Tembagapura',
    'Portsite',
    'Mimika Timur',
    'Mimika Baru'
  ];

  const jobTypes = ['Semua', 'Full-time', 'Part-time', 'Kontrak', 'Magang', 'Freelance'];
  const eduLevels = ['Semua', 'SMA/SMK', 'D3', 'S1', 'S2'];
  const expLevels = ['Semua', 'Tanpa Pengalaman', '1-3 Tahun', '3-5 Tahun', '> 5 Tahun'];

  const handleSearchChange = (val: string) => {
    setInputValue(val);
    if (!val) setSearchQuery('');
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchQuery(inputValue);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 150);
  };

  const resetAllFilters = () => {
    setInputValue('');
    setSearchQuery('');
    setActiveCategory('Semua');
    setActiveType('Semua');
    setActiveEdu('Semua');
    setActiveExp('Semua');
    setActiveLocation('Semua');
    setSortBy('newest');
    setVisibleCount(8);
  };

  const hasActiveFilters = 
    activeCategory !== 'Semua' || 
    activeType !== 'Semua' || 
    activeEdu !== 'Semua' || 
    activeExp !== 'Semua' || 
    activeLocation !== 'Semua' || 
    searchQuery !== '';

  const filteredJobs = useMemo(() => {
    return initialJobs
      .filter(job => {
        const matchType = activeType === 'Semua' || job.type === activeType;
        const matchCategory = activeCategory === 'Semua' ||
          job.category === activeCategory ||
          (activeCategory.includes('Pertambangan') && (job.category?.includes('Pertambangan') || job.category?.includes('Tambang') || job.category?.includes('Mining'))) ||
          (activeCategory.includes('IT') && (job.category?.includes('IT') || job.category?.includes('Software') || job.category?.includes('Digital'))) ||
          (activeCategory.includes('Admin') && (job.category?.includes('Admin') || job.category?.includes('HR')));
        const matchEdu = activeEdu === 'Semua' || job.education === activeEdu || job.education === 'Semua' || !job.education;
        const matchExp = activeExp === 'Semua' || job.experience === activeExp || job.experience === 'Semua' || !job.experience;
        const matchLocation = activeLocation === 'Semua' ||
          (job.location && job.location.toLowerCase().includes(activeLocation.toLowerCase())) ||
          (job.company?.location && job.company.location.toLowerCase().includes(activeLocation.toLowerCase()));
        
        const matchQuery = !searchQuery ||
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (job.company?.name && job.company.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return matchType && matchCategory && matchEdu && matchExp && matchLocation && matchQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'salary') {
          const salA = a.salaryMax || a.salaryMin || 0;
          const salB = b.salaryMax || b.salaryMin || 0;
          return salB - salA;
        }
        const dateA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
        const dateB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [initialJobs, activeType, activeCategory, activeEdu, activeExp, activeLocation, searchQuery, sortBy]);

  const displayedJobs = filteredJobs.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* 1. TOP MINIMALIST SEARCH BAR & EXTERNAL ACTION BUTTONS */}
      <div className="space-y-2.5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          
          {/* Keyword Search Field Card (Prominent & Large) */}
          <div className="flex-1 w-full bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-xs focus-within:border-primary dark:focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 flex items-center px-4 sm:px-5 h-14 sm:h-16 transition-all">
            <Search className="w-6 h-6 text-primary mr-3.5 shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari lowongan, keahlian, atau nama perusahaan..."
              className="w-full bg-transparent text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none py-3"
            />
            {inputValue && (
              <button 
                type="button" 
                onClick={() => { setInputValue(''); setSearchQuery(''); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* External Action Buttons (Compact & Sleek) */}
          <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="h-11 px-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors lg:hidden shrink-0 cursor-pointer shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span>Filter</span>
            </button>

            <button
              type="submit"
              className="flex-1 sm:flex-none h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Cari Loker</span>
            </button>
          </div>

        </form>
      </div>

      {/* 2. HORIZONTAL CATEGORY CHIPS */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-center gap-2 min-w-max">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white dark:text-slate-900' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: SIDEBAR + JOBS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ===================== LEFT SIDEBAR: FILTERS (Col 3) ===================== */}
        <aside className="hidden lg:block lg:col-span-3 space-y-5 sticky top-24">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-5 space-y-5">
            
            {/* Filter Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Filter Lowongan</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Urutan */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2 font-mono">Urutkan</label>
              <div className="flex flex-col gap-1">
                {[
                  { id: 'newest', label: 'Terbaru Ditambahkan' },
                  { id: 'salary', label: 'Gaji Tertinggi' },
                ].map(sort => (
                  <button
                    key={sort.id}
                    onClick={() => setSortBy(sort.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      sortBy === sort.id
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipe Pekerjaan */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2 font-mono">Tipe Pekerjaan</label>
              <div className="flex flex-wrap gap-1.5">
                {jobTypes.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t as any)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeType === t
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Pendidikan Minimal */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2 font-mono">Pendidikan Minimal</label>
              <div className="flex flex-wrap gap-1.5">
                {eduLevels.map(edu => (
                  <button
                    key={edu}
                    onClick={() => setActiveEdu(edu as any)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeEdu === edu
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {edu}
                  </button>
                ))}
              </div>
            </div>

            {/* Pengalaman Kerja */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2 font-mono">Pengalaman</label>
              <div className="flex flex-col gap-1">
                {expLevels.map(exp => (
                  <button
                    key={exp}
                    onClick={() => setActiveExp(exp as any)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeExp === exp
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* ===================== RIGHT: JOBS GRID (Col 9) ===================== */}
        <main className="lg:col-span-9 space-y-4">
          
          {/* Feed Header Count */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span>Menampilkan <strong className="text-slate-900 dark:text-slate-100 font-bold">{filteredJobs.length}</strong> lowongan kerja aktif</span>
            {searchQuery && (
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px]">
                Kata kunci: &quot;{searchQuery}&quot;
              </span>
            )}
          </div>

          {/* Cards Grid: 2 Columns on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))
            ) : displayedJobs.length > 0 ? (
              displayedJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="col-span-full py-16 px-6 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <SearchX className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Lowongan Tidak Ditemukan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-4">
                  Coba ubah kata kunci atau hapus filter untuk melihat lowongan kerja lainnya.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetAllFilters}
                  className="rounded-xl text-xs font-bold"
                >
                  Reset Semua Filter
                </Button>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {!isLoading && visibleCount < filteredJobs.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="px-8 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                Muat Lowongan Lainnya ({filteredJobs.length - visibleCount} tersisa)
              </button>
            </div>
          )}
        </main>

      </div>

      {/* 4. MOBILE FILTER MODAL */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl p-6 flex flex-col animate-in slide-in-from-bottom duration-200 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Filter Lowongan</h3>
              </div>
              <button onClick={() => setIsFilterModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 py-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Tipe Pekerjaan</label>
                <div className="grid grid-cols-2 gap-2">
                  {jobTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveType(t as any)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                        activeType === t
                          ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Pendidikan Minimal</label>
                <div className="flex flex-wrap gap-1.5">
                  {eduLevels.map(edu => (
                    <button
                      key={edu}
                      onClick={() => setActiveEdu(edu as any)}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        activeEdu === edu
                          ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {edu}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Pengalaman Kerja</label>
                <div className="grid grid-cols-2 gap-2">
                  {expLevels.map(exp => (
                    <button
                      key={exp}
                      onClick={() => setActiveExp(exp as any)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                        activeExp === exp
                          ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex gap-2.5">
              <button 
                onClick={resetAllFilters}
                className="w-1/3 h-11 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Reset
              </button>
              <button 
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 h-11 bg-primary hover:bg-primary/90 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                Terapkan Filter ({filteredJobs.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
