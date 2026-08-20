import type { Metadata } from "next";
import Link from "next/link";
import { Home, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Halaman Tidak Ditemukan",
  description:
    "Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.",
};

export default function NotFound() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[6%] h-80 w-80 rounded-full bg-sky-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
      />

      <div
        className="relative flex max-w-xl flex-col items-center"
      >
        <div className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-border bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground shadow-sm backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Error 404
        </div>

        <h1
          className="select-none font-serif font-medium leading-none tracking-tighter"
          aria-label="404"
        >
          <span className="bg-gradient-to-b from-slate-900 via-primary to-sky-300 bg-clip-text text-[8rem] text-transparent sm:text-[12rem]">
            404
          </span>
        </h1>

        <h2 className="mt-8 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Halaman tidak ditemukan
        </h2>

        <p className="mt-3 max-w-md text-base leading-relaxed text-slate-500">
          Sepertinya halaman yang Anda cari telah dipindahkan, kedaluwarsa,
          atau tidak pernah ada di sini.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/jobs"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/jobs"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-primary/30 bg-transparent px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            <Search className="h-4 w-4" />
            Cari Lowongan
          </Link>
        </div>

        <p className="mt-14 text-xs font-medium tracking-wide text-slate-400">
          LokerTimika &middot; Temukan karir impianmu di Timika
        </p>
      </div>
    </div>
  );
}