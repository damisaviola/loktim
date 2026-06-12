"use client";

import { useState } from "react";
import { Job } from "@/types";
import { ExternalLink, X, Mail, MessageCircle, Link as LinkIcon } from "lucide-react";
import { Button } from "./ui/Button";

export function ApplyModal({ job, isMobile = false, isExpired = false }: { job: Job, isMobile?: boolean, isExpired?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

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
    // Basic format to wa.me link
    const cleanNumber = number.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}`;
  };

  const getEmailUrl = (email?: string) => {
    if (!email) return fallbackUrl;
    const subject = encodeURIComponent(`Lamaran Pekerjaan: ${job.title} - [Nama Anda]`);

    if (typeof window !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      // Android deep link to Gmail
      if (ua.indexOf("android") > -1) {
        return `intent://compose?to=${email}&subject=${subject}#Intent;scheme=mailto;package=com.google.android.gm;end;`;
      }
      // iOS deep link to Gmail
      if (/iphone|ipad|ipod/.test(ua)) {
        return `googlegmail:///co?to=${email}&subject=${subject}`;
      }
    }

    // Fallback for Desktop
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}`;
  };

  return (
    <>
      <button
        disabled={isExpired}
        onClick={handleApplyClick}
        className={
          isMobile
            ? "inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-sm flex-1"
            : "inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-sm sm:text-base flex-1"
        }
      >
        {isExpired ? "Lowongan Ditutup" : (isMobile ? "Lamar Sekarang" : "Lamar")}
        {!isMobile && !isExpired && <ExternalLink className="w-4 h-4 ml-2" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4 sm:p-0">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 sm:slide-in-from-bottom-0">
            <div className="p-4 sm:p-6 border-b border-border flex justify-between items-center bg-secondary/30">
              <h2 className="font-bold text-lg text-foreground">Pilih Cara Melamar</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Perekrut dari <strong className="text-foreground">{job.company?.name}</strong> menerima lamaran melalui:
              </p>

              <div className="space-y-3">
                {hasWhatsapp && (
                  <a
                    href={getWhatsappUrl(job.contacts?.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-500 fill-current" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">WhatsApp</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Kirim pesan langsung ke HRD</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}

                {hasEmail && (
                  <a
                    href={getEmailUrl(job.contacts?.email)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">Email</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Kirim CV ke {job.contacts?.email}</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}

                {hasApplicationLink && (
                  <a
                    href={job.contacts?.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                        <LinkIcon className="w-5 h-5 text-purple-600 dark:text-purple-500" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">Link Formulir</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Isi formulir pendaftaran</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}

                {/* Fallback if no specific contacts are defined but contactUrl exists */}
                {!hasWhatsapp && !hasEmail && !hasApplicationLink && fallbackUrl && (
                  <a
                    href={fallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                        <ExternalLink className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">Link Eksternal</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Kunjungi halaman lamaran</div>
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
