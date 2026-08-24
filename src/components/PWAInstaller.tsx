"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone, Share, PlusSquare, MoreVertical, CheckCircle2, Sparkles, AppWindow } from "lucide-react";
import Image from "next/image";

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"android" | "ios">("android");
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("PWA: Service Worker registered successfully:", reg.scope);
        })
        .catch((err) => {
          console.warn("PWA: Service Worker registration failed:", err);
        });
    }

    // 2. Check if already running in standalone PWA mode
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsInstalled(standalone);
      return standalone;
    };

    if (checkStandalone()) {
      return;
    }

    // 3. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    setIsIOSDevice(isIos);
    if (isIos) {
      setActiveTab("ios");
    }

    // 4. Capture beforeinstallprompt event for 1-click install on Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if user dismissed prompt recently (within 24 hours)
      const dismissedAt = localStorage.getItem("pwa_modal_dismissed");
      if (!dismissedAt || (Date.now() - parseInt(dismissedAt, 10)) > 24 * 60 * 60 * 1000) {
        setIsOpen(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS devices, open automatically if not dismissed in last 24h
    if (isIos && !checkStandalone()) {
      const dismissedAt = localStorage.getItem("pwa_modal_dismissed");
      if (!dismissedAt || (Date.now() - parseInt(dismissedAt, 10)) > 24 * 60 * 60 * 1000) {
        const timer = setTimeout(() => setIsOpen(true), 2000);
        return () => clearTimeout(timer);
      }
    }

    // Listen for custom trigger to open PWA modal anywhere
    const handleOpenTrigger = () => setIsOpen(true);
    window.addEventListener("open-pwa-installer", handleOpenTrigger);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("open-pwa-installer", handleOpenTrigger);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("PWA: User accepted install prompt");
    }
    setDeferredPrompt(null);
    setIsOpen(false);
  };

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem("pwa_modal_dismissed", Date.now().toString());
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Floating App Install Badge (Always visible at bottom-right if modal is closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-primary hover:bg-primary/90 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-full shadow-lg border border-white/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Install Aplikasi LokerTimika"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Install App</span>
        </button>
      )}

      {/* Main PWA Installation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header Banner */}
            <div className="bg-gradient-to-r from-primary to-blue-700 p-6 text-white relative">
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white p-2.5 shadow-md shrink-0 flex items-center justify-center">
                  <Image
                    src="/icons/icon-192.svg"
                    alt="LokerTimika App Icon"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-amber-200 mb-1 border border-white/20">
                    <Sparkles className="w-3 h-3" /> Progressive Web App
                  </div>
                  <h3 className="text-lg font-black leading-snug">Install Aplikasi LokerTimika</h3>
                  <p className="text-xs text-blue-100 font-medium">Akses lebih cepat &amp; hemat kuota di HP Anda</p>
                </div>
              </div>
            </div>

            {/* Tab Selector (Android vs iPhone) */}
            <div className="flex border-b border-slate-100 bg-slate-50/80 p-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("android")}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "android"
                    ? "bg-white text-primary shadow-2xs border border-slate-200/80"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Pengguna Android</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ios")}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "ios"
                    ? "bg-white text-primary shadow-2xs border border-slate-200/80"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <AppWindow className="w-4 h-4" />
                <span>Pengguna iPhone (iOS)</span>
              </button>
            </div>

            {/* Modal Body: Instructions */}
            <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm leading-relaxed">

              {/* TAB 1: ANDROID */}
              {activeTab === "android" && (
                <div className="space-y-4">
                  {/* 1-Click Install Button if supported */}
                  {deferredPrompt && (
                    <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Install Otomatis (1-Klik)</h4>
                        <p className="text-xs text-slate-600">Tekan tombol untuk memasang langsung ke HP Anda.</p>
                      </div>
                      <button
                        onClick={handleInstallClick}
                        className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Install Sekarang</span>
                      </button>
                    </div>
                  )}

                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider font-mono">
                    Langkah-langkah Manual (Android / Chrome):
                  </h4>

                  <ol className="space-y-3">
                    <li className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <div>
                        <strong className="text-slate-900 block font-bold">Buka Menu Browser</strong>
                        <span>Tekan ikon <strong>Titik Tiga <MoreVertical className="w-3.5 h-3.5 inline text-slate-600" /></strong> di sudut kanan atas browser Chrome/Edge Anda.</span>
                      </div>
                    </li>

                    <li className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <div>
                        <strong className="text-slate-900 block font-bold">Pilih Tambahkan ke Layar Utama</strong>
                        <span>Pilih menu <strong className="text-primary font-bold">&quot;Tambahkan ke Layar Utama&quot;</strong> atau <strong className="text-primary font-bold">&quot;Install Aplikasi&quot;</strong>.</span>
                      </div>
                    </li>

                    <li className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <div>
                        <strong className="text-slate-900 block font-bold">Konfirmasi Pemasangan</strong>
                        <span>Tekan tombol <strong>&quot;Tambah&quot;</strong> atau <strong>&quot;Install&quot;</strong>. Aplikasi LokerTimika kini siap digunakan dari beranda HP!</span>
                      </div>
                    </li>
                  </ol>
                </div>
              )}

              {/* TAB 2: IPHONE (iOS) */}
              {activeTab === "ios" && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                    <strong className="font-bold flex items-center gap-1.5 text-amber-800">
                      <Smartphone className="w-4 h-4 text-amber-600" /> Khusus Browser Safari iPhone / iPad
                    </strong>
                    <p>Apple iOS memerlukan pemasangan manual dari menu Bagikan Safari (Share menu).</p>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider font-mono">
                    Langkah-langkah di iPhone (iOS Safari):
                  </h4>

                  <ol className="space-y-3">
                    <li className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <div>
                        <strong className="text-slate-900 block font-bold">Tekan Tombol Bagikan (Share)</strong>
                        <span>Di bagian bawah layar browser Safari, tekan ikon <strong className="text-primary font-bold">Bagikan / Share <Share className="w-3.5 h-3.5 inline text-primary" /></strong>.</span>
                      </div>
                    </li>

                    <li className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <div>
                        <strong className="text-slate-900 block font-bold">Pilih Tambahkan ke Layar Utama</strong>
                        <span>Gulir menu ke bawah lalu pilih <strong className="text-primary font-bold">&quot;Tambahkan ke Layar Utama&quot; <PlusSquare className="w-3.5 h-3.5 inline text-primary" /></strong> (Add to Home Screen).</span>
                      </div>
                    </li>

                    <li className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <div>
                        <strong className="text-slate-900 block font-bold">Tekan Tombol Tambah</strong>
                        <span>Tekan kata <strong className="text-primary font-bold">&quot;Tambah&quot; (Add)</strong> di sudut kanan atas layar iPhone Anda. Selesai!</span>
                      </div>
                    </li>
                  </ol>
                </div>
              )}

              {/* Benefit Badges */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Tanpa Kouta Tambahan</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Akses Cepat &amp; Offline</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold text-slate-500">LokerTimika App v1.0</span>
              <button
                onClick={handleDismiss}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
