"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Flag, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ReportJobModal } from "./ReportJobModal";

interface JobMoreOptionsProps {
  jobId: string;
  className?: string;
}

export function JobMoreOptions({ jobId, className }: JobMoreOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
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

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <Button 
        variant="outline"
        size="icon"
        className={className || "rounded-xl w-12 h-12 shrink-0 text-slate-500 hover:text-slate-900 transition-colors bg-white border-slate-200 hover:bg-slate-50"}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        title="Opsi Lainnya"
      >
        <MoreHorizontal className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 bottom-[calc(100%+0.5rem)] sm:top-[calc(100%+0.5rem)] sm:bottom-auto w-56 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <button 
            className="w-full text-left px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 whitespace-nowrap transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" /> Kirim Masukan
          </button>
          <div className="h-px w-full bg-slate-100 my-1"></div>
          <button 
            className="w-full text-left px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 whitespace-nowrap transition-colors"
            onClick={() => {
              setIsOpen(false);
              setIsReportModalOpen(true);
            }}
          >
            <Flag className="w-4 h-4 text-red-500 shrink-0" /> Laporkan Lowongan
          </button>
        </div>
      )}

      <ReportJobModal 
        jobId={jobId} 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />
    </div>
  );
}
