'use client';

import { useState } from 'react';
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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={handleClose}
      />
      
      <div className="relative bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <Flag className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Laporkan Lowongan</h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Laporan Terkirim</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Terima kasih telah melaporkan lowongan ini. Tim kami akan segera meninjaunya dan mengambil tindakan yang diperlukan.
            </p>
            <Button onClick={handleClose} className="w-full h-11 rounded-full font-bold">
              Tutup
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Reason Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground">
                  Mengapa Anda melaporkan lowongan ini?
                </label>
                <div className="space-y-2">
                  {REPORT_REASONS.map((r, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input 
                        type="radio" 
                        name="reportReason" 
                        value={r}
                        checked={reason === r}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                      />
                      <span className="text-sm font-medium">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-2">
                <label htmlFor="details" className="text-sm font-bold text-foreground flex justify-between">
                  Informasi Tambahan <span className="text-muted-foreground font-normal">Opsional</span>
                </label>
                <textarea 
                  id="details"
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Ceritakan lebih detail mengenai laporan Anda..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm resize-none outline-none transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="rounded-full font-semibold"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="rounded-full font-semibold px-6 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
