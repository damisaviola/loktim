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
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Flag
} from "lucide-react";
import JobFormModal from "@/components/admin/JobFormModal";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ "Lowongan": true });
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const toggleSubmenu = (name: string) => {
    if (isCollapsed) setIsCollapsed(false); // Auto-expand sidebar if trying to open a submenu
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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isCollapsed ? "lg:w-20" : "lg:w-72"
        } ${
          isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"
        }`}
      >
        
        {/* Brand Area */}
        <div className={`flex h-16 shrink-0 items-center overflow-hidden border-b border-transparent justify-between ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
          <Link href="/admin" className="flex items-center gap-2 font-bold tracking-tight text-primary" onClick={() => setIsMobileOpen(false)}>
            <Briefcase className="h-6 w-6 shrink-0" />
            {!isCollapsed && <span className="text-xl whitespace-nowrap animate-in fade-in duration-300">LokerTimika</span>}
          </Link>
          {!isCollapsed && (
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 overflow-x-hidden">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              
              // Handle Items with Submenus
              if (item.subItems) {
                const isOpen = openMenus[item.name];
                const isActive = item.subItems.some(sub => pathname === sub.href) || pathname === item.href;
                
                return (
                  <div key={item.name} className="flex flex-col">
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      title={isCollapsed ? item.name : undefined}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        isActive && !isOpen
                          ? "bg-primary/5 text-primary" 
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <div className={`flex items-center ${isCollapsed ? "justify-center w-full" : "gap-3"}`}>
                        <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-primary" : "text-gray-400"}`} />
                        {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronRight className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
                      )}
                    </button>
                    
                    {/* Submenu Items */}
                    {!isCollapsed && isOpen && (
                      <div className="ml-9 mt-1 flex flex-col gap-1 border-l border-gray-100 pl-2 animate-in slide-in-from-top-2 duration-200">
                        {item.subItems.map(sub => {
                          const isSubActive = pathname === sub.href;
                          const isCreateJobBtn = sub.name === "Tambah Lowongan";
                          
                          if (isCreateJobBtn) {
                            return (
                              <button
                                key={sub.name}
                                onClick={() => {
                                  setIsCreateJobOpen(true);
                                  setIsMobileOpen(false);
                                }}
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-50 text-left"
                              >
                                {sub.name}
                              </button>
                            );
                          }

                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={() => setIsMobileOpen(false)}
                              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                isSubActive 
                                  ? "text-primary bg-primary/5" 
                                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
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

              // Handle Standard Items
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isCollapsed ? "justify-center" : "gap-3"
                  } ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-primary" : "text-gray-400"}`} />
                  {!isCollapsed && <span className="whitespace-nowrap animate-in fade-in duration-300">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

      </aside>
      
      {/* Main Container */}
      <div 
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:pl-20" : "lg:pl-72"
        }`}
      >
        
        {/* Topbar - Solid White to prevent scroll overlap issues */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8 transition-all duration-300">
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 -ml-2 mr-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumbs */}
          <div className="hidden lg:flex items-center text-sm font-medium text-gray-500 gap-2">
            <Link href="/admin" className="hover:text-gray-900 transition-colors">Admin</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900">Dashboard</span>
          </div>

          <div className="flex-1" />

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            
            {/* Simple Search Icon for Topbar */}
            <button className="text-gray-400 hover:text-gray-500 transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* Logout Button */}
            <div className="relative ml-2">
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-2 px-3 h-9 rounded-md bg-red-50 text-red-600 font-semibold text-sm shadow-sm hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </div>

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>

      </div>

      {/* Mobile Sidebar Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 lg:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* GLOBAL MODALS */}
      <JobFormModal open={isCreateJobOpen} onOpenChange={setIsCreateJobOpen} />

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
          <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-foreground">Konfirmasi Keluar</h2>
            <p className="text-muted-foreground text-sm mb-8">
              Apakah Anda yakin ingin keluar dari sesi admin? Anda harus login kembali untuk masuk.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 h-11 rounded-lg border border-border font-bold text-foreground hover:bg-secondary transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => import('@/app/actions/auth').then(m => m.logoutAction())}
                className="flex-1 h-11 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
