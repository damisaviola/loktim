"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Job } from "@/types";
import { ExternalLink, X, Mail, MessageCircle, Link as LinkIcon } from "lucide-react";
import { Button } from "./ui/Button";

export function ApplyModal({ 
  job, 
  isMobile = false, 
  isExpired = false,
  className,
  label
}: { 
  job: Job; 
  isMobile?: boolean; 
  isExpired?: boolean;
  className?: string;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasWhatsapp = !!job.contacts?.whatsapp;
  const hasEmail = !!job.contacts?.email;
  const hasApplicationLink = !!job.contacts?.applicationLink;
  const fallbackUrl = job.contactUrl;

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const getWhatsappUrl = (number?: string) => {
    if (!number) return fallbackUrl;
    const cleanNumber = number.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}`;
  };

  const getEmailUrl = (email?: string) => {
    if (!email) return fallbackUrl;
    const subject = encodeURIComponent(`Lamaran Pekerjaan: ${job.title} - [Nama Anda]`);

    if (typeof window !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf("android") > -1) {
        return `intent://compose?to=${email}&subject=${subject}#Intent;scheme=mailto;package=com.google.android.gm;end;`;
      }
      if (/iphone|ipad|ipod/.test(ua)) {
        return `googlegmail:///co?to=${email}&subject=${subject}`;
      }
    }

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}`;
  };

  return (
    <>
      <button
        disabled={isExpired}
        onClick={handleApplyClick}
        className={
          className || (
            isMobile
              ? "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold transition-all disabled:opacity-50 bg-primary text-white hover:bg-primary/90 h-12 text-sm flex-1 cursor-pointer shadow-xs"
              : "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold transition-all disabled:opacity-50 bg-primary text-white hover:bg-primary/90 h-12 px-7 text-sm cursor-pointer shadow-xs"
          )
        }
      >
        <span>{isExpired ? "Lowongan Ditutup" : (label || (isMobile ? "Lamar Sekarang" : "Lamar Sekarang"))}</span>
        {!isExpired && <ExternalLink className="w-4 h-4 ml-2 shrink-0" />}
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xl animate-in fade-in p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-transparent"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white w-full max-w-md rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 z-10 flex flex-col max-h-[85vh]">

            {/* Mobile Drag Indicator Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 shrink-0 sm:hidden" />

            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/60 shrink-0">
              <div>
                <h2 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">Pilih Cara Melamar</h2>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Kirimkan lamaran kerja Anda langsung ke perusahaan</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-1 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 pb-6 sm:pb-6">
              <div className="bg-blue-50/70 border border-blue-100/90 rounded-2xl p-3.5 text-xs text-slate-600 leading-relaxed font-medium">
                Melamar ke <strong className="text-slate-900 font-bold">{job.company?.name || 'Perusahaan'}</strong> untuk posisi <strong className="text-slate-900 font-bold">{job.title}</strong>:
              </div>

              <div className="space-y-3">
                {hasWhatsapp && (
                  <a
                    href={getWhatsappUrl(job.contacts?.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-500/40 hover:bg-emerald-50/30 transition-all group shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 shadow-2xs">
                        <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600/20" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-sm text-slate-900 leading-snug">WhatsApp HRD</div>
                        <div className="text-xs text-slate-500 font-medium truncate mt-0.5">Kirim pesan & CV langsung via WhatsApp</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0 ml-2" />
                  </a>
                )}

                {hasEmail && (
                  <a
                    href={getEmailUrl(job.contacts?.email)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-500/40 hover:bg-blue-50/30 transition-all group shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-sm text-slate-900 leading-snug">Email Perusahaan</div>
                        <div className="text-xs text-slate-500 font-medium truncate mt-0.5">{job.contacts?.email}</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-2" />
                  </a>
                )}

                {hasApplicationLink && (
                  <a
                    href={job.contacts?.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-purple-500/40 hover:bg-purple-50/30 transition-all group shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 shadow-2xs">
                        <LinkIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-sm text-slate-900 leading-snug">Formulir Rekrutmen</div>
                        <div className="text-xs text-slate-500 font-medium truncate mt-0.5">Buka halaman web pendaftaran resmi</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors shrink-0 ml-2" />
                  </a>
                )}

                {/* Fallback if no specific contacts are defined but contactUrl exists */}
                {!hasWhatsapp && !hasEmail && !hasApplicationLink && fallbackUrl && (
                  <a
                    href={fallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-primary/40 hover:bg-slate-50 transition-all group shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 shadow-2xs">
                        <ExternalLink className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-sm text-slate-900 leading-snug">Website Resmi / Kontak</div>
                        <div className="text-xs text-slate-500 font-medium truncate mt-0.5">Kunjungi halaman lamaran</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors shrink-0 ml-2" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
