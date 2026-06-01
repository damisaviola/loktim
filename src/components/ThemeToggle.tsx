"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = (e: React.MouseEvent) => {
    const newTheme = theme === "light" ? "dark" : "light";
    
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

  return (
    <button
      onClick={toggleTheme}
      title="Ubah Tema"
      className="flex flex-col items-center gap-1 hover:text-primary text-muted-foreground py-1 px-1 sm:px-2 transition-all duration-300 ease-spring cursor-pointer bg-transparent border-none hover:scale-110 active:scale-75 active:rotate-12"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-500 dark:-rotate-180 dark:scale-0 text-current" />
        <Moon className="absolute h-5 w-5 rotate-180 scale-0 transition-transform duration-500 dark:rotate-0 dark:scale-100 text-current" />
      </div>
      <span className="hidden md:inline text-xs font-medium">Tema</span>
    </button>
  );
}
