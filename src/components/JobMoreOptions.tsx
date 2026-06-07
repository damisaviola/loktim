"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Flag, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ReportJobModal } from "./ReportJobModal";

interface JobMoreOptionsProps {
  jobId: string;
}

export function JobMoreOptions({ jobId }: JobMoreOptionsProps) {
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
        className="rounded-full w-12 h-12 shrink-0 text-muted-foreground hover:text-primary transition-colors bg-card"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        title="Opsi Lainnya"
      >
        <MoreHorizontal className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 bottom-[calc(100%+0.5rem)] sm:top-14 sm:bottom-auto w-56 bg-popover border border-border rounded-md shadow-md py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <button 
            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 whitespace-nowrap"
            onClick={() => setIsOpen(false)}
          >
            <MessageSquare className="w-4 h-4 shrink-0" /> Kirim Masukan
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-secondary flex items-center gap-2 whitespace-nowrap"
            onClick={() => {
              setIsOpen(false);
              setIsReportModalOpen(true);
            }}
          >
            <Flag className="w-4 h-4 shrink-0" /> Laporkan Lowongan
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
