"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { toast } from "sonner";

interface BookmarkButtonProps {
  jobId: string;
  jobTitle?: string;
  className?: string;
  iconClassName?: string;
  showLabel?: boolean;
}

export function BookmarkButton({
  jobId,
  jobTitle,
  className = "",
  iconClassName = "w-4 h-4",
  showLabel = false,
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark, isLoaded } = useBookmarks();
  const [isPopping, setIsPopping] = useState(false);

  if (!isLoaded) {
    return (
      <div 
        className={`w-9 h-9 rounded-xl bg-slate-100 animate-pulse shrink-0 ${className}`} 
      />
    );
  }

  const bookmarked = isBookmarked(jobId);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Trigger pop micro-animation
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 400);

    const willBeBookmarked = !bookmarked;
    toggleBookmark(jobId);

    if (willBeBookmarked) {
      toast.success(
        jobTitle 
          ? `"${jobTitle}" disimpan ke favorit` 
          : "Lowongan berhasil disimpan!"
      );
    } else {
      toast.info("Lowongan dihapus dari simpanan");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={bookmarked ? "Hapus dari simpanan" : "Simpan lowongan"}
      title={bookmarked ? "Hapus dari lowongan tersimpan" : "Simpan lowongan ini"}
      className={`group/bm relative inline-flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer select-none outline-none ${
        bookmarked
          ? "bg-primary text-white border-primary shadow-xs shadow-primary/25 hover:bg-primary/90"
          : "bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-primary border-slate-200/80 hover:border-primary/30"
      } border rounded-xl active:scale-90 ${
        isPopping ? "scale-115 ring-4 ring-primary/20" : "hover:scale-105"
      } ${className || "p-2"}`}
    >
      {/* Ripple / Flash effect on bookmark toggle */}
      {isPopping && bookmarked && (
        <span className="absolute inset-0 rounded-xl bg-primary/30 animate-ping pointer-events-none" />
      )}

      <Bookmark
        className={`${iconClassName} transition-all duration-300 ${
          bookmarked
            ? "fill-white text-white drop-shadow-xs"
            : "fill-transparent text-slate-400 group-hover/bm:text-primary"
        } ${
          isPopping ? "rotate-12 scale-125" : "rotate-0 scale-100"
        }`}
      />

      {showLabel && (
        <span className="text-xs font-bold font-sans">
          {bookmarked ? "Tersimpan" : "Simpan Loker"}
        </span>
      )}
    </button>
  );
}
