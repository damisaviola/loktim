"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";
import { Bug, Send, AlertTriangle, Server, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SentryExamplePage() {
  const [status, setStatus] = useState<string | null>(null);

  const triggerClientError = () => {
    try {
      setStatus("Mengirim client-side error ke Sentry...");
      const err = new Error("Test Sentry Client Error - LokerTimika (" + new Date().toISOString() + ")");
      Sentry.captureException(err);
      setStatus("✅ Client-side error dikirim! Silakan periksa dashboard Sentry.");
    } catch (error) {
      console.error(error);
    }
  };

  const triggerServerError = async () => {
    try {
      setStatus("Mengirim server-side error ke Sentry via API...");
      const res = await fetch("/api/sentry-example-api");
      const data = await res.json();
      setStatus(`✅ Server-side error dikirim! (${data.message})`);
    } catch (error) {
      setStatus("❌ Gagal memanggil API server.");
    }
  };

  const triggerUnhandledError = () => {
    throw new Error("Test Sentry Unhandled Exception - LokerTimika (" + new Date().toISOString() + ")");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-2xs">
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Sentry Test Page</h1>
            <p className="text-xs text-slate-500">Uji coba penangkapan error di LokerTimika</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Klik salah satu tombol di bawah untuk memicu error uji coba ke Sentry proyek <strong>timverse / loktim</strong>:
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={triggerServerError}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Server className="w-4 h-4" />
              <span>1. Trigger Server-Side Error (API Route)</span>
            </button>

            <button
              onClick={triggerClientError}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>2. Trigger Client-Side Error (Browser SDK)</span>
            </button>

            <button
              onClick={triggerUnhandledError}
              className="px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>3. Trigger Unhandled Exception (Global Error)</span>
            </button>
          </div>

          {status && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs font-semibold text-purple-800 animate-fade-in">
              {status}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
          <Link href="/" className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
