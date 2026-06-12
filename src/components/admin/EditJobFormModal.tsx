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
import { Plus, Briefcase, MapPin, Building, CheckCircle2, Mail, UploadCloud, Info, Wallet, Users, CalendarRange, Phone, Link as LinkIcon } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { updateJobAction } from "@/app/actions/job";
import imageCompression from "browser-image-compression";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

interface EditJobFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: any;
}

export default function EditJobFormModal({ open, onOpenChange, job }: EditJobFormModalProps) {
  const [description, setDescription] = useState(job.description || "");
  const [requirements, setRequirements] = useState(
    job.requirements ? job.requirements.map((r: string) => `<p>${r}</p>`).join("") : ""
  );
  
  const [email, setEmail] = useState(job.contacts?.email || "");
  const [whatsapp, setWhatsapp] = useState(job.contacts?.whatsapp || "");
  const [applicationLink, setApplicationLink] = useState(job.contacts?.applicationLink || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(job.imageUrl || null);
  const supabase = createClient();
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    if (open && categories.length === 0) {
      import("@/app/actions/category").then((m) => {
        m.getCategoriesAction().then((data) => setCategories(data));
      });
    }
  }, [open, categories.length]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    setIsSubmitting(true);
    let uploadedImageUrl = "";
    
    const formData = new FormData(e.currentTarget);

    try {
      if (selectedImage) {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
          fileType: "image/webp" as any
        };
        const compressedFile = await imageCompression(selectedImage, options);
        
        const fileExt = "webp";
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `posters/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, compressedFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          alert("Gagal mengunggah gambar. Pastikan bucket 'images' tersedia di Supabase.");
        } else if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from("images")
            .getPublicUrl(filePath);
          uploadedImageUrl = publicUrl;
        }
      }

      formData.append("description", description);
      formData.append("requirements", requirements);
      if (uploadedImageUrl) {
        formData.append("imageUrl", uploadedImageUrl);
      }
      const result = await updateJobAction(job.id, formData);
      setIsSubmitting(false);

      if (result.success) {
        alert("Berhasil! Lowongan telah diperbarui.");
        onOpenChange(false);
      } else {
        alert("Gagal memperbarui lowongan: " + result.error);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      alert("Terjadi kesalahan sistem.");
    }
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
                <DialogTitle className="text-lg font-bold tracking-tight text-foreground">Edit Lowongan</DialogTitle>
                <DialogDescription className="mt-1 text-xs text-muted-foreground font-medium">
                  Ubah informasi lowongan ini.
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
                    name="title"
                    type="text" 
                    defaultValue={job.title}
                    placeholder="Cth: Mekanik Alat Berat" 
                    className="w-full h-11 px-3.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Kategori <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      required 
                      name="category"
                      defaultValue={job.category || ""}
                      className="w-full h-11 px-3.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none"
                    >
                      <option value="" disabled hidden>Pilih Kategori</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80 block flex justify-between items-center">
                    Gaji Minimal (Rp) <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Wallet className="h-4 w-4 text-muted-foreground/60" />
                    </div>
                    <input name="salaryMin" type="number" defaultValue={job.salaryMin || ""} placeholder="Cth: 5000000" className="w-full h-11 pl-10 pr-3.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80 block flex justify-between items-center">
                    Gaji Maksimal (Rp) <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Wallet className="h-4 w-4 text-muted-foreground/60" />
                    </div>
                    <input name="salaryMax" type="number" defaultValue={job.salaryMax || ""} placeholder="Cth: 8000000" className="w-full h-11 pl-10 pr-3.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground/90 block">Poster / Banner Lowongan <span className="text-xs text-muted-foreground font-normal ml-2">(Opsional)</span></label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <label className="flex items-center justify-center w-full sm:w-auto h-11 px-6 border border-dashed border-primary/40 bg-primary/5 text-primary rounded-lg cursor-pointer hover:bg-primary/10 hover:border-primary/60 transition-all group">
                    <UploadCloud className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
                    <span className="text-sm font-bold tracking-wide">Pilih Gambar</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                  
                  {imagePreview ? (
                    <div className="relative w-20 h-20 rounded-lg border border-border shadow-sm overflow-hidden bg-card shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={(e) => { e.preventDefault(); setSelectedImage(null); setImagePreview(null); }} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground leading-relaxed max-w-xs flex items-start gap-2 bg-secondary/50 p-2.5 rounded-lg border border-border/40">
                      <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <p>Format JPG, PNG, WEBP. Maks. 5MB. Gambar akan dioptimasi otomatis.</p>
                    </div>
                  )}
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Tipe Kontrak <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      required 
                      name="type"
                      defaultValue={job.type || "Full-time"}
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
                      name="education"
                      defaultValue={job.education || "Semua"}
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
                      name="experience"
                      defaultValue={job.experience || "Tanpa Pengalaman"}
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
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Preferensi Gender</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Users className="h-4 w-4 text-muted-foreground/60" />
                    </div>
                    <select name="gender" defaultValue={job.gender || "Pria/Wanita"} className="w-full h-11 pl-10 pr-10 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none">
                      <option value="Pria/Wanita">Pria / Wanita (Bebas)</option>
                      <option value="Pria">Khusus Pria</option>
                      <option value="Wanita">Khusus Wanita</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80 block flex justify-between">
                    Batasan Umur <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <CalendarRange className="h-4 w-4 text-muted-foreground/60" />
                    </div>
                    <input name="ageRange" type="text" defaultValue={job.ageRange || "Bebas"} placeholder="Cth: Maks. 35 Tahun" className="w-full h-11 pl-10 pr-3.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80 block flex justify-between">
                    Batas Lamaran <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <CalendarRange className="h-4 w-4 text-muted-foreground/60" />
                    </div>
                    <input name="deadline" type="date" defaultValue={job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ""} className="w-full h-11 pl-10 pr-3.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60" />
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
                <label className="text-sm font-medium text-foreground/80 block">Email Perekrut <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-muted-foreground/60" />
                  </div>
                  <input required name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hrd@perusahaan.com" className="w-full h-11 pl-10 pr-3.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80 block flex justify-between">
                    Nomor WhatsApp <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-muted-foreground/60" />
                    </div>
                    <input name="whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="081234567890" className="w-full h-11 pl-10 pr-3.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80 block flex justify-between">
                    Link Google Form / Eksternal <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <LinkIcon className="h-4 w-4 text-muted-foreground/60" />
                    </div>
                    <input name="applicationLink" type="url" value={applicationLink} onChange={(e) => setApplicationLink(e.target.value)} placeholder="https://forms.gle/..." className="w-full h-11 pl-10 pr-3.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60" />
                  </div>
                </div>
              </div>

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
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 hover:shadow-md hover:shadow-primary/10 transition-all w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSubmitting ? "Memproses..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
