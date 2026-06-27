'use client'

import { useState } from 'react'
import { Check, Trash2, Loader2, MoreVertical, AlertTriangle } from 'lucide-react'
import { resolveReportAction, deleteReportAction } from '@/app/actions/report'
import { deleteJobAction } from '@/app/actions/job'
import { toast } from 'sonner'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'

export function ReportActionButtons({ report }: { report: any }) {
  const [isResolving, setIsResolving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeletingJob, setIsDeletingJob] = useState(false)

  const [deleteReportOpen, setDeleteReportOpen] = useState(false)
  const [deleteJobOpen, setDeleteJobOpen] = useState(false)

  const handleResolve = async () => {
    setIsResolving(true)
    const result = await resolveReportAction(report.id)
    if (result.success) {
      toast.success('Laporan ditandai selesai')
    } else {
      toast.error(result.error)
    }
    setIsResolving(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteReportAction(report.id)
    if (result.success) {
      toast.success('Laporan dihapus')
      setDeleteReportOpen(false)
    } else {
      toast.error(result.error)
    }
    setIsDeleting(false)
  }

  const handleDeleteJob = async () => {
    setIsDeletingJob(true)
    const result = await deleteJobAction(report.jobId)
    if (result.success) {
      toast.success('Lowongan berhasil dihapus')
      setDeleteJobOpen(false)
    } else {
      toast.error(result.error)
    }
    setIsDeletingJob(false)
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        {report.status !== 'resolved' && (
          <button
            onClick={handleResolve}
            disabled={isResolving}
            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-1.5 font-medium text-xs disabled:opacity-50"
          >
            {isResolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Selesai
          </button>
        )}

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              align="end" 
              className="min-w-[160px] bg-white rounded-xl shadow-lg border border-gray-100 p-1 z-50 animate-in fade-in zoom-in-95"
            >
              <DropdownMenu.Item 
                onSelect={() => setDeleteReportOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer outline-none transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Laporan</span>
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />
              
              <DropdownMenu.Item 
                onSelect={() => setDeleteJobOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 font-bold hover:bg-red-50 rounded-lg cursor-pointer outline-none transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Lowongan</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Modal Hapus Laporan */}
      <Dialog open={deleteReportOpen} onOpenChange={setDeleteReportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" /> Konfirmasi Hapus Laporan
            </DialogTitle>
            <DialogDescription className="mt-2">
              Apakah Anda yakin ingin menghapus laporan ini? Laporan yang sudah dihapus tidak dapat dikembalikan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
            <button 
              onClick={() => setDeleteReportOpen(false)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Ya, Hapus
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Hapus Lowongan */}
      <Dialog open={deleteJobOpen} onOpenChange={setDeleteJobOpen}>
        <DialogContent className="sm:max-w-md border-red-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 text-lg">
              <AlertTriangle className="w-6 h-6" /> Hapus Lowongan Permanen?
            </DialogTitle>
            <DialogDescription className="mt-2 text-base text-gray-700">
              Peringatan: Tindakan ini akan <strong>menghapus lowongan pekerjaan secara permanen</strong> dari sistem beserta semua datanya. Apakah Anda sangat yakin?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button 
              onClick={() => setDeleteJobOpen(false)}
              disabled={isDeletingJob}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={handleDeleteJob}
              disabled={isDeletingJob}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeletingJob ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Ya, Hapus Lowongan Permanen
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

