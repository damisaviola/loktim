"use client";

import { usePathname } from "next/navigation";

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isLogin = pathname === "/login" || pathname === "/perusahaan/login";
  const isDashboard = pathname === "/dashboard";

  return (
    <main className={`flex-1 flex flex-col relative w-full ${isAdmin || isLogin || isDashboard ? "" : "pt-6"}`}>
      {children}
    </main>
  );
}
