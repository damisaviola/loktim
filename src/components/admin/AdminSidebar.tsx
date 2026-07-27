"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  Building,
  Tags,
  MapPin,
  Settings,
  Search,
  ChevronDown,
  Menu,
  X,
  Flag,
  Plus,
  LogOut,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import JobFormModal from "@/components/admin/JobFormModal";
import { logoutAction } from "@/app/actions/auth";

export default function AdminSidebar({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ "Lowongan": true });
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Do not show admin sidebar/layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const toggleSubmenu = (name: string) => {
    if (isCollapsed) setIsCollapsed(false);
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { 
      name: "Lowongan", 
      icon: Briefcase,
      subItems: [
        { name: "Semua Lowongan", href: "/admin/jobs" },
        { name: "Tambah Lowongan", href: "/admin/jobs/create" },
        { name: "Pending Review", href: "/admin/jobs/pending" },
        { name: "Lowongan Aktif", href: "/admin/jobs/active" },
        { name: "Lowongan Kadaluarsa", href: "/admin/jobs/expired" },
      ]
    },
    { name: "Perusahaan", href: "/admin/companies", icon: Building },
    { name: "Kategori", href: "/admin/categories", icon: Tags },
    { name: "Lokasi", href: "/admin/locations", icon: MapPin },
    { name: "Laporan", href: "/admin/reports", icon: Flag },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans flex flex-col selection:bg-primary/20 selection:text-primary">
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/80 bg-white transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isCollapsed ? "lg:w-20" : "lg:w-72"
        } ${
          isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"
        }`}
      >
        
        {/* Brand Area */}
        <div className={`flex h-16 shrink-0 items-center overflow-hidden border-b border-slate-100 justify-between ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
          <Link href="/admin" className="flex items-center gap-3 font-bold tracking-tight text-primary group" onClick={() => setIsMobileOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <Briefcase className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">LokerTimika</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80 pt-0.5">Admin Portal</span>
              </div>
            )}
          </Link>
          {!isCollapsed && (
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 overflow-x-hidden space-y-6">
          
          <div>
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Menu Utama
              </p>
            )}
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                
                if (item.subItems) {
                  const isOpen = openMenus[item.name];
                  const isActive = item.subItems.some(sub => pathname === sub.href) || pathname === item.href;
                  
                  return (
                    <div key={item.name} className="flex flex-col">
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        title={isCollapsed ? item.name : undefined}
                        className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                          isActive && !isOpen
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-primary" : "text-slate-400"}`} />
                          {!isCollapsed && <span>{item.name}</span>}
                        </div>
                        {!isCollapsed && (
                          <ChevronDown 
                            className={`h-4 w-4 transition-transform duration-200 text-slate-400 ${isOpen ? "rotate-180" : ""}`} 
                          />
                        )}
                      </button>

                      {/* Submenu Dropdown */}
                      {isOpen && !isCollapsed && (
                        <div className="ml-9 mt-1 flex flex-col gap-1 border-l-2 border-slate-100 pl-3">
                          {item.subItems.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                                  isSubActive
                                    ? "bg-primary text-white shadow-xs"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    title={isCollapsed ? item.name : undefined}
                    className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                      isActive 
                        ? "bg-primary text-white shadow-xs" 
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

        </div>

        {/* Sidebar Footer User Info */}
        <div className="border-t border-slate-100 p-3.5">
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200/60 bg-rose-50/50 hover:bg-rose-50 py-2.5 text-xs font-bold text-rose-600 transition-colors shadow-2xs cursor-pointer group"
          >
            <LogOut className="w-4 h-4 text-rose-500 group-hover:-translate-x-0.5 transition-transform" />
            {!isCollapsed && <span>Keluar Sistem</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Overlay for Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Top Navbar Header */}
      <header className={`sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-6 transition-all duration-300 ${
        isCollapsed ? "lg:ml-20" : "lg:ml-72"
      }`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
          >
            <Menu className="h-4.5 w-4.5" />
          </button>

          {/* Search Bar */}
          <div className="relative hidden sm:block w-64 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari lowongan, perusahaan, kategori..." 
              className="w-full rounded-2xl bg-slate-100/70 border border-slate-200/80 pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Action Buttons & Profile */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCreateJobOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-primary hover:bg-primary/90 px-4 py-2 text-xs font-bold text-white transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Lowongan</span>
          </button>

          <div className="h-6 w-px bg-slate-200" />

          {/* User Profile Badge */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 rounded-2xl p-1 pr-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary to-blue-500 text-white flex items-center justify-center font-extrabold text-xs shadow-2xs shrink-0">
              AD
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">Admin Utama</div>
              <div className="text-[10px] text-slate-400 font-semibold">admin@lokertimika.com</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 ${
        isCollapsed ? "lg:ml-20" : "lg:ml-72"
      }`}>
        {children}
      </main>

      {/* Job Form Modal */}
      <JobFormModal 
        open={isCreateJobOpen} 
        onOpenChange={setIsCreateJobOpen} 
      />

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200 border border-slate-200/80">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-rose-100">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Konfirmasi Keluar</h3>
            <p className="text-xs font-medium text-slate-500 mb-6">Apakah Anda yakin ingin keluar dari dashboard admin?</p>
            <div className="flex gap-2.5 justify-center">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors flex-1"
              >
                Batal
              </button>
              <form action={logoutAction} className="flex-1">
                <button 
                  type="submit"
                  className="w-full px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-2xl transition-colors shadow-2xs cursor-pointer"
                >
                  Ya, Keluar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
