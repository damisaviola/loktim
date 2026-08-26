"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Flag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ReportJobModal } from "./ReportJobModal";
import { ShareModal } from "./ShareButton";

interface JobMoreOptionsProps {
  jobId: string;
  jobTitle?: string;
  className?: string;
}

export function JobMoreOptions({ jobId, jobTitle = "Lowongan Kerja", className }: JobMoreOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = async () => {
    setIsOpen(false);
    if (typeof window === "undefined") return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lowongan: ${jobTitle}`,
          text: `Lihat lowongan kerja ${jobTitle} di LokerTimika!`,
          url: window.location.href,
        });
        return;
      } catch (error) {
        console.log("Native share closed or failed", error);
      }
    }

    setIsShareModalOpen(true);
  };

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <Button 
        variant="outline"
        size="icon"
        className={className || "rounded-xl w-11 h-11 shrink-0 text-slate-600 hover:text-slate-900 transition-colors bg-slate-50 border-slate-200 hover:bg-slate-100 shadow-2xs"}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        title="Opsi Lainnya"
      >
        <MoreHorizontal className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 bottom-[calc(100%+0.5rem)] sm:top-[calc(100%+0.5rem)] sm:bottom-auto w-56 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-2 z-[100] animate-in fade-in zoom-in-95 duration-100">
          <button 
            className="w-full text-left px-5 py-3 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 whitespace-nowrap transition-colors cursor-pointer"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 text-slate-500 shrink-0" /> Bagikan Lowongan
          </button>

          <div className="h-px w-full bg-slate-100 my-1" />

          <button 
            className="w-full text-left px-5 py-3 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 whitespace-nowrap transition-colors cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              setIsReportModalOpen(true);
            }}
          >
            <Flag className="w-4 h-4 text-red-500 shrink-0" /> Laporkan Lowongan
          </button>
        </div>
      )}

      <ShareModal 
        title={jobTitle} 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
      />

      <ReportJobModal 
        jobId={jobId} 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />
    </div>
  );
}
