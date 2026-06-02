"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings,
  Search,
  ChevronRight,
  Menu
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Lowongan", href: "/admin/jobs", icon: Briefcase },
    { name: "Kandidat", href: "/admin/candidates", icon: Users },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-gray-200 bg-white lg:flex transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        
        {/* Brand Area */}
        <div className={`flex h-16 shrink-0 items-center overflow-hidden border-b border-transparent ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
          <Link href="/admin" className="flex items-center gap-2 font-bold tracking-tight text-primary">
            <Briefcase className="h-6 w-6 shrink-0" />
            {!isCollapsed && <span className="text-xl whitespace-nowrap animate-in fade-in duration-300">LokerTimika</span>}
          </Link>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 overflow-x-hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
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
          <button className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700">
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

            {/* Avatar Dropdown Placeholder */}
            <div className="relative ml-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity">
                A
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
    </div>
  );
}
