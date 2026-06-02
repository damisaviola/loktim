"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { setTheme, theme, resolvedTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (e: React.MouseEvent) => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    
    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    // Use View Transition for smooth page-wide theme swap
    document.startViewTransition(() => {
      setTheme(newTheme);
    });
  };

  if (!mounted) {
    return (
      <button className="flex flex-col items-center gap-1 hover:text-primary text-muted-foreground py-1 px-1 sm:px-2 bg-transparent border-none">
        <div className="w-5 h-5"></div>
        <span className="hidden md:inline text-xs font-medium">Tema</span>
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      title="Ubah Tema"
      className="flex flex-col items-center gap-1 hover:text-primary text-muted-foreground py-1 px-1 sm:px-2 transition-all duration-300 ease-spring cursor-pointer bg-transparent border-none hover:scale-110 active:scale-75"
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        <Sun 
          className={`absolute h-5 w-5 transition-all duration-500 ease-out text-current ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`} 
        />
        <Moon 
          className={`absolute h-5 w-5 transition-all duration-500 ease-out text-current ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`} 
        />
      </div>
      <span className="hidden md:inline text-xs font-medium">
        {isDark ? "Terang" : "Gelap"}
      </span>
    </button>
  );
}
