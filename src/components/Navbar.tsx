"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Briefcase, Menu, X, Bookmark, Search, FileText, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide navbar on admin and login pages
  if (pathname?.startsWith('/admin') || pathname === '/login') return null;

  const navLinks = [
    { href: "/jobs", label: "Cari Lowongan", icon: <Search className="w-5 h-5" />, active: pathname === "/jobs" || pathname?.startsWith("/job/") },
    { href: "/tersimpan", label: "Tersimpan", icon: <Bookmark className="w-5 h-5" />, active: pathname === "/tersimpan" },
    { href: "/ketentuan-pasang-loker", label: "Ketentuan Layanan", icon: <FileText className="w-5 h-5" />, active: pathname === "/ketentuan-pasang-loker" },
    { href: "/contact", label: "Bantuan & Kontak", icon: <Phone className="w-5 h-5" />, active: pathname === "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg shadow-black/5 transition-all duration-300">
      <div className="container mx-auto flex h-16 max-w-[1128px] items-center justify-between px-4 sm:px-6 lg:px-0">

        {/* Brand / Logo & Desktop Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
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

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                title={link.label}
                className={`p-2.5 rounded-full transition-all duration-250 flex items-center justify-center ${link.active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                {link.icon}
                {link.label === "Tersimpan" && (
                  <span className="ml-2 text-sm font-semibold hidden lg:inline-block">{link.label}</span>
                )}
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
                className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 px-5 h-10"
              >
                <Briefcase className="w-4 h-4" />
                <span>Pasang Loker</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Actions: Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-border/50 bg-card/50 hover:scale-105 active:scale-95"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg py-4 px-4 flex flex-col gap-3 sm:hidden animate-mobile-menu z-50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all ${link.active
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          <hr className="border-border/50 my-1" />

          <div className="flex flex-col gap-2">

            <Link href="/post" onClick={() => setIsMenuOpen(false)} className="w-full">
              <Button className="w-full rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 py-2.5 h-10">
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
