"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 animate-pulse ${className}`} />
    );
  }

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("system");
    } else {
      setTheme("dark");
    }
  };

  const getIcon = () => {
    if (theme === "dark") {
      return <Moon className="w-4 h-4 text-amber-400 fill-amber-400/20" />;
    }
    if (theme === "light") {
      return <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />;
    }
    return <Laptop className="w-4 h-4 text-primary" />;
  };

  const getLabel = () => {
    if (theme === "dark") return "Mode Gelap";
    if (theme === "light") return "Mode Terang";
    return "Mode Sistem";
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={`Tema: ${getLabel()} (Klik untuk ganti)`}
      aria-label={`Ganti Tema (Saat ini: ${getLabel()})`}
      className={`relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 cursor-pointer 
        bg-white dark:bg-slate-900 
        border-slate-200/90 dark:border-slate-800 
        hover:bg-slate-100 dark:hover:bg-slate-800 
        hover:border-slate-300 dark:hover:border-slate-700 
        shadow-2xs active:scale-95 ${className}`}
    >
      {getIcon()}
    </button>
  );
}
