"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function TestSupabase() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const supabase = createClient();
        // Melakukan request ringan ke auth server untuk mengecek koneksi
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        setStatus("connected");
      } catch (err: any) {
        console.error("Supabase connection error:", err);
        setStatus("error");
        setErrorMessage(err.message || "Gagal menghubungi server Supabase.");
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 space-y-6 text-center">
        <h1 className="text-2xl font-bold">Supabase Connection Test</h1>
        
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Mengecek koneksi...</p>
          </div>
        )}

        {status === "connected" && (
          <div className="space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-green-600">Berhasil Terhubung!</p>
            <p className="text-sm text-gray-500">Aplikasi Next.js Anda sudah tersambung ke project Supabase.</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-red-600">Gagal Terhubung</p>
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded text-left overflow-auto">
              Error: {errorMessage}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local sudah benar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
