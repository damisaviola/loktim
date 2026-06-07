'use client'

import { useState } from 'react'
import { Check, Trash2, Loader2, MoreVertical } from 'lucide-react'
import { resolveReportAction, deleteReportAction } from '@/app/actions/report'
import { deleteJobAction } from '@/app/actions/job'
import { toast } from 'sonner'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export function ReportActionButtons({ report }: { report: any }) {
  const [isResolving, setIsResolving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeletingJob, setIsDeletingJob] = useState(false)

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
    if (!confirm('Yakin ingin menghapus laporan ini?')) return
    setIsDeleting(true)
    const result = await deleteReportAction(report.id)
    if (result.success) {
      toast.success('Laporan dihapus')
    } else {
      toast.error(result.error)
    }
    setIsDeleting(false)
  }

  const handleDeleteJob = async () => {
    if (!confirm('AWAS: Yakin ingin menghapus LOWONGAN PEKERJAAN ini secara permanen dari sistem?')) return
    setIsDeletingJob(true)
    const result = await deleteJobAction(report.jobId)
    if (result.success) {
      toast.success('Lowongan berhasil dihapus')
    } else {
      toast.error(result.error)
    }
    setIsDeletingJob(false)
  }

  return (
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
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer outline-none transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Laporan</span>
            </DropdownMenu.Item>
            
            <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />
            
            <DropdownMenu.Item 
              onClick={handleDeleteJob}
              disabled={isDeletingJob}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 font-bold hover:bg-red-50 rounded-lg cursor-pointer outline-none transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Lowongan</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}
