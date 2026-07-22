"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Briefcase, Menu, X, Search, Home, LogIn, Bookmark, FileText, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function LandingNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide navbar on admin and login pages
  if (pathname?.startsWith('/admin') || pathname === '/login') return null;

  const navLinks = [
    { href: "/", label: "Beranda", icon: <Home className="w-5 h-5" />, active: pathname === "/" },
    { href: "/jobs", label: "Lowongan", icon: <Search className="w-5 h-5" />, active: pathname === "/jobs" || pathname?.startsWith("/job/") },
    { href: "/tersimpan", label: "Tersimpan", icon: <Bookmark className="w-5 h-5" />, active: pathname === "/tersimpan" },
    { href: "/ketentuan-pasang-loker", label: "Ketentuan", icon: <FileText className="w-5 h-5" />, active: pathname === "/ketentuan-pasang-loker" },
    { href: "/contact", label: "Kontak", icon: <Phone className="w-5 h-5" />, active: pathname === "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6 sm:px-8 lg:px-12">

        {/* Brand / Logo & Desktop Nav Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden bg-transparent">
              <Image 
                src="/logo.png" 
                alt="Logo Loker Timika" 
                width={120} 
                height={120} 
                className="w-full h-full object-cover scale-[1.35]"
              />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900 transition-colors duration-300 hidden min-[360px]:inline-block">
              Loker<span className="text-[#026CA0] group-hover:text-[#015883] transition-colors">Timika</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                title={link.label}
                className={`px-4 py-2 rounded-full transition-all duration-250 flex items-center justify-center font-medium text-sm ${link.active
                  ? "text-slate-900 bg-slate-100"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Desktop Only Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-2">
              Masuk
            </Link>

            <Link href="/post">
              <Button
                variant="default"
                size="sm"
                className="rounded-xl font-bold bg-slate-950 hover:bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 px-6 h-11"
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
              className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all border border-slate-200 bg-white hover:scale-105 active:scale-95"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-xl py-4 px-6 flex flex-col gap-3 md:hidden animate-mobile-menu z-50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-base font-semibold flex items-center gap-3 transition-all ${link.active
                ? "text-slate-900 bg-slate-50"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="px-4 py-3 rounded-xl text-base font-semibold flex items-center gap-3 transition-all text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          >
            <LogIn className="w-5 h-5" />
            <span>Masuk</span>
          </Link>

          <hr className="border-slate-100 my-2" />

          <div className="flex flex-col gap-2">
            <Link href="/post" onClick={() => setIsMenuOpen(false)} className="w-full">
              <Button className="w-full rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 py-3 h-12 bg-slate-950 text-white hover:bg-slate-900">
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
