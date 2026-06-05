"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus, Briefcase, MapPin, Building, CheckCircle2, Mail, Phone, Image as ImageIcon, Wallet } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { createJobAction, getCompaniesAction } from "@/app/actions/job";
import imageCompression from "browser-image-compression";
import { createClient } from "@/utils/supabase/client";

export default function QuickPost() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [isNewCompany, setIsNewCompany] = useState(false);
  const [companyList, setCompanyList] = useState<{id: string, name: string}[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    getCompaniesAction().then(setCompanyList);
  }, []);

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
    
    // Construct FormData before any await calls because e.currentTarget becomes null afterwards
    const formData = new FormData(e.currentTarget);

    try {
      if (selectedImage) {
        // Compress image
        const options = {
          maxSizeMB: 0.2, // max 200KB
          maxWidthOrHeight: 1024,
          useWebWorker: true,
          fileType: "image/webp" as any
        };
        const compressedFile = await imageCompression(selectedImage, options);
        
        // Upload to Supabase Storage (assuming bucket named 'images')
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
      <div className="container mx-auto px-4 py-16 sm:py-20 max-w-2xl text-center">
        <div className="bg-card rounded-2xl border border-border p-8 sm:p-12 shadow-xl animate-in zoom-in-95 fade-in duration-500">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">Lowongan Berhasil Terkirim!</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto">
            Lowongan Anda sedang dalam proses moderasi oleh Admin LokerTimika dan akan segera aktif setelah disetujui.
          </p>
          <Link href="/" className="inline-block">
            <Button className="w-full sm:w-auto font-bold rounded-lg px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0 sm:px-4 py-0 sm:py-8 max-w-3xl">
      <div className="bg-card sm:border border-border shadow-none sm:shadow-xl rounded-none sm:rounded-2xl overflow-hidden flex flex-col min-h-[100dvh] sm:min-h-0">

        {/* HEADER */}
        <div className="p-6 border-b border-border/60 bg-card">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Pasang Lowongan Kerja Baru</h1>
            <p className="mt-1 text-xs text-muted-foreground font-medium">
              Lengkapi informasi lowongan Anda agar dapat menjangkau ribuan kandidat terbaik di LokerTimika.
            </p>
          </div>
        </div>

        {/* BODY FORM */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Gaji Minimal (Rp) <span className="text-gray-400 font-normal">(Opsional)</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      name="salaryMin"
                      type="number"
                      placeholder="Cth: 5000000"
                      className="w-full h-11 pl-10 pr-3.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Gaji Maksimal (Rp) <span className="text-gray-400 font-normal">(Opsional)</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      name="salaryMax"
                      type="number"
                      placeholder="Cth: 8000000"
                      className="w-full h-11 pl-10 pr-3.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80">Poster / Banner Lowongan <span className="text-gray-400 font-normal">(Opsional)</span></label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center justify-center w-full sm:w-auto h-11 px-4 border border-dashed border-primary/50 bg-primary/5 text-primary rounded-lg cursor-pointer hover:bg-primary/10 transition-colors">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-semibold text-primary">Upload Gambar</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="h-11 w-11 rounded-lg object-cover border border-border" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Otomatis dikompres & dioptimasi ukurannya (max 200KB).</p>
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
                  placeholder={"1. Pendidikan minimal...\n2. Pengalaman kerja..."}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Tipe Kontrak <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      required
                      name="type"
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
                      name="education"
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
                      name="experience"
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
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Gender</label>
                  <div className="relative">
                    <select
                      name="gender"
                      defaultValue="Pria/Wanita"
                      className="w-full h-11 px-3.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none"
                    >
                      <option value="Pria/Wanita">Pria/Wanita</option>
                      <option value="Pria">Pria</option>
                      <option value="Wanita">Wanita</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Batasan Umur</label>
                  <input
                    name="ageRange"
                    type="text"
                    defaultValue="Bebas"
                    placeholder="Cth: Maks. 35 Tahun"
                    className="w-full h-11 px-3.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
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

              {/* Segmented Control */}
              <div className="flex bg-secondary/30 border border-border p-1 rounded-xl text-sm max-w-md">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCompany(false);
                    setSelectedCompanyId("");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all cursor-pointer ${!isNewCompany
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
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all cursor-pointer ${isNewCompany
                      ? "bg-background text-primary shadow-sm border border-border/40"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Plus className="h-4 w-4" />
                  Perusahaan Baru
                </button>
              </div>

              {/* Conditional Form Selection */}
              {!isNewCompany ? (
                <div className="space-y-1.5 max-w-md animate-in fade-in duration-200">
                  <label className="text-sm font-medium text-foreground/80">Pilih Perusahaan <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      required={!isNewCompany}
                      name="companyId"
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
                        name="newCompanyName"
                        type="text"
                        placeholder="Cth: PT. Sukses Makmur"
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
                          name="newCompanyLocation"
                          type="text"
                          placeholder="Cth: Timika"
                          className="w-full h-11 pl-10 pr-3.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">Deskripsi Singkat Perusahaan</label>
                    <textarea
                      name="newCompanyDesc"
                      rows={2}
                      placeholder="Profil singkat perusahaan..."
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <hr className="border-border/60" />

            {/* Section 4: Kontak Pengiklan */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Kontak Lowongan</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Email Lamaran <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="hrd@perusahaan.com"
                      className="w-full h-11 pl-10 pr-3.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">WhatsApp Kontak <span className="text-gray-400 font-normal">(Opsional)</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      name="whatsapp"
                      type="tel"
                      placeholder="Cth: 081234567890"
                      className="w-full h-11 pl-10 pr-3.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="sticky bottom-0 z-10 bg-card p-4 sm:p-0 border-t sm:border-none border-border/60 mt-auto sm:mt-6 sm:pt-6 sm:border-t flex flex-col-reverse sm:flex-row sm:justify-end gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] sm:shadow-none">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-5 py-3.5 sm:py-2.5 rounded-xl sm:rounded-lg text-[15px] sm:text-sm font-semibold text-muted-foreground bg-background border border-border hover:bg-secondary hover:text-foreground transition-all shadow-sm w-full sm:w-auto cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3.5 sm:py-2.5 rounded-xl sm:rounded-lg text-[15px] sm:text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 hover:shadow-md hover:shadow-primary/10 transition-all w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isSubmitting ? "Memproses..." : "Kirim Lowongan"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
