"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Briefcase, Menu, X, Bookmark, Search, FileText, Phone, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide navbar on admin and login pages
  if (pathname?.startsWith('/admin') || pathname === '/login') return null;

  const navLinks = [
    { href: "/jobs", label: "Cari Lowongan", icon: <Search className="w-5 h-5" />, active: pathname === "/jobs" || pathname?.startsWith("/job/") },
    { href: "/panduan-pasang-loker", label: "Panduan", icon: <BookOpen className="w-5 h-5" />, active: pathname === "/panduan-pasang-loker" },
    { href: "/tersimpan", label: "Tersimpan", icon: <Bookmark className="w-5 h-5" />, active: pathname === "/tersimpan" },
    { href: "/ketentuan-pasang-loker", label: "Ketentuan", icon: <FileText className="w-5 h-5" />, active: pathname === "/ketentuan-pasang-loker" },
    { href: "/contact", label: "Kontak", icon: <Phone className="w-5 h-5" />, active: pathname === "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-lg border-b border-slate-200/80 shadow-xs transition-all duration-300 animate-navbar-slide-down">
      <div className="container mx-auto flex h-16 max-w-[1128px] items-center justify-between px-4 sm:px-6 lg:px-0">

        {/* Brand / Logo & Desktop Nav Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/jobs" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden bg-transparent">
              <Image 
                src="/logo.png" 
                alt="Logo Loker Timika" 
                width={120} 
                height={120} 
                className="w-full h-full object-cover scale-[1.35]"
              />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-800 transition-colors duration-300 hidden min-[360px]:inline-block">
              Loker<span className="text-[#026CA0] group-hover:text-[#015883] transition-colors">Timika</span>
            </span>
          </Link>

          {/* Desktop Navigation Links - Text Only (No Icons) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${link.active
                  ? "text-primary bg-primary/10 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop Only Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/post">
              <Button
                variant="default"
                size="sm"
                className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-xs hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 px-4 lg:px-5 h-10 cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>Pasang Loker</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Actions: Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all border border-slate-200 bg-white hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu - With Icons */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl py-4 px-4 flex flex-col gap-2 md:hidden animate-mobile-menu z-50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all ${link.active
                ? "text-primary bg-primary/10 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          <hr className="border-slate-100 my-1" />

          <div className="flex flex-col gap-2 pt-1">
            <Link href="/post" onClick={() => setIsMenuOpen(false)} className="w-full">
              <Button className="w-full rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-xs flex items-center justify-center gap-2 py-2.5 h-11">
                <Briefcase className="w-4 h-4" />
                <span>Pasang Loker</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
