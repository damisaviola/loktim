"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bug, CheckCircle2, Send } from "lucide-react";

const inputClass =
  "w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-colors";
const labelClass = "block text-base font-medium text-slate-700";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-3xl px-6 pt-10">
        {/* Back link */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors group-hover:border-foreground">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          </span>
          Kembali
        </Link>

        {isSubmitted ? (
          <div className="py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground">
              Laporan Diterima
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
              Terima kasih telah meluangkan waktu. Tim teknis kami akan segera menganalisis dan
              memperbaiki kendala ini.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-8 text-sm font-semibold text-slate-700 transition-colors hover:border-primary/40 hover:text-primary cursor-pointer"
            >
              Laporkan Bug Lainnya
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mt-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Bug className="h-7 w-7" aria-hidden="true" />
              </div>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                Ada kendala?
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Detailkan masalah yang Anda alami. Tim kami akan segera menanganinya secepat
                mungkin.
              </p>
            </div>

            {/* Form */}
            <div className="mt-12 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm shadow-slate-200/50 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <label htmlFor="name" className={labelClass}>
                      Nama
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Nama Anda"
                      className={inputClass}
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label htmlFor="email" className={labelClass}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="nama@email.com"
                      className={inputClass}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label htmlFor="subject" className={labelClass}>
                    Area Masalah
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    placeholder="Contoh: Gagal mengunggah logo perusahaan"
                    className={inputClass}
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="message" className={labelClass}>
                      Detail Kendala
                    </label>
                    <span className="text-sm text-slate-400">Opsional tapi disarankan</span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={7}
                    placeholder="Ceritakan langkah-langkah yang Anda lakukan sebelum error muncul..."
                    className={`${inputClass} h-auto resize-y py-4`}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-base font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-80 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Send className="h-5 w-5 animate-pulse" aria-hidden="true" />
                        Mengirim Laporan...
                      </>
                    ) : (
                      <>
                        Kirim Laporan
                        <Send className="h-5 w-5" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}