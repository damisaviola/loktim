"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/Dialog";
import { companies } from "@/lib/dummy-data";
import { Plus, Briefcase, MapPin, Building, CheckCircle2, Mail } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { getCompaniesByEmailAction } from "@/app/actions/job";
import { useEffect } from "react";

interface JobFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function JobFormModal({ open, onOpenChange }: JobFormModalProps) {
  const [isNewCompany, setIsNewCompany] = useState(true);
  const [companyList, setCompanyList] = useState<{id: string, name: string}[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  
  const [email, setEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEmail(email);
    }, 500);
    return () => clearTimeout(handler);
  }, [email]);

  useEffect(() => {
    if (debouncedEmail && debouncedEmail.includes("@")) {
      getCompaniesByEmailAction(debouncedEmail).then((list) => {
        setCompanyList(list);
        if (list.length > 0) {
          setIsNewCompany(false);
          setSelectedCompanyId(list[0].id);
        } else {
          setIsNewCompany(true);
          setSelectedCompanyId("");
        }
      });
    } else {
      setCompanyList([]);
      setIsNewCompany(true);
      setSelectedCompanyId("");
    }
  }, [debouncedEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi konten teks editor
    const cleanDesc = description.replace(/<[^>]*>/g, "").trim();
    const cleanReq = requirements.replace(/<[^>]*>/g, "").trim();

    if (!cleanDesc) {
      alert("Deskripsi Lengkap wajib diisi!");
      return;
    }
    if (!cleanReq) {
      alert("Persyaratan (Requirements) wajib diisi!");
      return;
    }

    alert("Berhasil! Lowongan baru telah tersimpan sebagai 'Menunggu Approval'.");
    setIsNewCompany(true);
    setSelectedCompanyId("");
    setDescription("");
    setRequirements("");
    setEmail("");
    setCompanyList([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl !p-0 overflow-hidden border border-border bg-card shadow-2xl rounded-2xl !flex !flex-col max-h-[90vh] !gap-0">
        
        {/* HEADER FIXED */}
        <div className="p-6 pr-12 border-b border-border/60 shrink-0 bg-card">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold tracking-tight text-foreground">Publikasi Lowongan</DialogTitle>
                <DialogDescription className="mt-1 text-xs text-muted-foreground font-medium">
                  Lengkapi informasi berikut untuk menjangkau kandidat terbaik.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>
        
        {/* BODY SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <form id="create-job-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Pekerjaan */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Detail Pekerjaan</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Posisi Pekerjaan <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Cth: Mekanik Alat Berat" 
                    className="w-full h-11 px-3.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Kategori <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      required 
                      defaultValue=""
                      className="w-full h-11 px-3.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none"
                    >
                      <option value="" disabled hidden>Pilih Kategori</option>
                      <option value="Teknik & Engineering">Teknik & Engineering</option>
                      <option value="Operasional">Operasional</option>
                      <option value="Admin & HR">Admin & HR</option>
                      <option value="IT & Software">IT & Software</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80">Deskripsi Lengkap <span className="text-red-500">*</span></label>
                <RichTextEditor 
                  defaultValue={description}
                  onChange={(val) => setDescription(val)}
                  placeholder="Jelaskan peran, tanggung jawab, dan gambaran umum pekerjaan..." 
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80">Persyaratan (Requirements) <span className="text-red-500">*</span></label>
                <RichTextEditor 
                  defaultValue={requirements}
                  onChange={(val) => setRequirements(val)}
                  placeholder="1. Pendidikan minimal...&#10;2. Pengalaman kerja..." 
                />
              </div>
            </div>

            {/* Divider */}
            <hr className="border-border/60" />

            {/* Section 2: Kualifikasi */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Kualifikasi Kandidat</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Tipe Kontrak <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      required 
                      defaultValue="Full-time"
                      className="w-full h-11 px-3.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Magang">Magang</option>
                      <option value="Kontrak">Kontrak</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Pendidikan</label>
                  <div className="relative">
                    <select 
                      defaultValue="Semua"
                      className="w-full h-11 px-3.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none"
                    >
                      <option value="Semua">Semua Jenjang</option>
                      <option value="SMA/SMK">SMA/SMK</option>
                      <option value="D3">Diploma (D3)</option>
                      <option value="S1">Sarjana (S1)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Pengalaman</label>
                  <div className="relative">
                    <select 
                      defaultValue="Tanpa Pengalaman"
                      className="w-full h-11 px-3.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none"
                    >
                      <option value="Tanpa Pengalaman">Fresh Graduate</option>
                      <option value="1-3 Tahun">1-3 Tahun</option>
                      <option value="3-5 Tahun">3-5 Tahun</option>
                      <option value="> 5 Tahun">Lebih dari 5 Tahun</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-border/60" />

            {/* Section 3: Perusahaan */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Profil Perusahaan</h4>
              </div>
              
              {/* Field Email (Move to top) */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80 block">Email Perusahaan / Perekrut <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-muted-foreground/60" />
                  </div>
                  <input required name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hrd@perusahaan.com" className="w-full h-11 pl-10 pr-3.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-1">
                  {email.length === 0 ? "Ketik email untuk memuat daftar perusahaan terdaftar." : 
                   companyList.length > 0 ? "✅ Perusahaan ditemukan untuk email ini." :
                   debouncedEmail.includes("@") ? "ℹ️ Email belum terdaftar. Isi form perusahaan baru." : ""}
                </p>
              </div>

              {/* Segmented Control */}
              {companyList.length > 0 && (
                <div className="flex bg-secondary/30 border border-border p-1 rounded-xl text-sm max-w-md mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewCompany(false);
                      setSelectedCompanyId(companyList[0]?.id || "");
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                      !isNewCompany
                        ? "bg-background text-primary shadow-sm border border-border/40"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Building className="h-4 w-4" />
                    Perusahaan Terdaftar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewCompany(true);
                      setSelectedCompanyId("");
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                      isNewCompany
                        ? "bg-background text-primary shadow-sm border border-border/40"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    Perusahaan Baru
                  </button>
                </div>
              )}

              {/* Conditional Form Selection */}
              {!isNewCompany ? (
                <div className="space-y-1.5 max-w-md animate-in fade-in duration-200">
                  <label className="text-sm font-medium text-foreground/80">Pilih Perusahaan <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      required={!isNewCompany}
                      value={selectedCompanyId}
                      onChange={(e) => setSelectedCompanyId(e.target.value)}
                      className="w-full h-11 px-3.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none"
                    >
                      <option value="" disabled hidden>-- Pilih Perusahaan Terdaftar --</option>
                      {companyList.map(comp => (
                        <option key={comp.id} value={comp.id}>{comp.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground/80">Nama Perusahaan <span className="text-red-500">*</span></label>
                      <input 
                        required={isNewCompany} 
                        type="text" 
                        placeholder="Cth: PT. Timika Sentosa" 
                        className="w-full h-11 px-3.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground/80">Lokasi Penempatan <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input 
                          required={isNewCompany} 
                          type="text" 
                          placeholder="Cth: Tembagapura" 
                          className="w-full h-11 pl-10 pr-3.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">Deskripsi Singkat Perusahaan</label>
                    <textarea 
                      rows={2} 
                      placeholder="Profil singkat perusahaan..." 
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        
        {/* FOOTER FIXED */}
        <div className="p-5 border-t border-border/60 shrink-0 bg-secondary/20">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button 
              type="button" 
              onClick={() => onOpenChange(false)}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground bg-background border border-border hover:bg-secondary hover:text-foreground transition-all shadow-sm w-full sm:w-auto cursor-pointer"
            >
              Batal
            </button>
            <button 
              form="create-job-form"
              type="submit"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 hover:shadow-md hover:shadow-primary/10 transition-all w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              Publikasikan Lowongan
            </button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
