"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import Image from "next/image";

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSTip, setShowIOSTip] = useState(false);

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
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return; // Already running as installed PWA
    }

    // Check if user dismissed prompt recently (within 48 hours)
    const dismissedAt = localStorage.getItem("pwa_install_dismissed");
    if (dismissedAt) {
      const hours = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60);
      if (hours < 48) {
        return; // Don't prompt again within 48 hours
      }
    }

    // 3. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 4. Capture beforeinstallprompt event for Android / Chrome / Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If iOS Safari and not standalone, show tip after 5s
    if (isIosDevice && !isStandalone) {
      const timer = setTimeout(() => {
        setShowIOSTip(true);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
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
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSTip(false);
    localStorage.setItem("pwa_install_dismissed", Date.now().toString());
  };

  if (!showPrompt && !showIOSTip) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-200/90 flex flex-col gap-3 relative">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden relative p-2 text-primary">
            <Image
              src="/icons/icon-192.svg"
              alt="LokerTimika App Icon"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                Install Aplikasi LokerTimika
              </h4>
              <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isIOS
                ? "Dapatkan akses cepat & offline! Tekan tombol Bagikan (Share) lalu pilih 'Tambahkan ke Layar Utama'."
                : "Akses informasi lowongan kerja Timika lebih cepat & hemat kuota langsung dari layar utama hp Anda."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {!isIOS && deferredPrompt && (
          <div className="flex items-center justify-end gap-2.5 pt-1 border-t border-slate-100">
            <button
              onClick={handleDismiss}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Nanti Saja
            </button>
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install Sekarang</span>
            </button>
          </div>
        )}

        {isIOS && showIOSTip && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
            <Smartphone className="w-4 h-4 text-primary shrink-0" />
            <span>Tekan ikon <strong className="text-primary font-bold">Share ⎘</strong> → <strong className="text-slate-900 font-bold">Add to Home Screen</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
