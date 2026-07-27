'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Flag, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { reportJobAction } from '@/app/actions/report';

interface ReportJobModalProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  "Penipuan atau Scam",
  "Informasi Lowongan Palsu",
  "Mengandung Unsur SARA / Diskriminasi",
  "Spam atau Iklan Tidak Relevan",
  "Minta Biaya / Pungutan Liar",
  "Lainnya"
];

export function ReportJobModal({ jobId, isOpen, onClose }: ReportJobModalProps) {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await reportJobAction(jobId, reason, details);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || 'Terjadi kesalahan saat melaporkan');
    }
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setReason(REPORT_REASONS[0]);
    setDetails('');
    setError(null);
    onClose();
  };

  return (
    <>
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xl animate-in fade-in p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-transparent" 
            onClick={handleClose}
          />
          
          <div className="relative bg-white w-full max-w-md rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 z-10 flex flex-col max-h-[90vh]">
            
            {/* Mobile Drag Indicator Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 shrink-0 sm:hidden" />
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">Laporkan Lowongan</h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Bantu kami menjaga keamanan komunitas</p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            {isSuccess ? (
              <div className="p-6 sm:p-8 flex flex-col items-center text-center overflow-y-auto">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-2xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Laporan Terkirim</h3>
                <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                  Terima kasih telah melaporkan lowongan ini. Tim kami akan segera meninjaunya dan mengambil tindakan yang diperlukan.
                </p>
                <Button onClick={handleClose} className="w-full h-11 rounded-2xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all">
                  Tutup
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
                  
                  {error && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="font-medium">{error}</p>
                    </div>
                  )}

                  {/* Reason Selection */}
                  <div className="space-y-2.5">
                    <label className="text-xs sm:text-sm font-bold text-slate-900">
                      Mengapa Anda melaporkan lowongan ini?
                    </label>
                    <div className="space-y-2">
                      {REPORT_REASONS.map((r, i) => (
                        <label key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer transition-all has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50/50">
                          <input 
                            type="radio" 
                            name="reportReason" 
                            value={r}
                            checked={reason === r}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-4 h-4 text-rose-600 focus:ring-rose-500 accent-rose-600 shrink-0"
                          />
                          <span className="text-xs sm:text-sm font-semibold text-slate-800">{r}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-2">
                    <label htmlFor="details" className="text-xs sm:text-sm font-bold text-slate-900 flex justify-between">
                      Informasi Tambahan <span className="text-slate-400 font-normal text-xs">Opsional</span>
                    </label>
                    <textarea 
                      id="details"
                      rows={3}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Ceritakan lebih detail mengenai laporan Anda..."
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-xs sm:text-sm resize-none outline-none transition-all text-slate-900"
                    />
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2.5 shrink-0">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleClose}
                    className="h-10 px-5 rounded-xl font-bold text-xs text-slate-600 border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="h-10 px-6 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs cursor-pointer"
                  >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
