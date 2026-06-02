"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-card border-t border-border/60 mt-16 py-8 text-sm text-muted-foreground">
      <div className="container mx-auto px-4 max-w-[1128px]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo & Name */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg shrink-0 shadow-sm">
                LT
              </div>
              <span className="font-extrabold text-xl tracking-tight text-primary">
                LokerTimika
              </span>
            </Link>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/contact" className="hover:text-primary transition-colors">
              Hubungi Kami
            </Link>
            <span className="text-border">|</span>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Kebijakan Privasi
            </Link>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-border/50 mt-6 pt-6 gap-4 text-xs">
          <p>
            © {new Date().getFullYear()} LokerTimika. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="hover:text-primary cursor-pointer transition-colors">Bahasa Indonesia</span>
            <span className="text-border">|</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Hubungi Dukungan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
