"use client";

import { useState } from "react";
import { Job } from "@/types";
import { X, Briefcase, MapPin } from "lucide-react";
import { Button } from "./ui/Button";
import Link from "next/link";

export function CompanyJobsModal({ jobs, companyName }: { jobs: Job[], companyName: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full font-bold"
        onClick={() => setIsOpen(true)}
      >
        Lihat Semua Lowongan ({jobs.length})
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4 sm:p-0">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 sm:slide-in-from-bottom-0 flex flex-col max-h-[85vh]">
            <div className="p-4 sm:p-6 border-b border-border flex justify-between items-center bg-secondary/30 shrink-0">
              <h2 className="font-bold text-lg text-foreground">
                Lowongan di {companyName}
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto">
              {jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.map((j) => (
                    <Link
                      key={j.id}
                      href={`/job/${j.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex flex-col p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors group"
                    >
                      <h3 className="font-bold text-primary group-hover:underline text-sm sm:text-base leading-tight mb-1.5">{j.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{j.company?.location || 'Tidak diketahui'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>{j.type}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p>Belum ada lowongan lain dari perusahaan ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
