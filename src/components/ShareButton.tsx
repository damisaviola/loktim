'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  className?: string;
}

export function ShareButton({ title, className = "rounded-full w-10 h-10 shrink-0 relative" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lowongan: ${title}`,
          text: `Lihat lowongan kerja ${title} di LokerTimika!`,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={handleShare}
      title="Bagikan lowongan ini"
    >
      {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}

      {copied && (
        <span className="absolute -bottom-8 bg-card border border-border text-xs px-2 py-1 rounded shadow-sm whitespace-nowrap">
          Tautan disalin!
        </span>
      )}
    </Button>
  );
}
