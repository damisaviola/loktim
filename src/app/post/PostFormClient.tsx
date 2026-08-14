"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2, UploadCloud, Info, Sparkles, X, Copy, ChevronRight, ChevronLeft, AlertCircle
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { createJobAction, getCompaniesByEmailAction, validateJobStepAction } from "@/app/actions/job";
import imageCompression from "browser-image-compression";
import { createClient } from "@/utils/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { toast } from "sonner";

const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-44 bg-slate-50 border border-slate-200 rounded-lg animate-pulse" />
});

const inputClass =
  "w-full h-11 px-3.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-colors";
const selectClass = `${inputClass} cursor-pointer`;
const labelClass = "block text-sm font-medium text-slate-700";

export default function PostFormClient() {
  const formRef = useRef<HTMLFormElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
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

  const handleNext = async () => {
    if (isValidating || !formRef.current) return;

    const formData = new FormData(formRef.current);
    formData.append("description", description);
    formData.append("requirements", requirements);
    formData.append("isNewCompany", isNewCompany.toString());

    setIsValidating(true);
    try {
      const result = await validateJobStepAction(currentStep, formData);
      if (!result.success) {
        setValidationErrors(result.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsValidating(false);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Jika belum di step terakhir, jadikan tombol Enter sebagai fungsi Next
    if (currentStep < totalSteps) {
      await handleNext();
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
        const errors = result.errors && result.errors.length > 0
          ? result.errors
          : [result.error || "Terjadi kesalahan saat mengirim lowongan."];
        setValidationErrors(errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 mb-24 sm:mb-12">

      {/* Dialog Success */}
      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent className="sm:max-w-md rounded-xl p-6">
          <DialogHeader className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">Lowongan Berhasil Dikirim</DialogTitle>
            <DialogDescription className="text-sm text-slate-500 leading-relaxed mt-1">
              Lowongan Anda sedang dalam antrean review tim kami (maksimal 1x24 jam).<br/>
              Simpan link di bawah ini untuk melihat status atau mengubah lowongan.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <p className="text-xs font-mono text-slate-600 truncate flex-1" title={magicLink}>
              {magicLink}
            </p>
            <button
              type="button"
              onClick={copyToClipboard}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
              title="Salin Link"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button type="button" variant="outline" className="w-full sm:w-auto font-semibold text-sm h-11 rounded-lg" onClick={copyToClipboard}>
              Salin Link
            </Button>
            <Link href={`/manage/${createdJobId}`} className="w-full sm:w-auto">
              <Button type="button" className="w-full font-semibold text-sm h-11 rounded-lg bg-primary text-white">
                Buka Status Lowongan
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Validasi */}
      <Dialog open={validationErrors.length > 0} onOpenChange={(open) => !open && setValidationErrors([])}>
        <DialogContent className="sm:max-w-sm rounded-xl p-6">
          <DialogHeader className="flex flex-col items-center text-center space-y-2.5">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-900">Periksa Kembali Formulir</DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1">
                Beberapa isian belum sesuai. Silakan perbaiki lalu kirim ulang.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="mt-2 space-y-1.5">
            {validationErrors.map((err, index) => (
              <div key={index} className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <p className="text-xs text-slate-600 leading-relaxed">{err}</p>
              </div>
            ))}
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              onClick={() => setValidationErrors([])}
              className="w-full h-11 rounded-lg font-semibold bg-slate-900 hover:bg-slate-800 text-white"
            >
              Mengerti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gratis 100% Tanpa Biaya</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Pasang Lowongan Kerja Baru
        </h1>
        <p className="text-sm text-slate-500">
          Lengkapi formulir berikut untuk menjangkau ribuan pencari kerja potensial di Mimika.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center bg-white border border-slate-200/70 rounded-xl px-6 py-4">
        {[
          { step: 1, title: "Perusahaan" },
          { step: 2, title: "Pekerjaan" },
          { step: 3, title: "Kualifikasi" },
        ].map((item, index) => {
          const isActive = currentStep === item.step;
          const isCompleted = currentStep > item.step;

          return (
            <Fragment key={item.step}>
              {index > 0 && (
                <div className="flex-1 h-px bg-slate-200 mx-3 sm:mx-4">
                  <div className={`h-full bg-primary transition-all duration-500 ${isCompleted ? 'w-full' : 'w-0'}`}></div>
                </div>
              )}
              <div className={`flex flex-col items-center gap-1.5 ${isActive ? '' : isCompleted ? 'opacity-70' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 transition-colors ${isActive ? 'bg-primary text-white' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                </div>
                <span className={`text-[11px] font-medium whitespace-nowrap transition-all ${isActive ? 'text-slate-900' : 'hidden sm:block text-slate-400'}`}>
                  {item.title}
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>

      {/* Information Banner (Show only on step 1) */}
      {currentStep === 1 && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-900 leading-relaxed">
            <span className="font-semibold">Pengecekan Data Perusahaan: </span>
            Ketik Email Anda terlebih dahulu. Jika perusahaan Anda sudah terdaftar di sistem kami, form akan terisi otomatis sehingga Anda tidak perlu mengetik ulang profil perusahaan.
          </p>
        </div>
      )}

      {/* Main Form */}
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">

        {/* STEP 1: Perusahaan & Kontak */}
        <div className={currentStep === 1 ? "block" : "hidden"}>
          <div className="bg-white border border-slate-200/70 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Perusahaan & Kontak</h2>
              <p className="text-xs text-slate-500 mt-0.5">Identitas instansi dan saluran pengiriman lamaran</p>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className={`${labelClass}`}>
                Email Perekrut / HRD <span className="text-rose-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hrd@perusahaan.com"
                className={inputClass}
              />
              <p className="text-[11px] text-slate-400 pt-0.5">
                {email.length === 0 ? "Ketik email Anda untuk mendeteksi profil perusahaan." :
                 companyList.length > 0 ? "Perusahaan terdaftar ditemukan untuk email ini." :
                 debouncedEmail.includes("@") ? "Email baru. Silakan isi data perusahaan baru di bawah." : ""}
              </p>
            </div>

            {/* Kontak Tambahan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className={`${labelClass} justify-between flex items-center`}>
                  <span>Nomor WhatsApp</span>
                  <span className="text-[11px] text-slate-400 font-normal">Opsional</span>
                </label>
                <input
                  name="whatsapp"
                  type="tel"
                  placeholder="081234567890"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`${labelClass} justify-between flex items-center`}>
                  <span>Link Google Form / Aplikasi</span>
                  <span className="text-[11px] text-slate-400 font-normal">Opsional</span>
                </label>
                <input
                  name="applicationLink"
                  type="url"
                  placeholder="https://forms.gle/..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* Switch Perusahaan */}
            {companyList.length > 0 && (
              <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => { setIsNewCompany(false); setSelectedCompanyId(companyList[0]?.id || ""); }}
                  className={`flex-1 py-2 px-4 rounded-md text-xs font-semibold transition-all ${!isNewCompany ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                >
                  Gunakan Data Terdaftar
                </button>
                <button
                  type="button"
                  onClick={() => { setIsNewCompany(true); setSelectedCompanyId(""); }}
                  className={`flex-1 py-2 px-4 rounded-md text-xs font-semibold transition-all ${isNewCompany ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                >
                  Buat Data Baru
                </button>
              </div>
            )}

            {/* Container Profil Perusahaan */}
            {!isNewCompany ? (
              <div className="space-y-1.5">
                <label className={labelClass}>Pilih Perusahaan Terdaftar</label>
                <select
                  name="companyId"
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled hidden>-- Pilih Perusahaan --</option>
                  {companyList.map(comp => (
                    <option key={comp.id} value={comp.id}>{comp.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className={labelClass}>
                      Nama Perusahaan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="newCompanyName"
                      type="text"
                      placeholder="Cth: PT. Timika Jaya"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>
                      Alamat Perusahaan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="newCompanyLocation"
                      type="text"
                      placeholder="Cth: Timika, Papua Tengah"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Deskripsi Perusahaan <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="newCompanyDesc"
                    rows={3}
                    placeholder="Profil singkat atau bidang industri perusahaan (minimal 30 karakter)..."
                    className={`${inputClass} h-auto py-3 resize-none`}
                  />
                  <p className="text-[11px] text-slate-400 pt-0.5">Minimal 30 karakter.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STEP 2: Informasi Pekerjaan */}
        <div className={currentStep === 2 ? "block" : "hidden"}>
          <div className="bg-white border border-slate-200/70 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Detail Pekerjaan</h2>
              <p className="text-xs text-slate-500 mt-0.5">Informasi utama mengenai posisi yang dibuka</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Posisi Pekerjaan */}
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Posisi Pekerjaan <span className="text-rose-500">*</span>
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="Cth: Mekanik Alat Berat"
                  className={inputClass}
                />
              </div>

              {/* Kategori */}
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Kategori <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  defaultValue=""
                  className={`${selectClass} appearance-none`}
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

            {/* Lokasi Penempatan */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                Lokasi Penempatan (Kerja) <span className="text-rose-500">*</span>
              </label>
              <input
                name="location"
                  type="text"
                placeholder="Cth: Kuala Kencana, Timika"
                className={inputClass}
              />
            </div>

            {/* Kisaran Gaji */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className={`${labelClass} justify-between flex items-center`}>
                  <span>Gaji Minimal</span>
                  <span className="text-[11px] text-slate-400 font-normal">Opsional</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-semibold text-slate-400 pointer-events-none">Rp</span>
                  <input type="hidden" name="salaryMin" value={salaryMinDisplay.replace(/\D/g, "")} />
                  <input
                    type="text"
                    value={salaryMinDisplay}
                    onChange={handleSalaryMinChange}
                    placeholder="5.000.000"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`${labelClass} justify-between flex items-center`}>
                  <span>Gaji Maksimal</span>
                  <span className="text-[11px] text-slate-400 font-normal">Opsional</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-semibold text-slate-400 pointer-events-none">Rp</span>
                  <input type="hidden" name="salaryMax" value={salaryMaxDisplay.replace(/\D/g, "")} />
                  <input
                    type="text"
                    value={salaryMaxDisplay}
                    onChange={handleSalaryMaxChange}
                    placeholder="8.000.000"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
            </div>

            {/* Poster Upload */}
            <div className="space-y-1.5">
              <label className={`${labelClass} flex items-center justify-between`}>
                <span>Poster / Banner Lowongan</span>
                <span className="text-[11px] text-slate-400 font-normal">Opsional</span>
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label className="flex items-center justify-center h-11 px-4 border border-dashed border-slate-300 rounded-lg bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer group shrink-0">
                  <UploadCloud className="w-4 h-4 mr-2 text-slate-400 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-semibold">Pilih File Gambar</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>

                {imagePreview ? (
                  <div className="relative w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-white shrink-0">
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
                  <span className="text-[11px] text-slate-400">Format JPG, PNG, WEBP (Maksimal 5MB)</span>
                )}
              </div>
            </div>

            {/* Deskripsi Lengkap */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                Deskripsi Lengkap <span className="text-rose-500">*</span>
              </label>
              <div className="rounded-lg overflow-hidden">
                <RichTextEditor
                  defaultValue={description}
                  onChange={(val) => setDescription(val)}
                  placeholder="Jelaskan peran, tanggung jawab, dan gambaran tugas harian..."
                />
              </div>
            </div>

            {/* Persyaratan */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                Persyaratan (Requirements) <span className="text-rose-500">*</span>
              </label>
              <div className="rounded-lg overflow-hidden">
                <RichTextEditor
                  defaultValue={requirements}
                  onChange={(val) => setRequirements(val)}
                  placeholder={"1. Pendidikan minimal...\n2. Memiliki SIM A/C..."}
                />
              </div>
            </div>
          </div>
        </div>

        {/* STEP 3: Kualifikasi */}
        <div className={currentStep === 3 ? "block" : "hidden"}>
          <div className="bg-white border border-slate-200/70 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Kualifikasi Kandidat & Finalisasi</h2>
              <p className="text-xs text-slate-500 mt-0.5">Kriteria dan preferensi kandidat</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Tipe Kontrak */}
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Tipe Kontrak <span className="text-rose-500">*</span>
                </label>
                <select
                  name="type"
                  defaultValue="Full-time"
                  className={selectClass}
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
                <label className={labelClass}>Pendidikan Minimal</label>
                <select
                  name="education"
                  defaultValue="Semua"
                  className={selectClass}
                >
                  <option value="Semua">Semua Jenjang</option>
                  <option value="SMA/SMK">SMA/SMK</option>
                  <option value="D3">Diploma (D3)</option>
                  <option value="S1">Sarjana (S1)</option>
                </select>
              </div>

              {/* Pengalaman */}
              <div className="space-y-1.5">
                <label className={labelClass}>Pengalaman Kerja</label>
                <select
                  name="experience"
                  defaultValue="Tanpa Pengalaman"
                  className={selectClass}
                >
                  <option value="Tanpa Pengalaman">Fresh Graduate</option>
                  <option value="1-3 Tahun">1-3 Tahun</option>
                  <option value="3-5 Tahun">3-5 Tahun</option>
                  <option value="> 5 Tahun">Lebih dari 5 Tahun</option>
                </select>
              </div>

              {/* Preferensi Gender */}
              <div className="space-y-1.5">
                <label className={labelClass}>Preferensi Gender</label>
                <select
                  name="gender"
                  defaultValue="Pria/Wanita"
                  className={selectClass}
                >
                  <option value="Pria/Wanita">Pria / Wanita (Bebas)</option>
                  <option value="Pria">Khusus Pria</option>
                  <option value="Wanita">Khusus Wanita</option>
                </select>
              </div>

              {/* Usia Maksimal */}
              <div className="space-y-1.5">
                <label className={`${labelClass} justify-between flex items-center`}>
                  <span>Batas Umur Maksimal</span>
                  <span className="text-[11px] text-slate-400 font-normal">Opsional</span>
                </label>
                <input
                  name="ageRange"
                  type="number"
                  min="15"
                  max="100"
                  placeholder="Cth: 35"
                  className={inputClass}
                />
              </div>

              {/* Batas Lamaran */}
              <div className="space-y-1.5">
                <label className={`${labelClass} justify-between flex items-center`}>
                  <span>Batas Akhir Lamaran</span>
                  <span className="text-[11px] text-slate-400 font-normal">Opsional</span>
                </label>
                <input
                  name="deadline"
                  type="date"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2.5 border border-slate-200 bg-slate-50/50 rounded-lg px-4 py-3.5">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
                Saya telah membaca dan menyetujui <Link href="/ketentuan-pasang-loker" target="_blank" className="text-slate-900 font-semibold underline hover:text-primary">Panduan & Ketentuan Pasang Lowongan</Link>. Informasi yang diisi adalah benar dan tidak mengandung penipuan.
              </label>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 sm:sticky sm:bottom-6 z-40 bg-white/90 backdrop-blur-md border-t sm:border sm:border-slate-200/70 sm:rounded-xl p-4 flex items-center justify-between gap-3 shadow-sm">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Langkah {currentStep} dari {totalSteps}
          </span>
          <div className="flex gap-2.5 w-full sm:w-auto">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 h-11 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex-1 sm:flex-none flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-5 h-11 rounded-lg text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex-1 sm:flex-none cursor-pointer"
              >
                Batal
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isValidating}
                className="px-7 h-11 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors flex-1 sm:flex-none flex items-center justify-center gap-1.5 disabled:opacity-70 cursor-pointer"
              >
                <span>{isValidating ? "Memeriksa..." : "Selanjutnya"}</span>
                {!isValidating && <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 h-11 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex-1 sm:flex-none flex items-center justify-center gap-1.5 disabled:opacity-70 cursor-pointer"
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