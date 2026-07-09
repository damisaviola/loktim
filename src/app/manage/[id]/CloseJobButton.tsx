'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { XCircle, Loader2 } from 'lucide-react';
import { closeJobAction } from '@/app/actions/job';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';

export default function CloseJobButton({ jobId }: { jobId: string }) {
  const [isClosing, setIsClosing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = async () => {
    setIsClosing(true);
    const result = await closeJobAction(jobId);
    if (result.success) {
      setIsOpen(false);
    } else {
      alert(result.error);
    }
    setIsClosing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button"
          className="w-full font-bold rounded-xl h-12 transition-all gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 shadow-sm hover:shadow group"
        >
          <XCircle className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-12" /> Tutup Lowongan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tutup Lowongan?</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menutup lowongan ini? Lowongan yang ditutup tidak akan ditampilkan lagi kepada publik. Aksi ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isClosing}>
            Batal
          </Button>
          <Button type="button" variant="destructive" onClick={handleClose} disabled={isClosing}>
            {isClosing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Ya, Tutup Lowongan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
