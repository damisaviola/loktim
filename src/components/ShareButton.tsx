'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui/Button';
import { Share2, Check, X, Copy, MessageCircle, Send, Globe } from 'lucide-react';

interface ShareModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ title, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const copyToClipboard = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const getShareLinks = () => {
    if (typeof window === 'undefined') return {};
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Info Lowongan Kerja: ${title} di LokerTimika`);

    return {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    };
  };

  const shareLinks = getShareLinks();

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xl animate-in fade-in p-0 sm:p-4">
      <div 
        className="absolute inset-0 bg-transparent" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 z-10 flex flex-col max-h-[90vh]">
        
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 shrink-0 sm:hidden" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">Bagikan Lowongan</h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          
          {/* Share Channels Grid */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <a 
              href={shareLinks.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={onClose}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 group-hover:bg-emerald-100 transition-all shadow-2xs">
                <MessageCircle className="w-6 h-6 fill-emerald-600/20" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">WhatsApp</span>
            </a>

            <a 
              href={shareLinks.telegram} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={onClose}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-13 h-13 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-105 group-hover:bg-sky-100 transition-all shadow-2xs">
                <Send className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Telegram</span>
            </a>

            <a 
              href={shareLinks.facebook} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={onClose}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 group-hover:bg-blue-100 transition-all shadow-2xs">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Facebook</span>
            </a>

            <button 
              onClick={copyToClipboard}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-13 h-13 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:scale-105 group-hover:bg-slate-200 transition-all shadow-2xs">
                {copied ? <Check className="w-6 h-6 text-emerald-600" /> : <Copy className="w-6 h-6" />}
              </div>
              <span className="text-[11px] font-bold text-slate-700">{copied ? 'Tersalin!' : 'Salin Text'}</span>
            </button>
          </div>

          {/* Copy URL Input Box */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700">Atau salin tautan langsung:</label>
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <input 
                type="text" 
                readOnly 
                value={typeof window !== 'undefined' ? window.location.href : ''} 
                className="flex-1 bg-transparent px-3 text-xs text-slate-600 font-medium outline-none truncate"
              />
              <button
                onClick={copyToClipboard}
                className={`h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}

interface ShareButtonProps {
  title: string;
  className?: string;
}

export function ShareButton({ title, className = "rounded-full w-10 h-10 shrink-0 relative" }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lowongan: ${title}`,
          text: `Lihat lowongan kerja ${title} di LokerTimika!`,
          url: window.location.href,
        });
        return;
      } catch (error) {
        console.log('Native share closed or failed', error);
      }
    }

    setIsOpen(true);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={className}
        onClick={handleShareClick}
        title="Bagikan lowongan ini"
      >
        <Share2 className="w-5 h-5 text-slate-600" />
      </Button>

      <ShareModal title={title} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
