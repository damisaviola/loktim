"use client";

import { CheckCircle2, Eye, Edit, Trash2, XCircle, X, Building2, MapPin, Banknote, Briefcase, GraduationCap, Users, CalendarRange, AlertTriangle } from "lucide-react";
import { useTransition, useState } from "react";
import { approveJobAction, rejectJobAction, deleteJobAction } from "@/app/actions/job";
import Image from "next/image";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { AlertModal } from "@/components/ui/AlertModal";

const EditJobFormModal = dynamic(() => import("@/components/admin/EditJobFormModal"), { ssr: false });

export default function JobActionButtons({ 
  job 
}: { 
  job: any;
}) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const jobId = job.id;
  const status = job.status;

  const handleApprove = () => {
    startTransition(async () => {
      const res = await approveJobAction(jobId);
      if (res?.success) {
        toast.success("Lowongan berhasil disetujui & ditayangkan!");
      } else {
        toast.error("Gagal menyetujui lowongan: " + (res?.error || "Terjadi kesalahan"));
      }
    });
  };

  const handleConfirmReject = () => {
    setIsRejectConfirmOpen(false);
    startTransition(async () => {
      const res = await rejectJobAction(jobId);
      if (res?.success) {
        toast.info("Lowongan telah ditolak.");
      } else {
        toast.error("Gagal menolak lowongan: " + (res?.error || "Terjadi kesalahan"));
      }
    });
  };

  const handleConfirmDelete = () => {
    setIsDeleteConfirmOpen(false);
    startTransition(async () => {
      const res = await deleteJobAction(jobId);
      if (res?.success) {
        toast.success("Lowongan berhasil dihapus.");
      } else {
        toast.error("Gagal menghapus lowongan: " + (res?.error || "Terjadi kesalahan"));
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      
      {/* Action: Setujui (Approval Button) */}
      {status === "pending" && (
        <button 
          onClick={handleApprove}
          disabled={isPending}
          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50" 
          title="Setujui & Publikasikan Lowongan"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>Setujui</span>
        </button>
      )}

      {/* Action: Tolak (Reject Button) */}
      {status === "pending" && (
        <button 
          onClick={() => setIsRejectConfirmOpen(true)}
          disabled={isPending}
          className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 font-extrabold text-xs flex items-center gap-1 transition-all shadow-2xs cursor-pointer disabled:opacity-50" 
          title="Tolak Lowongan Ini"
        >
          <XCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span>Tolak</span>
        </button>
      )}

      {/* Action: Detail (View Button) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer" 
        title="Lihat Detail"
      >
        <Eye className="h-4 w-4" />
      </button>

      {/* Action: Edit */}
      <button 
        onClick={() => setIsEditModalOpen(true)}
        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer" 
        title="Edit Lowongan"
      >
        <Edit className="h-4 w-4" />
      </button>

      {/* Action: Hapus (Delete Button) */}
      <button 
        onClick={() => setIsDeleteConfirmOpen(true)}
        disabled={isPending}
        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50" 
        title="Hapus Lowongan"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Modal Confirm Reject */}
      {isRejectConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200 border border-slate-200/80">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Tolak Lowongan Ini?</h3>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              Lowongan <strong className="text-slate-800">{job.title}</strong> akan ditolak dan tidak akan dipublikasikan.
            </p>
            <div className="flex gap-2.5 justify-center">
              <button 
                onClick={() => setIsRejectConfirmOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors flex-1"
              >
                Batal
              </button>
              <button 
                onClick={handleConfirmReject}
                className="px-4 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-2xl transition-colors shadow-2xs flex-1"
              >
                Ya, Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirm Delete */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200 border border-slate-200/80">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-rose-100">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Hapus Lowongan Permanen?</h3>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              Lowongan <strong className="text-slate-800">{job.title}</strong> akan dihapus permanen dari sistem. Aksi ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-2.5 justify-center">
              <button 
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors flex-1"
              >
                Batal
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-2xl transition-colors shadow-2xs flex-1"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Pekerjaan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200/80">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-900">Detail Permohonan Lowongan</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6 text-left">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-2xs">
                  {job.company?.logoUrl ? (
                    <Image 
                      src={job.company.logoUrl} 
                      alt={job.company.name} 
                      fill 
                      sizes="64px" 
                      loading="lazy" 
                      className="object-contain p-1.5" 
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{job.title}</h1>
                  <p className="text-sm font-semibold text-slate-600 mt-0.5">{job.company?.name}</p>
                </div>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{job.location || job.company?.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Banknote className="w-4 h-4 text-slate-400" />
                  <span>
                    {job.salaryMin 
                      ? `Rp ${job.salaryMin.toLocaleString('id-ID')} ${job.salaryMax && job.salaryMax !== job.salaryMin ? `- Rp ${job.salaryMax.toLocaleString('id-ID')}` : ''}`
                      : 'Dirahasiakan'}
                  </span>
                </div>
                {job.education && (
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>{job.education}</span>
                  </div>
                )}
                {job.gender && (
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{job.gender}</span>
                  </div>
                )}
                {job.ageRange && (
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <CalendarRange className="w-4 h-4 text-slate-400" />
                    <span>Batas Usia: {job.ageRange} Thn</span>
                  </div>
                )}
              </div>

              {/* Deskripsi */}
              <div>
                <h3 className="font-extrabold text-slate-900 mb-2 text-sm">Deskripsi Pekerjaan</h3>
                <div 
                  className="text-slate-600 text-xs leading-relaxed break-words whitespace-pre-wrap prose prose-slate prose-xs max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>

              {/* Persyaratan */}
              {job.requirements && (
                <div>
                  <h3 className="font-extrabold text-slate-900 mb-2 text-sm">Persyaratan</h3>
                  <div 
                    className="text-slate-600 text-xs leading-relaxed break-words whitespace-pre-wrap prose prose-slate prose-xs max-w-none"
                    dangerouslySetInnerHTML={{ __html: typeof job.requirements === 'string' ? job.requirements : job.requirements.join('\n') }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2.5">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 font-bold text-xs text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <EditJobFormModal 
          open={isEditModalOpen} 
          onOpenChange={setIsEditModalOpen} 
          job={job} 
        />
      )}
    </div>
  );
}
