"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  // Hide footer on admin and login pages
  if (pathname?.startsWith('/admin') || pathname === '/login') return null;

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-16 text-slate-600">
      <div className="container mx-auto px-4 max-w-[1128px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          
          {/* Column 1: Brand & Desc */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden bg-transparent">
                <Image 
                  src="/logo.png" 
                  alt="Logo Loker Timika" 
                  width={120} 
                  height={40}
                  className="w-full h-full object-cover scale-[1.2]"
                />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                Loker<span className="text-[#026CA0] group-hover:text-[#015883] transition-colors">Timika</span>
              </span>
            </Link>
            <p className="text-sm font-medium leading-relaxed text-slate-500 max-w-xs">
              Platform karir nomor satu di Mimika. Mempertemukan talenta lokal terbaik dengan perusahaan terkemuka.
            </p>
          </div>

          {/* Column 2: Perusahaan */}
          <div className="md:col-span-2 md:col-start-6 flex flex-col gap-4">
            <h4 className="font-bold text-slate-900 text-base">Untuk Perusahaan</h4>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <Link href="/post" className="hover:text-primary transition-colors inline-block">Pasang Lowongan</Link>
              <Link href="/ketentuan-pasang-loker" className="hover:text-primary transition-colors inline-block">Ketentuan Layanan</Link>
              <Link href="/contact" className="hover:text-primary transition-colors inline-block">Bantuan & Kontak</Link>
            </div>
          </div>

          {/* Column 3: Pencari Kerja */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="font-bold text-slate-900 text-base">Pencari Kerja</h4>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <Link href="/" className="hover:text-primary transition-colors inline-block">Cari Lowongan</Link>
              <Link href="/tersimpan" className="hover:text-primary transition-colors inline-block">Lowongan Tersimpan</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors inline-block">Kebijakan Privasi</Link>
            </div>
          </div>

          {/* Column 4: Kontak */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="font-bold text-slate-900 text-base">Ikuti Kami</h4>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <a href="#" className="hover:text-primary transition-colors inline-block">Instagram</a>
              <a href="#" className="hover:text-primary transition-colors inline-block">Facebook</a>
              <a href="#" className="hover:text-primary transition-colors inline-block">LinkedIn</a>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 mt-12 pt-8 gap-4 text-xs font-medium text-slate-500">
          <p>
            © {new Date().getFullYear()} LokerTimika. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privasi</Link>
            <Link href="/ketentuan-pasang-loker" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
            <span className="text-slate-400">ID (Bahasa Indonesia)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
