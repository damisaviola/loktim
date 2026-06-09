"use client";

import { CheckCircle2, Eye, Edit, Trash2, XCircle, X, Building2, MapPin, Banknote, Briefcase, GraduationCap, Users, CalendarRange } from "lucide-react";
import { useTransition, useState } from "react";
import { approveJobAction, rejectJobAction, deleteJobAction } from "@/app/actions/job";
import EditJobFormModal from "@/components/admin/EditJobFormModal";

export default function JobActionButtons({ 
  job 
}: { 
  job: any;
}) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const jobId = job.id;
  const status = job.status;

  const handleApprove = () => {
    startTransition(async () => {
      await approveJobAction(jobId);
    });
  };

  const handleReject = () => {
    if (confirm("Are you sure you want to reject this job?")) {
      startTransition(async () => {
        await rejectJobAction(jobId);
      });
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this job?")) {
      startTransition(async () => {
        await deleteJobAction(jobId);
      });
    }
  };

  return (
    <div className="flex justify-end gap-3">
      {status === "pending" && (
        <button 
          onClick={handleApprove}
          disabled={isPending}
          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-md transition-colors disabled:opacity-50" 
          title="Approve"
        >
          <CheckCircle2 className="h-5 w-5" />
        </button>
      )}
      {status === "pending" && (
        <button 
          onClick={handleReject}
          disabled={isPending}
          className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 p-1.5 rounded-md transition-colors disabled:opacity-50" 
          title="Reject"
        >
          <XCircle className="h-5 w-5" />
        </button>
      )}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="text-primary hover:text-primary/80 hover:bg-primary/5 p-1.5 rounded-md transition-colors disabled:opacity-50 inline-block" 
        title="Lihat Detail"
      >
        <Eye className="h-5 w-5" />
      </button>
      <button 
        onClick={() => setIsEditModalOpen(true)}
        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-1.5 rounded-md transition-colors disabled:opacity-50" 
        title="Edit"
      >
        <Edit className="h-5 w-5" />
      </button>
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors disabled:opacity-50" 
        title="Hapus"
      >
        <Trash2 className="h-5 w-5" />
      </button>

      {/* Modal Detail Pekerjaan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Detail Lowongan</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6 text-left">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                  {job.company?.logoUrl ? (
                    <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-lg font-medium text-gray-700">{job.company?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{job.company?.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Banknote className="w-4 h-4 text-gray-500" />
                  <span>
                    {job.salaryMin 
                      ? `Rp ${job.salaryMin.toLocaleString('id-ID')} ${job.salaryMax && job.salaryMax !== job.salaryMin ? `- Rp ${job.salaryMax.toLocaleString('id-ID')}` : ''}`
                      : 'Dirahasiakan'}
                  </span>
                </div>
                {job.education && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <span>{job.education}</span>
                  </div>
                )}
                {job.gender && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{job.gender}</span>
                  </div>
                )}
                {job.ageRange && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <CalendarRange className="w-4 h-4 text-gray-500" />
                    <span>{job.ageRange}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Deskripsi Pekerjaan</h3>
                <div 
                  className="text-gray-700 text-sm leading-relaxed [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Persyaratan</h3>
                  <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                    {job.requirements.map((req: string, idx: number) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
