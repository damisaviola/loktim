"use client";

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

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

  return <Navbar />;
}
