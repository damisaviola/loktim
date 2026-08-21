"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  Info,
  Sparkles,
  Copy,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Building2,
  MapPin,
  Briefcase,
  ShieldCheck,
  BadgeCheck,
  Users,
  GraduationCap,
  Check,
  ArrowRight,
  UserCheck,
  HelpCircle,
  Banknote,
  Clock,
  ExternalLink,
  Store,
  Upload,
  X,
  ImageIcon,
  Loader2
} from "lucide-react";
import dynamic from "next/dynamic";
import {
  createJobAction,
  getCompaniesByEmailAction,
  validateJobStepAction,
} from "@/app/actions/job";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { toast } from "sonner";

const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-44 bg-slate-50 border border-slate-200 rounded-xl animate-pulse flex items-center justify-center text-xs text-slate-400 font-medium">
      Memuat editor teks...
    </div>
  ),
});

const inputClass =
  "w-full h-12 px-4 bg-white border border-slate-200/90 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all";
const selectClass = `${inputClass} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:9px_9px] bg-[right_1rem_center] bg-no-repeat pr-9`;
const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono";

const JOB_TITLE_SUGGESTIONS = [
  "Mekanik Alat Berat",
  "Driver LV / Bus",
  "Staff Admin Gudang",
  "Kasir / Pramuniaga Toko",
  "Barista / Service Kafe",
  "Operator Excavator",
  "Safety Officer (HSE)",
  "Staff Finance & HRD",
];


const LOCATION_SUGGESTIONS = [
  "Kuala Kencana",
  "Tembagapura",
  "Timika Kota",
  "Portsite",
  "Bandara Mozes Kilangin",
  "SP 2 / SP 3 Mimika",
  "Mile 38",
];

interface PostFormClientProps {
  initialEmail?: string | null;
  initialCompany?: {
    id: string;
    name: string;
    location: string;
    logoUrl: string | null;
    about: string | null;
    email?: string | null;
  } | null;
}

export default function PostFormClient({
  initialEmail = null,
  initialCompany = null,
}: PostFormClientProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);

  // Company State
  const [isNewCompany, setIsNewCompany] = useState(!initialCompany);
  const [companyList, setCompanyList] = useState<{ id: string; name: string }[]>(
    initialCompany ? [{ id: initialCompany.id, name: initialCompany.name }] : []
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    initialCompany?.id || ""
  );

  // Form Field States
  const [email, setEmail] = useState(initialEmail || initialCompany?.email || "");
  const [debouncedEmail, setDebouncedEmail] = useState(initialEmail || initialCompany?.email || "");
  const [isSearchingCompany, setIsSearchingCompany] = useState(false);

  const [picName, setPicName] = useState("");

  const [newCompanyName, setNewCompanyName] = useState(initialCompany?.name || "");
  const [newCompanyLocation, setNewCompanyLocation] = useState(initialCompany?.location || "");
  const [newCompanyDesc, setNewCompanyDesc] = useState(initialCompany?.about || "");

  // Logo Upload State
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialCompany?.logoUrl || null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(initialCompany?.logoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validasi tipe file
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error('Format gambar harus JPG, PNG, WEBP, atau SVG.');
        return;
      }

      // Validasi ukuran awal (Maksimal 2 MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file logo maksimal 2 MB.');
        return;
      }

      // Set preview instan
      const objectUrl = URL.createObjectURL(file);
      setLogoFile(file);
      setLogoPreview(objectUrl);

      // Kompresi otomatis & upload ke Supabase Storage
      setIsUploadingLogo(true);
      try {
        const options = {
          maxSizeMB: 0.15, // Kompresi ekstra hemat (~50KB - 150KB)
          maxWidthOrHeight: 500,
          useWebWorker: true,
          fileType: 'image/webp' as const,
        };

        let uploadPayload: Blob = file;
        if (file.type !== 'image/svg+xml') {
          uploadPayload = await imageCompression(file, options);
        }

        const supabase = createClient();
        const fileExt = file.type === 'image/svg+xml' ? 'svg' : 'webp';
        const fileName = `logos/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, uploadPayload, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          toast.error('Gagal mengunggah logo ke penyimpanan. Anda tetap dapat melanjutkan.');
        } else if (uploadData) {
          const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
          setUploadedImageUrl(publicUrl);
          toast.success('Logo berhasil diunggah & dioptimalkan!');
        }
      } catch (err) {
        console.error('Compression error:', err);
      } finally {
        setIsUploadingLogo(false);
      }
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setUploadedImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("Timika, Papua Tengah");
  const [contractType, setContractType] = useState("Full-time");
  const [education, setEducation] = useState("Semua");
  const [experience, setExperience] = useState("Tanpa Pengalaman");
  const [gender, setGender] = useState("Pria/Wanita");
  const [ageRange, setAgeRange] = useState("");
  const [deadline, setDeadline] = useState("");

  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

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

  // Debounce email
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEmail(email);
    }, 500);
    return () => clearTimeout(handler);
  }, [email]);

  // Company Lookup by Email
  useEffect(() => {
    if (initialCompany) return;

    const lookup = async () => {
      if (debouncedEmail && debouncedEmail.includes("@")) {
        setIsSearchingCompany(true);
        try {
          const list = await getCompaniesByEmailAction(debouncedEmail);
          return list;
        } finally {
          setIsSearchingCompany(false);
        }
      }
      return [];
    };

    lookup().then((list) => {
      setCompanyList(list);
      if (list.length > 0) {
        setIsNewCompany(false);
        setSelectedCompanyId(list[0].id);
      } else {
        setIsNewCompany(true);
        setSelectedCompanyId("");
      }
    });
  }, [debouncedEmail, initialCompany]);

  const handleQuickDeadline = (days: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
    const dd = String(targetDate.getDate()).padStart(2, "0");
    setDeadline(`${yyyy}-${mm}-${dd}`);
  };

  const handleNext = async () => {
    if (isValidating || !formRef.current) return;

    const formData = new FormData(formRef.current);
    formData.append("description", description);
    formData.append("requirements", requirements);
    formData.append("isNewCompany", isNewCompany.toString());
    if (uploadedImageUrl) {
      formData.set("imageUrl", uploadedImageUrl);
    }

    setIsValidating(true);
    try {
      const result = await validateJobStepAction(currentStep, formData);
      if (!result.success) {
        setValidationErrors(result.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setValidationErrors([]);
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsValidating(false);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentStep < totalSteps) {
      await handleNext();
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      formData.append("description", description);
      formData.append("requirements", requirements);
      formData.append("isNewCompany", isNewCompany.toString());
      if (uploadedImageUrl) {
        formData.set("imageUrl", uploadedImageUrl);
      }

      const result = await createJobAction(formData);

      setIsSubmitting(false);
      if (result.success) {
        setCreatedJobId(result.jobId || null);
        setSuccess(true);
        toast.success("Lowongan kerja berhasil dikirim!");
      } else {
        const errors =
          result.errors && result.errors.length > 0
            ? result.errors
            : [result.error || "Terjadi kesalahan saat mengirim formulir lowongan."];
        setValidationErrors(errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      toast.error("Terjadi kendala sistem. Silakan coba lagi.");
    }
  };

  const magicLink =
    createdJobId && typeof window !== "undefined"
      ? `${window.location.origin}/manage/${createdJobId}`
      : "";

  const copyToClipboard = () => {
    if (magicLink) {
      navigator.clipboard.writeText(magicLink);
      toast.success("Link kelola lowongan berhasil disalin!");
    }
  };

  // Preview Company Name
  const displayCompanyName = !isNewCompany
    ? companyList.find((c) => c.id === selectedCompanyId)?.name ||
      initialCompany?.name ||
      "Perusahaan Terdaftar"
    : newCompanyName || "Nama Perusahaan Anda";

  const displaySalary =
    salaryMinDisplay && salaryMaxDisplay
      ? `Rp ${salaryMinDisplay} - ${salaryMaxDisplay} / bln`
      : salaryMinDisplay
      ? `Mulai Rp ${salaryMinDisplay} / bln`
      : null;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-32 sm:pb-24">
      
      {/* 1. HERO HEADER BANNER */}
      <div className="relative overflow-hidden bg-slate-900 pt-10 pb-16 sm:py-16 text-white shadow-xs">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-[-2rem] h-80 w-80 rounded-full bg-primary/30 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-3.5">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Pasang Lowongan Kerja Baru
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
            Iklankan lowongan kerja perusahaan, bisnis lokal, UMKM, toko, kafe, hingga kontraktor Anda ke ribuan pencari kerja aktif di wilayah Timika, Kuala Kencana, Tembagapura, &amp; sekitarnya.
          </p>
        </div>
      </div>

      {/* 2. MAIN CONTAINER & STEPPER */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 -mt-7 relative z-20 space-y-6">
        
        {/* Stepper Progress Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            {[
              { step: 1, title: "1. Profil Usaha / UMKM", desc: "Data instansi & penanggung jawab" },
              { step: 2, title: "2. Detail Lowongan", desc: "Posisi & deskripsi tugas" },
              { step: 3, title: "3. Kualifikasi & Final", desc: "Kriteria & review publikasi" },
            ].map((item, index) => {
              const isActive = currentStep === item.step;
              const isCompleted = currentStep > item.step;

              return (
                <Fragment key={item.step}>
                  {index > 0 && (
                    <div className="flex-1 h-0.5 bg-slate-200 mx-2 sm:mx-4 relative overflow-hidden">
                      <div
                        className={`h-full bg-primary transition-all duration-500 ${
                          isCompleted ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (isCompleted) setCurrentStep(item.step);
                    }}
                    disabled={!isCompleted}
                    className={`flex items-center gap-2.5 text-left transition-all ${
                      isActive
                        ? "text-primary font-bold"
                        : isCompleted
                        ? "text-slate-800 font-semibold cursor-pointer hover:opacity-80"
                        : "text-slate-400 font-medium cursor-not-allowed"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        isActive
                          ? "bg-primary text-white shadow-xs ring-2 ring-primary/20"
                          : isCompleted
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : item.step}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-xs leading-none">{item.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-normal font-mono">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                </Fragment>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 sm:hidden">
            <span className="font-semibold text-slate-800">
              Langkah {currentStep} dari {totalSteps}:{" "}
              {currentStep === 1
                ? "Profil Usaha & Penanggung Jawab"
                : currentStep === 2
                ? "Detail Lowongan"
                : "Kualifikasi & Review"}
            </span>
            <span className="font-bold text-primary">
              {Math.round((currentStep / totalSteps) * 100)}% Selesai
            </span>
          </div>
        </div>

        {/* LOGGED IN BADGE (If available) */}
        {initialCompany && (
          <div className="flex items-center justify-between gap-3 bg-sky-50 border border-sky-200/80 rounded-xl px-4 py-3 text-sky-900">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="truncate text-xs sm:text-sm">
                Terhubung sebagai{" "}
                <span className="font-bold text-sky-950">{initialCompany.name}</span>{" "}
                ({initialEmail})
              </div>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-sky-700 hover:text-sky-900 shrink-0 inline-flex items-center gap-1"
            >
              Dasbor <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* VALIDATION ERROR ALERT */}
        {validationErrors.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 space-y-2 animate-in fade-in-50 duration-200">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Harap lengkapi kolom berikut sebelum melanjutkan:</span>
            </div>
            <ul className="pl-6 list-disc space-y-1 text-xs text-rose-700 font-medium">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. MAIN FORM BODY */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6"
        >
          <input type="hidden" name="imageUrl" value={uploadedImageUrl || ""} />
          {/* ================= STEP 1: PROFIL PERUSAHAAN / UMKM & PENANGGUNG JAWAB ================= */}
          <div className={currentStep === 1 ? "block space-y-6 animate-fade-in" : "hidden"}>
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider font-mono">
                  <Building2 className="w-4 h-4" />
                  <span>Identitas Perusahaan, UMKM &amp; Kontak</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  Profil Usaha, UMKM &amp; Penanggung Jawab
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Informasi ini digunakan kandidat dan tim kurasi untuk mengenali identitas perusahaan, UMKM, toko, atau usaha lokal serta kontak resmi perekrut.
                </p>
              </div>

              {/* Special UMKM Friendly Callout Banner */}
              <div className="flex items-start gap-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4 text-xs text-slate-700">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">
                    Punya Usaha Toko, Kafe, Bengkel, atau UMKM di Timika?
                  </span>
                  <p className="leading-relaxed text-slate-600 text-[11px]">
                    LokerTimika mendukung penuh para pelaku <strong>UMKM &amp; bisnis lokal</strong> untuk mempublikasikan lowongan kerja karyawan (kasir, barista, kurir, pramuniaga, staf admin, dll) secara <strong>100% gratis</strong>.
                  </p>
                </div>
              </div>

              {/* Email & Penanggung Jawab Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Email Perusahaan / Usaha / UMKM <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh: hrd@perusahaan.com / usaha@gmail.com"
                      className={`${inputClass} pr-10`}
                    />
                    {isSearchingCompany && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] pt-0.5">
                    {email.length === 0 ? (
                      <p className="text-slate-400">
                        Ketik email perusahaan/usaha untuk mendeteksi profil otomatis.
                      </p>
                    ) : companyList.length > 0 ? (
                      <p className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Terdaftar: {companyList[0]?.name}
                      </p>
                    ) : debouncedEmail.includes("@") ? (
                      <p className="text-slate-600 inline-flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-primary" />
                        Email baru (akan dibuatkan profil instansi/usaha baru).
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Nama Penanggung Jawab */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>
                      Nama Penanggung Jawab / Pemilik
                    </label>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-mono">
                      <UserCheck className="w-3 h-3 text-sky-600" />
                      Pemilik / HRD
                    </span>
                  </div>
                  <input
                    name="picName"
                    type="text"
                    value={picName}
                    onChange={(e) => setPicName(e.target.value)}
                    placeholder="Cth: Hendra Wijaya (Pemilik / HRD)"
                    className={inputClass}
                  />
                  <p className="text-[11px] text-slate-400">
                    Nama pemilik usaha, pengelola toko/UMKM, atau staf HRD yang bertanggung jawab.
                  </p>
                </div>
              </div>

              {/* Explainer Box: Mengapa Nama Penanggung Jawab Diperlukan? */}
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200/80 p-4 text-xs text-slate-700">
                <HelpCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">
                    Mengapa Nama Penanggung Jawab Diperlukan?
                  </span>
                  <p className="leading-relaxed text-slate-600 text-[11px]">
                    Nama penanggung jawab adalah nama pemilik usaha, pengelola toko, atau staf HRD yang mempublikasikan lowongan. Hal ini bertujuan untuk mempermudah verifikasi dan memberi rasa aman bagi para pencari kerja di Timika.
                  </p>
                </div>
              </div>


              {/* Company Details */}
              {!isNewCompany ? (
                <div className="space-y-1.5">
                  <label className={labelClass}>Pilih Profil Perusahaan / Usaha Terdaftar</label>
                  <select
                    name="companyId"
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className={selectClass}
                  >
                    <option value="" disabled hidden>
                      -- Pilih Profil --
                    </option>
                    {companyList.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-4 rounded-xl bg-slate-50/70 p-4 sm:p-5 border border-slate-200/80">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={labelClass}>
                        Nama Perusahaan / Usaha / UMKM <span className="text-rose-500">*</span>
                      </label>
                      <input
                        name="newCompanyName"
                        type="text"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        placeholder="Cth: PT Freeport Contractor / Kafe Kopi Mimika / Toko Berkah"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>
                        Alamat Kantor / Toko / Lokasi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        name="newCompanyLocation"
                        type="text"
                        value={newCompanyLocation}
                        onChange={(e) => setNewCompanyLocation(e.target.value)}
                        placeholder="Cth: Jl. Budi Utomo / Kuala Kencana, Timika"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>
                        Deskripsi Profil Perusahaan / Usaha / UMKM{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <span
                        className={`text-[10px] font-semibold font-mono ${
                          newCompanyDesc.length >= 30
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      >
                        {newCompanyDesc.length}/30 min huruf
                      </span>
                    </div>
                    <textarea
                      name="newCompanyDesc"
                      rows={3}
                      value={newCompanyDesc}
                      onChange={(e) => setNewCompanyDesc(e.target.value)}
                      placeholder="Jelaskan bidang usaha, fokus industri, toko/UMKM, atau tempat operasional Anda di wilayah Mimika..."
                      className={`${inputClass} h-auto py-3 resize-none`}
                    />
                  </div>

                  {/* Logo Perusahaan / UMKM */}
                  <div className="space-y-2 pt-3 border-t border-slate-200/70">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>
                        Logo Usaha / Perusahaan (Opsional)
                      </label>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Maks 2 MB
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                      {/* Logo Preview or Placeholder */}
                      <div className="relative w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden group">
                        {logoPreview ? (
                          <>
                            <Image
                              src={logoPreview}
                              alt="Logo Preview"
                              fill
                              sizes="64px"
                              className="object-contain p-1"
                            />
                            {isUploadingLogo && (
                              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center text-white">
                                <Loader2 className="w-5 h-5 animate-spin" />
                              </div>
                            )}
                          </>
                        ) : (
                          <Building2 className="w-7 h-7 text-slate-300" />
                        )}
                      </div>

                      {/* Controls & Description */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/webp, image/svg+xml"
                            onChange={handleLogoSelect}
                            className="hidden"
                            id="company-logo-upload"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingLogo}
                            className="px-3.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {isUploadingLogo ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Mengoptimalkan...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>{logoPreview ? "Ganti Logo" : "Unggah Logo"}</span>
                              </>
                            )}
                          </button>

                          {logoPreview && (
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 leading-snug">
                          Format JPG, PNG, atau WEBP. Gambar otomatis dikompresi menjadi WebP ringan (&lt;150 KB) agar hemat ruang penyimpanan dan cepat dimuat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {/* Recruiter Channels */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Saluran Penerimaan Lamaran (Opsi Kontak Tambahan)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tentukan kemana kandidat dapat mengirimkan berkas lamaran mereka.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>Nomor WhatsApp HRD</label>
                      <span className="text-[10px] text-slate-400 font-mono">Opsional</span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs font-bold text-slate-500 pointer-events-none">
                        +62
                      </span>
                      <input
                        name="whatsapp"
                        type="tel"
                        placeholder="81234567890"
                        className={`${inputClass} pl-12`}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Kandidat dapat langsung mengirim chat lamaran via tombol 1-klik.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>Link Form / Portal Karir</label>
                      <span className="text-[10px] text-slate-400 font-mono">Opsional</span>
                    </div>
                    <input
                      name="applicationLink"
                      type="url"
                      placeholder="https://forms.gle/xyz atau link website karir"
                      className={inputClass}
                    />
                    <p className="text-[10px] text-slate-400">
                      Jika Anda menggunakan Google Form atau portal karir sendiri.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= STEP 2: DETAIL LOWONGAN ================= */}
          <div className={currentStep === 2 ? "block space-y-6 animate-fade-in" : "hidden"}>
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider font-mono">
                  <Briefcase className="w-4 h-4" />
                  <span>Rincian Pekerjaan</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  Spesifikasi &amp; Deskripsi Tugas
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tuliskan nama posisi yang jelas agar mudah ditemukan pencari kerja di pencarian.
                </p>
              </div>

              {/* Job Title & Category */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Posisi Pekerjaan (Job Title) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Heavy Equipment Mechanic / Mekanik Dump Truck"
                    className={inputClass}
                  />

                  {/* Suggestion Chips */}
                  <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1">
                      Saran populer:
                    </span>
                    {JOB_TITLE_SUGGESTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setTitle(item)}
                        className="text-[11px] bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelClass}>
                      Kategori Bidang <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={selectClass}
                    >
                      <option value="" disabled hidden>
                        -- Pilih Kategori --
                      </option>
                      <option value="Pertambangan">Pertambangan &amp; Energi</option>
                      <option value="Teknik & Engineering">Teknik &amp; Engineering</option>
                      <option value="Operasional">Operasional &amp; Lapangan</option>
                      <option value="Logistik">Logistik, Gudang &amp; Supir</option>
                      <option value="Admin & HR">Admin, Keuangan &amp; HRD</option>
                      <option value="IT & Software">IT, Jaringan &amp; Software</option>
                      <option value="Pelayanan">Pelayanan, Hospitality, Kafe &amp; F&amp;B</option>
                      <option value="Ritel & UMKM">Ritel, Toko, Kasir &amp; UMKM</option>
                      <option value="Kesehatan">Kesehatan &amp; Medis</option>
                      <option value="Keamanan & K3">Keamanan, Security &amp; K3</option>
                      <option value="Lainnya">Kategori Lainnya</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass}>
                      Lokasi Penempatan Kerja <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Cth: Kuala Kencana, Timika"
                      className={inputClass}
                    />

                    {/* Location quick chips */}
                    <div className="pt-1 flex flex-wrap items-center gap-1.5">
                      {LOCATION_SUGGESTIONS.slice(0, 4).map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setLocation(`${loc}, Timika`)}
                          className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Section */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-5 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                    Tawaran Gaji (Take Home Pay)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Menampilkan estimasi gaji menarik hingga 4x lebih banyak pelamar berkualitas.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 font-mono">
                      Gaji Minimal (Rp)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs font-bold text-slate-400 pointer-events-none">
                        Rp
                      </span>
                      <input
                        type="hidden"
                        name="salaryMin"
                        value={salaryMinDisplay.replace(/\D/g, "")}
                      />
                      <input
                        type="text"
                        value={salaryMinDisplay}
                        onChange={handleSalaryMinChange}
                        placeholder="Contoh: 5.000.000"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 font-mono">
                      Gaji Maksimal (Rp)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs font-bold text-slate-400 pointer-events-none">
                        Rp
                      </span>
                      <input
                        type="hidden"
                        name="salaryMax"
                        value={salaryMaxDisplay.replace(/\D/g, "")}
                      />
                      <input
                        type="text"
                        value={salaryMaxDisplay}
                        onChange={handleSalaryMaxChange}
                        placeholder="Contoh: 8.500.000"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  * Biarkan kosong jika nominal gaji dirahasiakan atau dinegosiasikan langsung saat proses seleksi.
                </p>
              </div>

              {/* Rich Text: Job Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>
                    Deskripsi Pekerjaan &amp; Tanggung Jawab{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Gunakan bullet points agar rapi</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <RichTextEditor
                    defaultValue={description}
                    onChange={(val) => setDescription(val)}
                    placeholder="Jelaskan peran kerja, tugas harian, dan lingkungan pekerjaan..."
                  />
                </div>
              </div>

              {/* Rich Text: Requirements */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>
                    Persyaratan &amp; Kualifikasi Khusus{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Contoh: Memiliki SIM B2, Sertifikat K3, dll</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <RichTextEditor
                    defaultValue={requirements}
                    onChange={(val) => setRequirements(val)}
                    placeholder="1. Pendidikan minimal SMA/SMK atau D3&#10;2. Pengalaman minimal 2 tahun di bidang terkait&#10;3. Bersedia ditempatkan di Timika..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= STEP 3: KUALIFIKASI & REVIEW FINAL ================= */}
          <div className={currentStep === 3 ? "block space-y-6 animate-fade-in" : "hidden"}>
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider font-mono">
                  <GraduationCap className="w-4 h-4" />
                  <span>Kriteria Kandidat</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  Kualifikasi &amp; Peninjauan Akhir
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Atur kriteria pelamar dan periksa pratinjau kartu lowongan Anda sebelum dikirimkan ke tim verifikasi.
                </p>
              </div>

              {/* Criteria Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Contract Type */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Tipe Kontrak <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    className={selectClass}
                  >
                    <option value="Full-time">Full-time (Penuh Waktu)</option>
                    <option value="Kontrak">Kontrak (PKWT)</option>
                    <option value="Part-time">Part-time (Paruh Waktu)</option>
                    <option value="Magang">Magang / Internship</option>
                    <option value="Freelance">Freelance / Harian</option>
                  </select>
                </div>

                {/* Min Education */}
                <div className="space-y-1.5">
                  <label className={labelClass}>Pendidikan Minimal</label>
                  <select
                    name="education"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className={selectClass}
                  >
                    <option value="Semua">Semua Jenjang</option>
                    <option value="SMP">SMP / Sederajat</option>
                    <option value="SMA/SMK">SMA / SMK</option>
                    <option value="D3">Diploma (D3)</option>
                    <option value="S1">Sarjana (S1 / D4)</option>
                    <option value="S2">Magister (S2)</option>
                  </select>
                </div>

                {/* Experience */}
                <div className="space-y-1.5">
                  <label className={labelClass}>Pengalaman Kerja</label>
                  <select
                    name="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className={selectClass}
                  >
                    <option value="Tanpa Pengalaman">Fresh Graduate / Pemula</option>
                    <option value="1-3 Tahun">1 - 3 Tahun</option>
                    <option value="3-5 Tahun">3 - 5 Tahun</option>
                    <option value="> 5 Tahun">Lebih dari 5 Tahun (Senior)</option>
                  </select>
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className={labelClass}>Preferensi Gender</label>
                  <select
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={selectClass}
                  >
                    <option value="Pria/Wanita">Pria / Wanita (Terbuka)</option>
                    <option value="Pria">Khusus Pria</option>
                    <option value="Wanita">Khusus Wanita</option>
                  </select>
                </div>

                {/* Max Age */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Batas Umur Maksimal</label>
                    <span className="text-[10px] text-slate-400 font-mono">Opsional</span>
                  </div>
                  <input
                    name="ageRange"
                    type="number"
                    min="17"
                    max="65"
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    placeholder="Contoh: 35"
                    className={inputClass}
                  />
                </div>

                {/* Deadline */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Batas Akhir Lamaran</label>
                    <span className="text-[10px] text-slate-400 font-mono">Opsional</span>
                  </div>
                  <input
                    name="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={inputClass}
                  />
                  {/* Quick Deadline buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleQuickDeadline(7)}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    >
                      +7 Hari
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDeadline(14)}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    >
                      +14 Hari
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDeadline(30)}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    >
                      +30 Hari
                    </button>
                  </div>
                </div>
              </div>

              {/* LIVE PREVIEW MOCKUP */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Pratinjau Tampilan Lowongan di Website
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Tampilan kartu publik untuk pelamar
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                        {logoPreview || uploadedImageUrl ? (
                          <Image
                            src={logoPreview || uploadedImageUrl || ""}
                            alt="Logo Usaha"
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900 text-white flex items-center justify-center font-bold text-base">
                            {displayCompanyName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-500 truncate">
                          {displayCompanyName}
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 truncate">
                          {title || "Judul Posisi Lowongan Kerja"}
                        </h3>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Aktif
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-700 font-medium text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{location || "Timika"}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-700 font-medium text-[11px]">
                      <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{contractType}</span>
                    </span>

                    {education !== 'Semua' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-700 font-medium text-[11px]">
                        <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>Min. {education}</span>
                      </span>
                    )}

                    {displaySalary && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] font-mono border border-emerald-200/70">
                        <Banknote className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{displaySalary}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Anti Fraud & Terms Agreement */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-slate-700 leading-relaxed cursor-pointer select-none"
                  >
                    <span className="font-bold text-slate-900 block mb-0.5">
                      Pernyataan Integritas &amp; Syarat Ketentuan
                    </span>
                    Saya menyatakan bahwa data lowongan ini adalah benar (baik untuk perusahaan korporasi maupun UMKM / bisnis lokal), tidak memungut biaya apapun dari pelamar (bebas pungli/tiket fiktif), dan tunduk pada{" "}
                    <Link
                      href="/ketentuan-pasang-loker"
                      target="_blank"
                      className="text-primary font-bold underline hover:text-sky-800"
                    >
                      Panduan &amp; Ketentuan Pasang Loker Mimika
                    </Link>
                    .
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* ================= BOTTOM STICKY ACTION BAR ================= */}
          <div className="fixed bottom-0 left-0 right-0 sm:sticky sm:bottom-6 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 sm:border sm:rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">
                Langkah {currentStep} / {totalSteps}
              </span>
              <span>•</span>
              <span className="font-mono">
                {currentStep === 1
                  ? "Identitas Usaha & Penanggung Jawab"
                  : currentStep === 2
                  ? "Detail Lowongan"
                  : "Finalisasi & Kirim"}
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  className="h-11 px-5 rounded-xl text-xs sm:text-sm font-bold flex-1 sm:flex-none gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </Button>
              ) : (
                <Link href="/jobs" className="flex-1 sm:flex-none">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full sm:w-auto px-5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer"
                  >
                    Batal
                  </Button>
                </Link>
              )}

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isValidating}
                  className="h-11 px-7 rounded-xl text-xs sm:text-sm font-bold flex-1 sm:flex-none gap-2 shadow-xs cursor-pointer"
                >
                  <span>{isValidating ? "Memeriksa..." : "Lanjut ke Tahap Berikutnya"}</span>
                  {!isValidating && <ChevronRight className="w-4 h-4" />}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-8 rounded-xl text-xs sm:text-sm font-extrabold flex-1 sm:flex-none gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isSubmitting ? "Mengirim Lowongan..." : "Publikasikan Lowongan Sekarang"}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* ================= SUCCESS CELEBRATION MODAL ================= */}
      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6 sm:p-7 border border-slate-200/90 bg-white shadow-2xl space-y-5">
          <div className="text-center space-y-3 pt-1">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-emerald-200/60 shadow-xs">
              <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Lowongan Berhasil Dikirim!
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                Iklan lowongan kerja Anda telah masuk ke antrean review cepat tim verifikator (maks. 1x24 jam).
              </DialogDescription>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Link Akses Kelola Lowongan
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Rahasia</span>
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                readOnly
                value={magicLink}
                className="w-full h-10 pl-3 pr-20 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-600 focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="absolute right-1 top-1 bottom-1 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-0.5">
              Simpan link ini untuk memantau status persetujuan atau memperbarui rincian lowongan sewaktu-waktu.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <Link
              href={createdJobId ? `/manage/${createdJobId}` : "/dashboard"}
              className="block w-full"
            >
              <button
                type="button"
                className="w-full h-11 px-5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Buka Halaman Kelola Lowongan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/jobs" className="block w-full">
              <button
                type="button"
                className="w-full h-10 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
              >
                Kembali ke Daftar Lowongan
              </button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}