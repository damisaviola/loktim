'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const PLACEHOLDERS = [
  "Cari posisi mekanik...",
  "Cari pekerjaan barista...",
  "Cari lowongan admin gudang...",
  "Cari posisi operator alat berat...",
  "Cari lowongan IT support...",
  "Cari pekerjaan kasir...",
  "Cari lowongan driver...",
  "Cari posisi security...",
  "Cari kesempatan magang...",
  "Ketik posisi yang Anda cari..."
];

interface TypewriterSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TypewriterSearch({ searchQuery, onSearchChange }: TypewriterSearchProps) {
  const [placeholderText, setPlaceholderText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let typeSpeed = isDeleting ? 50 : 80;
    const fullText = PLACEHOLDERS[placeholderIndex];

    if (!isDeleting && placeholderText === fullText) {
      typeSpeed = 5000; // Jeda 5 detik saat teks selesai diketik
    } else if (isDeleting && placeholderText === '') {
      typeSpeed = 1000; // Jeda sebelum mulai kata baru
    }

    const timer = setTimeout(() => {
      if (!isDeleting && placeholderText === fullText) {
        setIsDeleting(true);
      } else if (isDeleting && placeholderText === '') {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
      } else {
        setPlaceholderText(
          fullText.substring(0, placeholderText.length + (isDeleting ? -1 : 1))
        );
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, placeholderIndex]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholderText ? `${placeholderText}|` : "|"}
        aria-label="Cari lowongan pekerjaan"
        className="w-full h-12 sm:h-14 pl-12 pr-10 bg-transparent border-none focus:ring-0 focus:outline-none text-sm sm:text-base text-white font-medium placeholder:text-white/60 transition-all"
      />
      {searchQuery && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white/80 bg-white/20 hover:bg-white/30 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Hapus pencarian"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
