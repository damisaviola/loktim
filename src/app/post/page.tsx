"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { 
  Plus, Briefcase, MapPin, Building, CheckCircle2, 
  Mail, Phone, Image as ImageIcon, Wallet,
  GraduationCap, Award, Users, CalendarRange, LayoutList, Building2, UploadCloud, Info
} from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { createJobAction, getCompaniesByEmailAction } from "@/app/actions/job";
import imageCompression from "browser-image-compression";
import { createClient } from "@/utils/supabase/client";

export default function QuickPost() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [isNewCompany, setIsNewCompany] = useState(true);
  const [companyList, setCompanyList] = useState<{id: string, name: string}[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [email, setEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  const supabase = createClient();

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      formData.append("isNewCompany", isNewCompany.toString());
      if (uploadedImageUrl) {
        formData.append("imageUrl", uploadedImageUrl);
      }

      const result = await createJobAction(formData);

      setIsSubmitting(false);
      if (result.success) {
        setSuccess(true);
      } else {
        alert("Gagal mengirim lowongan: " + result.error);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert("Terjadi kesalahan sistem.");
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 sm:py-24 max-w-2xl text-center min-h-[80vh] flex flex-col items-center justify-center">
        <div className="bg-card rounded-3xl border border-border p-8 sm:p-14 shadow-2xl shadow-blue-500/5 animate-in zoom-in-95 fade-in duration-500 w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500"></div>
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm rotate-3">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 text-foreground tracking-tight">Lowongan Berhasil Terkirim!</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
            Lowongan Anda sedang dalam proses moderasi oleh tim kami. Lowongan akan segera aktif setelah disetujui.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/" className="inline-block w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-bold rounded-xl px-8 h-12 border-border hover:bg-secondary transition-all">
                Kembali ke Beranda
              </Button>
            </Link>
            <Button size="lg" onClick={() => window.location.reload()} className="w-full sm:w-auto font-bold rounded-xl px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all">
              Pasang Lowongan Lain
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0 sm:px-4 py-0 sm:py-10 max-w-[900px]">
      <div className="bg-background sm:bg-transparent overflow-hidden flex flex-col min-h-[100dvh] sm:min-h-0 sm:gap-6">

        {/* HEADER BANNER */}
        <div className="relative p-8 sm:p-12 sm:rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#312e81] text-white shadow-xl shadow-blue-900/10">
          <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide uppercase mb-6">
              <Plus className="w-3.5 h-3.5" /> Formulir Loker
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">Pasang Lowongan<br />Kerja Baru</h1>
            <p className="text-base sm:text-lg text-blue-100/80 font-medium leading-relaxed max-w-lg">
              Lengkapi informasi dengan detail agar dapat menarik dan menjangkau kandidat terbaik di Mimika.
            </p>
          </div>
        </div>

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4 sm:p-0">

          {/* Section 1: Informasi Pekerjaan */}
          <div className="bg-card border border-border/60 sm:rounded-[1.5rem] p-6 sm:p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 rounded-l-[1.5rem] hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border/40">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/30">
                <Briefcase className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Detail Pekerjaan</h2>
                <p className="text-sm text-muted-foreground mt-1">Informasi utama mengenai posisi yang ditawarkan</p>
              </div>
            </div>

            <div className="space-y-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/90 block">Posisi Pekerjaan <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-muted-foreground/60" />
                    </div>
                    <input required name="title" type="text" placeholder="Cth: Mekanik Alat Berat" className="w-full h-14 pl-12 pr-4 bg-secondary/30 border border-border/60 hover:border-border rounded-xl text-base text-foreground focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:font-normal placeholder:text-muted-foreground/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/90 block">Kategori <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LayoutList className="h-5 w-5 text-muted-foreground/60" />
                    </div>
                    <select required name="category" defaultValue="" className="w-full h-14 pl-12 pr-10 bg-secondary/30 border border-border/60 hover:border-border rounded-xl text-base text-foreground focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer appearance-none font-medium">
                      <option value="" disabled hidden>Pilih Kategori</option>
                      <option value="Teknik & Engineering">Teknik & Engineering</option>
                      <option value="Operasional">Operasional</option>
                      <option value="Admin & HR">Admin & HR</option>
                      <option value="IT & Software">IT & Software</option>
                      <option value="F&B">F&B / Restoran</option>
                      <option value="Logistik">Logistik & Gudang</option>
                      <option value="Pelayanan">Pelayanan / Hospitality</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground">
                      <svg className="h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/90 block flex justify-between items-center">
                    Gaji Minimal (Rp) <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Wallet className="h-5 w-5 text-muted-foreground/60" />
                    </div>
                    <input name="salaryMin" type="number" placeholder="Cth: 5000000" className="w-full h-14 pl-12 pr-4 bg-secondary/30 border border-border/60 hover:border-border rounded-xl text-base text-foreground focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:font-normal placeholder:text-muted-foreground/50" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/90 block flex justify-between items-center">
                    Gaji Maksimal (Rp) <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Wallet className="h-5 w-5 text-muted-foreground/60" />
                    </div>
                    <input name="salaryMax" type="number" placeholder="Cth: 8000000" className="w-full h-14 pl-12 pr-4 bg-secondary/30 border border-border/60 hover:border-border rounded-xl text-base text-foreground focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:font-normal placeholder:text-muted-foreground/50" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground/90 block">Poster / Banner Lowongan <span className="text-xs text-muted-foreground font-normal ml-2">(Opsional)</span></label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <label className="flex items-center justify-center w-full sm:w-auto h-14 px-6 border-2 border-dashed border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-800 transition-all group">
                    <UploadCloud className="w-5 h-5 mr-2.5 group-hover:-translate-y-1 transition-transform" />
                    <span className="text-sm font-bold tracking-wide">Pilih Gambar</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                  
                  {imagePreview ? (
                    <div className="relative w-24 h-24 rounded-xl border border-border shadow-sm overflow-hidden bg-card">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={(e) => { e.preventDefault(); setSelectedImage(null); setImagePreview(null); }} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground leading-relaxed max-w-xs flex items-start gap-2 bg-secondary/50 p-3 rounded-lg border border-border/40">
                      <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <p>Format JPG, PNG, WEBP. Maksimal 5MB. Gambar akan dioptimasi otomatis ke ukuran WebP.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/90 block">Deskripsi Lengkap <span className="text-red-500">*</span></label>
                <div className="rounded-xl overflow-hidden border border-border/60 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                  <RichTextEditor
                    defaultValue={description}
                    onChange={(val) => setDescription(val)}
                    placeholder="Jelaskan peran, tanggung jawab, dan gambaran umum pekerjaan..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/90 block">Persyaratan (Requirements) <span className="text-red-500">*</span></label>
                <div className="rounded-xl overflow-hidden border border-border/60 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                  <RichTextEditor
                    defaultValue={requirements}
                    onChange={(val) => setRequirements(val)}
                    placeholder={"1. Pendidikan minimal...\n2. Pengalaman kerja..."}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Kualifikasi */}
          <div className="bg-card border border-border/60 sm:rounded-[1.5rem] p-6 sm:p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 rounded-l-[1.5rem] hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border/40">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/30">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Kualifikasi Kandidat</h2>
                <p className="text-sm text-muted-foreground mt-1">Spesifikasi pencari kerja yang Anda cari</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/90 block">Tipe Kontrak <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                  <select required name="type" defaultValue="Full-time" className="w-full h-14 pl-12 pr-10 bg-secondary/30 border border-border/60 hover:border-border rounded-xl text-base text-foreground focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer appearance-none font-medium">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Magang">Magang</option>
                    <option value="Kontrak">Kontrak</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground">
                    <svg className="h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/90 block">Pendidikan Minimal</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <GraduationCap className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                  <select name="education" defaultValue="Semua" className="w-full h-14 pl-12 pr-10 bg-secondary/30 border border-border/60 hover:border-border rounded-xl text-base text-foreground focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer appearance-none font-medium">
                    <option value="Semua">Semua Jenjang</option>
                    <option value="SMA/SMK">SMA/SMK</option>
                    <option value="D3">Diploma (D3)</option>
                    <option value="S1">Sarjana (S1)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground">
                    <svg className="h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/90 block">Pengalaman</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Award className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                  <select name="experience" defaultValue="Tanpa Pengalaman" className="w-full h-14 pl-12 pr-10 bg-secondary/30 border border-border/60 hover:border-border rounded-xl text-base text-foreground focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer appearance-none font-medium">
                    <option value="Tanpa Pengalaman">Fresh Graduate</option>
                    <option value="1-3 Tahun">1-3 Tahun</option>
                    <option value="3-5 Tahun">3-5 Tahun</option>
                    <option value="> 5 Tahun">Lebih dari 5 Tahun</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground">
                    <svg className="h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/90 block">Preferensi Gender</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                  <select name="gender" defaultValue="Pria/Wanita" className="w-full h-14 pl-12 pr-10 bg-secondary/30 border border-border/60 hover:border-border rounded-xl text-base text-foreground focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer appearance-none font-medium">
                    <option value="Pria/Wanita">Pria / Wanita (Bebas)</option>
                    <option value="Pria">Khusus Pria</option>
                    <option value="Wanita">Khusus Wanita</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground">
                    <svg className="h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 sm:col-span-2 md:col-span-1">
                <label className="text-sm font-semibold text-foreground/90 block flex justify-between">
                  Batasan Umur <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CalendarRange className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                  <input name="ageRange" type="text" defaultValue="Bebas" placeholder="Cth: Maks. 35 Tahun" className="w-full h-14 pl-12 pr-4 bg-secondary/30 border border-border/60 hover:border-border rounded-xl text-base text-foreground focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium placeholder:font-normal placeholder:text-muted-foreground/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Perusahaan & Kontak */}
          <div className="bg-card border border-border/60 sm:rounded-[1.5rem] p-6 sm:p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500 rounded-l-[1.5rem] hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border/40">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-800/30">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Perusahaan & Kontak</h2>
                <p className="text-sm text-muted-foreground mt-1">Identitas dan cara pelamar menghubungi Anda</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Field Email (Move to top) */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/90 block">Email Perusahaan / Perekrut <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                  <input required name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hrd@perusahaan.com" className="w-full h-14 pl-12 pr-4 bg-background border border-border hover:border-orange-300 rounded-xl text-base text-foreground focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium placeholder:font-normal placeholder:text-muted-foreground/50" />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 ml-1">
                  {email.length === 0 ? "Ketik email Anda untuk memuat daftar perusahaan yang terdaftar." : 
                   companyList.length > 0 ? "✅ Perusahaan ditemukan untuk email ini." :
                   debouncedEmail.includes("@") ? "ℹ️ Email ini belum memiliki perusahaan terdaftar. Silakan isi form perusahaan baru." : ""}
                </p>
              </div>

              {/* Switch Perusahaan (only show if companyList > 0) */}
              {companyList.length > 0 && (
                <div className="bg-secondary/40 p-1.5 rounded-xl flex max-w-md mx-auto sm:mx-0 shadow-inner border border-border/50">
                  <button
                    type="button"
                    onClick={() => { setIsNewCompany(false); setSelectedCompanyId(companyList[0]?.id || ""); }}
                    className={`flex-1 flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all ${!isNewCompany ? "bg-white dark:bg-background text-orange-600 dark:text-orange-400 shadow-sm border border-border/40" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Building className="h-4 w-4" /> Perusahaan Terdaftar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsNewCompany(true); setSelectedCompanyId(""); }}
                    className={`flex-1 flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all ${isNewCompany ? "bg-white dark:bg-background text-orange-600 dark:text-orange-400 shadow-sm border border-border/40" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Plus className="h-4 w-4" /> Perusahaan Baru
                  </button>
                </div>
              )}

              {/* Form Perusahaan */}
              <div className="bg-secondary/10 p-5 rounded-2xl border border-border/50">
                {!isNewCompany ? (
                  <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                    <label className="text-sm font-semibold text-foreground/90 block">Pilih Perusahaan <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-muted-foreground/60" />
                      </div>
                      <select required={!isNewCompany} name="companyId" value={selectedCompanyId} onChange={(e) => setSelectedCompanyId(e.target.value)} className="w-full h-14 pl-12 pr-10 bg-background border border-border hover:border-orange-300 rounded-xl text-base text-foreground focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer appearance-none font-medium">
                        <option value="" disabled hidden>-- Pilih Perusahaan Anda --</option>
                        {companyList.map(comp => (
                          <option key={comp.id} value={comp.id}>{comp.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground">
                        <svg className="h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground/90 block">Nama Perusahaan <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Building className="h-5 w-5 text-muted-foreground/60" />
                          </div>
                          <input required={isNewCompany} name="newCompanyName" type="text" placeholder="Cth: PT. Sukses Makmur" className="w-full h-14 pl-12 pr-4 bg-background border border-border hover:border-orange-300 rounded-xl text-base text-foreground focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium placeholder:font-normal placeholder:text-muted-foreground/50" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground/90 block">Lokasi Penempatan <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-muted-foreground/60" />
                          </div>
                          <input required={isNewCompany} name="newCompanyLocation" type="text" placeholder="Cth: Kuala Kencana, Timika" className="w-full h-14 pl-12 pr-4 bg-background border border-border hover:border-orange-300 rounded-xl text-base text-foreground focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium placeholder:font-normal placeholder:text-muted-foreground/50" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground/90 block flex justify-between">
                        Deskripsi Perusahaan <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
                      </label>
                      <textarea name="newCompanyDesc" rows={3} placeholder="Profil singkat atau bidang industri perusahaan..." className="w-full px-4 py-4 bg-background border border-border hover:border-orange-300 rounded-xl text-base text-foreground focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all resize-none font-medium placeholder:font-normal placeholder:text-muted-foreground/50" />
                    </div>
                  </div>
                )}
              </div>

              {/* Kontak Tambahan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/90 block flex justify-between">
                    Nomor WhatsApp <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-muted-foreground/60" />
                    </div>
                    <input name="whatsapp" type="tel" placeholder="081234567890" className="w-full h-14 pl-12 pr-4 bg-secondary/30 border border-border/60 hover:border-border rounded-xl text-base text-foreground focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium placeholder:font-normal placeholder:text-muted-foreground/50" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ACTION BUTTONS (Sticky Bottom) */}
          <div className="sticky bottom-0 sm:bottom-6 z-50 bg-card/80 backdrop-blur-xl p-4 sm:p-5 border-t border-border/60 sm:border sm:rounded-2xl mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground hidden md:inline-flex mr-auto items-center gap-1.5">
              <Info className="w-4 h-4" /> Pastikan semua data sudah benar sebelum mengirim.
            </span>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3.5 sm:py-3 rounded-xl text-base sm:text-sm font-bold text-muted-foreground bg-background hover:bg-secondary border border-border transition-all w-full sm:w-auto"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 sm:py-3 rounded-xl text-base sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <CheckCircle2 className="h-5 w-5" />
              {isSubmitting ? "Memproses..." : "Kirim Lowongan"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
