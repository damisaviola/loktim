"use client";

import { usePathname } from "next/navigation";

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <main className={`flex-1 flex flex-col relative w-full ${isAdmin ? "" : "pt-6"}`}>
      {children}
    </main>
  );
}
