import Link from 'next/link';
import { Briefcase, MessageSquare, Bell, UserCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
      <div className="container mx-auto flex h-14 max-w-[1128px] items-center justify-between px-4 sm:px-4 lg:px-0">

        <div className="flex items-center gap-2 flex-1">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg shrink-0 shadow-sm">
              LT
            </div>
            <span className="font-extrabold text-2xl tracking-tight hidden lg:inline-block text-primary">
              LokerTimika
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-1 sm:gap-6 text-muted-foreground text-xs font-medium">
          
          <ThemeToggle />

          <Link href="/post" className="hidden sm:flex flex-col items-center gap-1 hover:text-foreground py-1 px-2 transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span className="hidden md:inline">Pasang Loker</span>
          </Link>
          
          <Link href="/dashboard" className="hidden sm:flex flex-col items-center gap-1 hover:text-foreground py-1 px-2 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="hidden md:inline">Dasbor HRD</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 sm:border-l sm:border-border sm:pl-4">
            <Link href="/login" className="flex flex-col items-center gap-1 hover:text-foreground py-1 px-2 cursor-pointer transition-colors text-muted-foreground">
              <UserCircle className="w-6 h-6 sm:w-6 sm:h-6" />
              <span className="hidden md:inline">Masuk</span>
            </Link>

            {/* Mobile menu icon */}
            <div className="sm:hidden flex flex-col items-center gap-1 hover:text-foreground py-1 px-2 cursor-pointer transition-colors">
              <Menu className="w-6 h-6" />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
