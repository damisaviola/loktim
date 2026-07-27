"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { 
  Plus, Briefcase, MapPin, Building, CheckCircle2, 
  Mail, Phone, Wallet, GraduationCap, Award, Users, LayoutList, Building2, UploadCloud, Info, Link as LinkIcon, User, CalendarClock, ArrowRight, Sparkles, X, Copy, ChevronRight, ChevronLeft
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { createJobAction, getCompaniesByEmailAction } from "@/app/actions/job";
import imageCompression from "browser-image-compression";
import { createClient } from "@/utils/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { toast } from "sonner";

const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-44 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
});

export default function PostFormClient() {
  const formRef = useRef<HTMLFormElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);

  const [isNewCompany, setIsNewCompany] = useState(true);
  const [companyList, setCompanyList] = useState<{id: string, name: string}[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [email, setEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  const [salaryMinDisplay, setSalaryMinDisplay] = useState("");
  const [salaryMaxDisplay, setSalaryMaxDisplay] = useState("");

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/\D/g, "");
    if (!numberString) return "";
    return parseInt(numberString, 10).toLocaleString("id-ID");
  };

  const handleSalaryMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalaryMinDisplay(formatRupiah(e.target.value));
  };

  const handleSalaryMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalaryMaxDisplay(formatRupiah(e.target.value));
  };

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

  const handleNext = () => {
    if (formRef.current) {
      if (currentStep === 2) {
        // Validate RichTextEditor separately since they are not native inputs
        const cleanDesc = description.replace(/<[^>]*>/g, "").trim();
        const cleanReq = requirements.replace(/<[^>]*>/g, "").trim();
        if (!cleanDesc) {
          toast.warning("Deskripsi Lengkap wajib diisi!");
          return;
        }
        if (!cleanReq) {
          toast.warning("Persyaratan (Requirements) wajib diisi!");
          return;
        }
      }

      const isValid = formRef.current.reportValidity();
      if (isValid) {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanDesc = description.replace(/<[^>]*>/g, "").trim();
    const cleanReq = requirements.replace(/<[^>]*>/g, "").trim();

    if (!cleanDesc) {
      toast.warning("Deskripsi Lengkap wajib diisi!");
      return;
    }
    if (!cleanReq) {
      toast.warning("Persyaratan (Requirements) wajib diisi!");
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
          toast.error("Gagal mengunggah gambar. Pastikan bucket 'images' tersedia di Supabase.");
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
        setCreatedJobId(result.jobId || null);
        setSuccess(true);
      } else {
        toast.error("Gagal mengirim lowongan: " + result.error);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      toast.error("Terjadi kesalahan sistem.");
    }
  };

  const magicLink = createdJobId && typeof window !== 'undefined' ? `${window.location.origin}/manage/${createdJobId}` : "";

  const copyToClipboard = () => {
    if (magicLink) {
      navigator.clipboard.writeText(magicLink);
      toast.success("Link berhasil disalin!");
    }
  };

  return (
    <div className="max-w-[920px] mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 mb-24 sm:mb-12">
      
      {/* Dialog Success */}
      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xs border border-emerald-100">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <DialogTitle className="text-xl font-extrabold text-slate-900">Lowongan Berhasil Dikirim</DialogTitle>
            <DialogDescription className="text-xs text-slate-600 leading-relaxed mt-1">
              Lowongan Anda sedang dalam antrean review tim kami (maksimal 1x24 jam).<br/>
              Simpan link di bawah ini untuk melihat status atau mengubah lowongan.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <p className="text-xs font-mono text-slate-600 truncate flex-1" title={magicLink}>
              {magicLink}
            </p>
            <button 
              type="button" 
              onClick={copyToClipboard}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
              title="Salin Link"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button type="button" variant="outline" className="w-full sm:w-auto font-bold text-xs rounded-2xl h-11" onClick={copyToClipboard}>
              Salin Link
            </Button>
            <Link href={`/manage/${createdJobId}`} className="w-full sm:w-auto">
              <Button type="button" className="w-full font-bold text-xs rounded-2xl h-11 bg-primary text-white shadow-2xs">
                Buka Status Lowongan
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Gratis 100% Tanpa Biaya</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Pasang Lowongan Kerja Baru
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-lg pt-1">
            Lengkapi formulir di bawah ini untuk menjangkau ribuan pencari kerja potensial di Mimika.
          </p>
        </div>
        
        {/* Ambient glows */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/25 blur-3xl rounded-full pointer-events-none"></div>
      </div>

      {/* Timeline / Wizard Stepper */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between sm:justify-start gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
        {[
          { step: 1, title: "Perusahaan", icon: Building2 },
          { step: 2, title: "Pekerjaan", icon: Briefcase },
          { step: 3, title: "Kualifikasi", icon: Award },
        ].map((item, index) => {
          const isActive = currentStep === item.step;
          const isCompleted = currentStep > item.step;
          
          return (
            <div key={item.step} className="flex items-center gap-3 shrink-0">
              <div className={`flex items-center gap-2.5 ${isActive ? 'opacity-100' : isCompleted ? 'opacity-70' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${isActive ? 'bg-primary text-white shadow-md' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                </div>
                <span className={`text-xs font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                  {item.title}
                </span>
              </div>
              {index < 2 && (
                <div className="w-6 sm:w-12 h-[2px] rounded-full bg-slate-100 ml-3 sm:ml-4">
                  <div className={`h-full bg-primary rounded-full transition-all duration-500 ${isCompleted ? 'w-full' : 'w-0'}`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Information Banner (Show only on step 1) */}
      {currentStep === 1 && (
        <div className="bg-blue-50/70 border border-blue-100 rounded-3xl p-5 flex items-start gap-3.5 text-xs text-blue-900 font-medium">
          <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className="font-bold text-blue-950 text-xs">Pengecekan Data Perusahaan:</h4>
            <p className="text-slate-600 leading-relaxed">
              Ketik Email Anda terlebih dahulu. Jika perusahaan Anda sudah terdaftar di sistem kami, form akan terisi otomatis sehingga Anda tidak perlu mengetik ulang profil perusahaan.
            </p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

        {/* STEP 1: Perusahaan & Kontak */}
        <div className={currentStep === 1 ? "block" : "hidden"}>
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Perusahaan & Kontak</h2>
                <p className="text-xs text-slate-500 font-medium">Identitas instansi dan saluran pengiriman lamaran</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Email Perekrut / HRD <span className="text-rose-500">*</span>
                </label>
                <input
                  required={currentStep === 1}
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hrd@perusahaan.com"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                />
                <p className="text-[11px] text-slate-400 font-medium pt-0.5">
                  {email.length === 0 ? "Ketik email Anda untuk mendeteksi profil perusahaan." : 
                   companyList.length > 0 ? "✅ Perusahaan terdaftar ditemukan untuk email ini." :
                   debouncedEmail.includes("@") ? "ℹ️ Email baru. Silakan isi data perusahaan baru di bawah." : ""}
                </p>
              </div>

              {/* Kontak Tambahan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 justify-between flex items-center">
                    <span>Nomor WhatsApp</span>
                    <span className="text-[10px] text-slate-400 font-normal">Opsional</span>
                  </label>
                  <input
                    name="whatsapp"
                    type="tel"
                    placeholder="081234567890"
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 justify-between flex items-center">
                    <span>Link Google Form / Aplikasi</span>
                    <span className="text-[10px] text-slate-400 font-normal">Opsional</span>
                  </label>
                  <input
                    name="applicationLink"
                    type="url"
                    placeholder="https://forms.gle/..."
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="pt-2 pb-2">
                <div className="h-px bg-slate-100 w-full"></div>
              </div>

              {/* Switch Perusahaan */}
              {companyList.length > 0 && (
                <div className="bg-slate-100 p-1 rounded-2xl flex max-w-sm border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => { setIsNewCompany(false); setSelectedCompanyId(companyList[0]?.id || ""); }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${!isNewCompany ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"}`}
                  >
                    Gunakan Data Terdaftar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsNewCompany(true); setSelectedCompanyId(""); }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${isNewCompany ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"}`}
                  >
                    + Buat Data Baru
                  </button>
                </div>
              )}

              {/* Container Profil Perusahaan */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                {!isNewCompany ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Pilih Perusahaan Terdaftar</label>
                    <select
                      required={currentStep === 1 && !isNewCompany}
                      name="companyId"
                      value={selectedCompanyId}
                      onChange={(e) => setSelectedCompanyId(e.target.value)}
                      className="w-full h-12 px-4 bg-white border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
                    >
                      <option value="" disabled hidden>-- Pilih Perusahaan --</option>
                      {companyList.map(comp => (
                        <option key={comp.id} value={comp.id}>{comp.name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">
                          Nama Perusahaan <span className="text-rose-500">*</span>
                        </label>
                        <input
                          required={currentStep === 1 && isNewCompany}
                          name="newCompanyName"
                          type="text"
                          placeholder="Cth: PT. Timika Jaya"
                          className="w-full h-12 px-4 bg-white border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">
                          Alamat Perusahaan <span className="text-rose-500">*</span>
                        </label>
                        <input
                          required={currentStep === 1 && isNewCompany}
                          name="newCompanyLocation"
                          type="text"
                          placeholder="Cth: Timika, Papua Tengah"
                          className="w-full h-12 px-4 bg-white border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 justify-between flex items-center">
                        <span>Deskripsi Perusahaan</span>
                        <span className="text-[10px] text-slate-400 font-normal">Opsional</span>
                      </label>
                      <textarea
                        name="newCompanyDesc"
                        rows={3}
                        placeholder="Profil singkat atau bidang industri perusahaan..."
                        className="w-full p-4 bg-white border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* STEP 2: Informasi Pekerjaan */}
        <div className={currentStep === 2 ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Briefcase className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Detail Pekerjaan</h2>
                <p className="text-xs text-slate-500 font-medium">Informasi utama mengenai posisi yang dibuka</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Posisi Pekerjaan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Posisi Pekerjaan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      required={currentStep === 2}
                      name="title"
                      type="text"
                      placeholder="Cth: Mekanik Alat Berat"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Kategori */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required={currentStep === 2}
                      name="category"
                      defaultValue=""
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled hidden>Pilih Kategori</option>
                      <option value="Teknik & Engineering">Teknik & Engineering</option>
                      <option value="Operasional">Operasional</option>
                      <option value="Admin & HR">Admin & HR</option>
                      <option value="IT & Software">IT & Software</option>
                      <option value="F&B">F&B / Restoran</option>
                      <option value="Logistik">Logistik & Gudang</option>
                      <option value="Pelayanan">Pelayanan / Hospitality</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Lokasi Penempatan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Lokasi Penempatan (Kerja) <span className="text-rose-500">*</span>
                </label>
                <input
                  required={currentStep === 2}
                  name="location"
                  type="text"
                  placeholder="Cth: Kuala Kencana, Timika"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Kisaran Gaji */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 justify-between flex items-center">
                    <span>Gaji Minimal</span>
                    <span className="text-[10px] text-slate-400 font-normal">Opsional</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-xs font-bold text-slate-400 pointer-events-none">Rp</span>
                    <input type="hidden" name="salaryMin" value={salaryMinDisplay.replace(/\D/g, "")} />
                    <input
                      type="text"
                      value={salaryMinDisplay}
                      onChange={handleSalaryMinChange}
                      placeholder="5.000.000"
                      className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 justify-between flex items-center">
                    <span>Gaji Maksimal</span>
                    <span className="text-[10px] text-slate-400 font-normal">Opsional</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-xs font-bold text-slate-400 pointer-events-none">Rp</span>
                    <input type="hidden" name="salaryMax" value={salaryMaxDisplay.replace(/\D/g, "")} />
                    <input
                      type="text"
                      value={salaryMaxDisplay}
                      onChange={handleSalaryMaxChange}
                      placeholder="8.000.000"
                      className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Poster Upload */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Poster / Banner Lowongan</span>
                  <span className="text-[10px] text-slate-400 font-normal">Opsional</span>
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="flex items-center justify-center h-12 px-5 border border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all cursor-pointer group shrink-0">
                    <UploadCloud className="w-4 h-4 mr-2 text-slate-400 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold">Pilih File Gambar</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>

                  {imagePreview ? (
                    <div className="relative w-16 h-16 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0">
                      <Image src={imagePreview} alt="Preview" fill sizes="64px" unoptimized className="object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setSelectedImage(null); setImagePreview(null); }}
                        className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-1 hover:bg-rose-600 transition-colors z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Format JPG, PNG, WEBP (Maksimal 5MB)</span>
                  )}
                </div>
              </div>

              {/* Deskripsi Lengkap */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Deskripsi Lengkap <span className="text-rose-500">*</span>
                </label>
                <div className="rounded-2xl overflow-hidden">
                  <RichTextEditor
                    defaultValue={description}
                    onChange={(val) => setDescription(val)}
                    placeholder="Jelaskan peran, tanggung jawab, dan gambaran tugas harian..."
                  />
                </div>
              </div>

              {/* Persyaratan */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Persyaratan (Requirements) <span className="text-rose-500">*</span>
                </label>
                <div className="rounded-2xl overflow-hidden">
                  <RichTextEditor
                    defaultValue={requirements}
                    onChange={(val) => setRequirements(val)}
                    placeholder={"1. Pendidikan minimal...\n2. Memiliki SIM A/C..."}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* STEP 3: Kualifikasi */}
        <div className={currentStep === 3 ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Award className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Kualifikasi Kandidat & Finalisasi</h2>
                <p className="text-xs text-slate-500 font-medium">Kriteria dan preferensi kandidat</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Tipe Kontrak */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Tipe Kontrak <span className="text-rose-500">*</span>
                </label>
                <select
                  required={currentStep === 3}
                  name="type"
                  defaultValue="Full-time"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Magang">Magang</option>
                  <option value="Kontrak">Kontrak</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              {/* Pendidikan Minimal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Pendidikan Minimal</label>
                <select
                  name="education"
                  defaultValue="Semua"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
                >
                  <option value="Semua">Semua Jenjang</option>
                  <option value="SMA/SMK">SMA/SMK</option>
                  <option value="D3">Diploma (D3)</option>
                  <option value="S1">Sarjana (S1)</option>
                </select>
              </div>

              {/* Pengalaman */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Pengalaman Kerja</label>
                <select
                  name="experience"
                  defaultValue="Tanpa Pengalaman"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
                >
                  <option value="Tanpa Pengalaman">Fresh Graduate</option>
                  <option value="1-3 Tahun">1-3 Tahun</option>
                  <option value="3-5 Tahun">3-5 Tahun</option>
                  <option value="> 5 Tahun">Lebih dari 5 Tahun</option>
                </select>
              </div>

              {/* Preferensi Gender */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Preferensi Gender</label>
                <select
                  name="gender"
                  defaultValue="Pria/Wanita"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
                >
                  <option value="Pria/Wanita">Pria / Wanita (Bebas)</option>
                  <option value="Pria">Khusus Pria</option>
                  <option value="Wanita">Khusus Wanita</option>
                </select>
              </div>

              {/* Usia Maksimal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 justify-between flex items-center">
                  <span>Batas Umur Maksimal</span>
                  <span className="text-[10px] text-slate-400 font-normal">Opsional</span>
                </label>
                <input
                  name="ageRange"
                  type="number"
                  min="15"
                  max="100"
                  placeholder="Cth: 35"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Batas Lamaran */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 justify-between flex items-center">
                  <span>Batas Akhir Lamaran</span>
                  <span className="text-[10px] text-slate-400 font-normal">Opsional</span>
                </label>
                <input
                  name="deadline"
                  type="date"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="bg-slate-50 p-4 border border-slate-200/80 rounded-2xl flex items-start gap-3 mt-8">
              <input 
                type="checkbox" 
                id="terms" 
                name="terms" 
                required={currentStep === 3}
                className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
              />
              <label htmlFor="terms" className="text-xs font-medium text-slate-600 leading-relaxed cursor-pointer select-none">
                Saya telah membaca dan menyetujui <Link href="/ketentuan-pasang-loker" target="_blank" className="text-slate-900 font-bold underline hover:text-primary">Panduan & Ketentuan Pasang Lowongan</Link>. Informasi yang diisi adalah benar dan tidak mengandung penipuan.
              </label>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 sm:sticky sm:bottom-6 z-50 bg-white/90 backdrop-blur-md border-t border-slate-200/80 sm:border sm:rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg">
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">
            Langkah {currentStep} dari {totalSteps}
          </span>
          <div className="flex gap-2.5 w-full sm:w-auto">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 h-11 rounded-2xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 transition-all flex-1 sm:flex-none flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-5 h-11 rounded-2xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200/80 transition-all flex-1 sm:flex-none cursor-pointer"
              >
                Batal
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-7 h-11 rounded-2xl text-xs font-bold text-white bg-primary hover:bg-primary/90 shadow-2xs hover:shadow transition-all flex-1 sm:flex-none flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 h-11 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs hover:shadow transition-all flex-1 sm:flex-none flex items-center justify-center gap-1.5 disabled:opacity-70 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? "Memproses..." : "Kirim Lowongan"}</span>
              </button>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
