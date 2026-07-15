"use client";

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { LandingNavbar } from './LandingNavbar';

export function SiteHeader() {
  const pathname = usePathname();

  // Hide navbar on admin and login pages
  if (pathname?.startsWith('/admin') || pathname === '/login') return null;

  if (pathname === '/') {
    return <LandingNavbar />;
  }

  return <Navbar />;
}
