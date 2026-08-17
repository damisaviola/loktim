"use client";

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { LandingNavbar } from './LandingNavbar';

export function SiteHeader() {
  const pathname = usePathname();

  // Hide navbar on admin, auth, and dashboard pages
  if (
    pathname?.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/perusahaan/login' ||
    pathname === '/dashboard'
  )
    return null;

  if (pathname === '/') {
    return <LandingNavbar />;
  }

  return <Navbar />;
}
