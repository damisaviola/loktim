'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Globe,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2,
  UploadCloud,
  ChevronLeft,
  Briefcase,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Users,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';
import { createClient } from '@/utils/supabase/client';
import { registerCompanyAction } from '@/app/actions/company';
import { registerCompanySchema, formatZodErrors } from '@/lib/validations';

const INDUSTRY_OPTIONS = [
  'Pertambangan & Energi',
  'Konstruksi & Teknik',
  'Perhotelan & Restoran (F&B)',
  'Kesehatan & Farmasi',
  'Logistik & Transportasi',
  'Retail, Toko & Perdagangan',
  'Teknologi, IT & Komunikasi',
  'Pendidikan & Kursus',
  'Keuangan & Perbankan',
  'Jasa Keamanan & Pengamanan',
  'Pembersihan & Fasilitas (Cleaning)',
  'Otomotif & Bengkel',
  'Media, Kreatif & Percetakan',
  'Instansi & Yayasan / Non-Profit',
  'Lainnya',
];

export default function CompanyRegisterForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: 'Timika, Papua Tengah',
    about: '',
    website: '',
    picName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successData, setSuccessData] = useState<{
    companyName: string;
    companyId: string;
  } | null>(null);

  const supabase = createClient();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file logo maksimal 5 MB');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score += 1;
    if (p.length >= 8) score += 1;
    if (/[A-Z]/.test(p)) score += 1;
    if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) score += 1;
    return score;
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    // Client-side Zod validation
    const validationResult = registerCompanySchema.safeParse({
      name: formData.name,
      industry: formData.industry,
      location: formData.location,
      about: formData.about,
      website: formData.website || null,
      picName: formData.picName,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      logoUrl: logoPreview ? 'https://dummy.valid-url.com' : null,
      agreeTerms: formData.agreeTerms,
    });

    if (!validationResult.success) {
      const { fieldErrors: errs, generalErrors } = formatZodErrors(validationResult.error);
      setFieldErrors(errs);
      const firstError = Object.values(errs)[0] || generalErrors[0] || 'Mohon lengkapi formulir dengan benar.';
      setErrorMessage(firstError);
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedLogoUrl: string | null = null;

      // 1. Upload Logo if selected
      if (logoFile) {
        setIsUploadingLogo(true);
        try {
          const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 600,
            useWebWorker: true,
            fileType: 'image/webp',
          };
          const compressedFile = await imageCompression(logoFile, options);
          const fileExt = 'webp';
          const fileName = `logos/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(fileName, compressedFile);

          if (!uploadError && uploadData) {
            const {
              data: { publicUrl },
            } = supabase.storage.from('images').getPublicUrl(fileName);
            uploadedLogoUrl = publicUrl;
          }
        } catch (uploadErr) {
          console.warn('Logo upload fallback to default:', uploadErr);
        } finally {
          setIsUploadingLogo(false);
        }
      }

      // 2. Call Server Action
      const result = await registerCompanyAction({
        name: formData.name,
        industry: formData.industry,
        location: formData.location,
        about: formData.about,
        website: formData.website || null,
        picName: formData.picName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        logoUrl: uploadedLogoUrl,
        agreeTerms: formData.agreeTerms,
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Pendaftaran gagal. Silakan periksa kembali formulir Anda.');
        toast.error(result.error || 'Pendaftaran gagal.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Success
      toast.success('Pendaftaran perusahaan berhasil!');
      setSuccessData({
        companyName: result.companyName || formData.name,
        companyId: result.companyId || '',
      });
    } catch (err: any) {
      console.error('Registration submit error:', err);
      setErrorMessage('Terjadi kendala jaringan atau server. Silakan coba kembali.');
      toast.error('Terjadi kesalahan saat memproses pendaftaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (successData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-100 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10 border border-emerald-100">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-4 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Akun Perusahaan Aktif</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Selamat Datang, {successData.companyName}!
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
            Profil perusahaan dan akun rekruter Anda telah terdaftar. Anda sekarang siap mempublikasikan lowongan kerja untuk menjangkau ribuan pencari kerja di Mimika.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/post"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>Pasang Loker Sekarang</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
            >
              <span>Buka Dasbor Perusahaan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-850 text-white pt-10 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </Link>

            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              Sudah punya akun?{' '}
              <Link
                href="/perusahaan/login"
                className="text-sky-300 hover:text-white font-bold underline underline-offset-4 transition-colors"
              >
                Masuk ke Dasbor
              </Link>
            </div>
          </div>

          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>Portal Mitra Perusahaan & Pemberi Kerja</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Daftarkan Perusahaan Anda untuk Pasang Loker
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Bergabunglah dengan ratusan perusahaan, kontraktor, dan instansi di Mimika. Dapatkan kemudahan mengelola lowongan kerja, menjaring kandidat lokal berkualitas, dan membangun reputasi rekrutmen profesional.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Form + Side Preview */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Registration Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-10 space-y-8">
            
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Mohon periksa data Anda:</p>
                  <p className="text-xs text-red-600 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* SECTION 1: Profil Perusahaan */}
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Profil & Identitas Perusahaan
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Informasi resmi yang akan dilihat oleh para pencari kerja.
                    </p>
                  </div>
                </div>

                {/* Logo Upload Dropzone */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Logo Perusahaan (Opsional)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 group">
                      {logoPreview ? (
                        <Image
                          src={logoPreview}
                          alt="Logo Preview"
                          fill
                          className="object-contain p-2"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={handleLogoSelect}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>{logoPreview ? 'Ganti Logo' : 'Unggah Logo Perusahaan'}</span>
                      </button>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        Format PNG, JPG, atau WebP (Maks. 5MB). Jika kosong, inisial otomatis akan digunakan.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nama Perusahaan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nama Perusahaan / Instansi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Contoh: PT Papua Gemilang Jaya"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                        fieldErrors.name
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                          : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                      }`}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Kategori Industri */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Bidang / Sektor Industri <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleInputChange}
                    className={`w-full h-12 px-3.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:bg-white focus:outline-none transition-all cursor-pointer ${
                      fieldErrors.industry
                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                    }`}
                  >
                    <option value="">Pilih Bidang Industri...</option>
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.industry && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {fieldErrors.industry}
                    </p>
                  )}
                </div>

                {/* Alamat / Lokasi */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Alamat Lengkap / Wilayah Operasional <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      required
                      placeholder="Contoh: Jl. Cenderawasih No. 45, Timika, Mimika Baru"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                        fieldErrors.location
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                          : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                      }`}
                    />
                  </div>
                  {fieldErrors.location && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {fieldErrors.location}
                    </p>
                  )}
                </div>

                {/* Deskripsi Perusahaan */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Deskripsi Profil Perusahaan <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {formData.about.length}/3000 karakter
                    </span>
                  </div>
                  <textarea
                    name="about"
                    rows={4}
                    required
                    placeholder="Ceritakan tentang profil bisnis, budaya kerja, visi misi, atau layanan yang disediakan oleh perusahaan Anda..."
                    value={formData.about}
                    onChange={handleInputChange}
                    className={`w-full p-3.5 rounded-xl bg-slate-50 border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                      fieldErrors.about
                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                    }`}
                  />
                  {fieldErrors.about && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {fieldErrors.about}
                    </p>
                  )}
                </div>

                {/* Website URL */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Website / Tautan Profil (Opsional)
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      name="website"
                      placeholder="https://perusahaan.co.id"
                      value={formData.website}
                      onChange={handleInputChange}
                      className={`w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                        fieldErrors.website
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                          : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                      }`}
                    />
                  </div>
                  {fieldErrors.website && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {fieldErrors.website}
                    </p>
                  )}
                </div>
              </div>

              {/* SECTION 2: Akun HRD & Kredensial Login */}
              <div className="space-y-5 pt-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Akun Rekruter & Kredensial Login
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Digunakan untuk masuk ke Dasbor Perusahaan & menerima laporan pelamar.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nama Penanggung Jawab / Pemilik */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Nama Penanggung Jawab / Pemilik <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="picName"
                        required
                        placeholder="Contoh: Budi Santoso (Pemilik / HRD)"
                        value={formData.picName}
                        onChange={handleInputChange}
                        className={`w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                          fieldErrors.picName
                            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                            : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                        }`}
                      />
                    </div>
                    {fieldErrors.picName && (
                      <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fieldErrors.picName}
                      </p>
                    )}
                  </div>

                  {/* Nomor WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Nomor WhatsApp HRD <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="081234567890"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                          fieldErrors.phone
                            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                            : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                        }`}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Perusahaan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Resmi Perusahaan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="hrd@perusahaan.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                        fieldErrors.email
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                          : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {fieldErrors.email}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400">
                    Email ini akan digunakan sebagai username login ke Dasbor Perusahaan.
                  </p>
                </div>

                {/* Kata Sandi & Konfirmasi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Kata Sandi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full h-12 pl-10 pr-10 rounded-xl bg-slate-50 border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                          fieldErrors.password
                            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                            : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fieldErrors.password}
                      </p>
                    )}

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="space-y-1 pt-1">
                        <div className="flex gap-1 h-1">
                          <div
                            className={`flex-1 rounded-full ${
                              passwordStrength >= 1 ? 'bg-red-500' : 'bg-slate-200'
                            }`}
                          ></div>
                          <div
                            className={`flex-1 rounded-full ${
                              passwordStrength >= 2 ? 'bg-amber-500' : 'bg-slate-200'
                            }`}
                          ></div>
                          <div
                            className={`flex-1 rounded-full ${
                              passwordStrength >= 3 ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                          ></div>
                          <div
                            className={`flex-1 rounded-full ${
                              passwordStrength >= 4 ? 'bg-emerald-600' : 'bg-slate-200'
                            }`}
                          ></div>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {passwordStrength < 2
                            ? 'Kata sandi lemah'
                            : passwordStrength < 4
                            ? 'Kata sandi cukup baik'
                            : 'Kata sandi sangat kuat'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Ulangi Kata Sandi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        required
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full h-12 pl-10 pr-10 rounded-xl bg-slate-50 border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                          fieldErrors.confirmPassword
                            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                            : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fieldErrors.confirmPassword}
                      </p>
                    )}

                    {formData.confirmPassword && !fieldErrors.confirmPassword && (
                      <p
                        className={`text-[11px] font-medium pt-1 ${
                          formData.password === formData.confirmPassword
                            ? 'text-emerald-600 flex items-center gap-1'
                            : 'text-red-500'
                        }`}
                      >
                        {formData.password === formData.confirmPassword ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Kata sandi cocok</span>
                          </>
                        ) : (
                          'Kata sandi belum cocok'
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Komitmen & Ketentuan Rekrutmen */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-sky-900 leading-relaxed space-y-1">
                    <p className="font-bold">Komitmen Ekosistem Rekrutmen Bebas Pungli</p>
                    <p className="text-sky-800">
                      LokerTimika berkomitmen menjaga integritas rekrutmen. Perusahaan dilarang keras memungut biaya tes/seragam/akomodasi dalam bentuk apapun dari pelamar kerja.
                    </p>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-1 text-primary rounded border-slate-300 focus:ring-primary focus:ring-offset-0 transition-colors"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed font-medium">
                    Saya menyatakan bahwa data perusahaan ini adalah benar, dan menyetujui{' '}
                    <Link
                      href="/ketentuan-pasang-loker"
                      target="_blank"
                      className="text-primary font-bold hover:underline"
                    >
                      Ketentuan Layanan & Kebijakan Pemasangan Loker
                    </Link>{' '}
                    di LokerTimika.
                  </span>
                </label>
                {fieldErrors.agreeTerms && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {fieldErrors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isUploadingLogo}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary via-primary to-sky-600 hover:brightness-105 text-white font-bold text-base shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting || isUploadingLogo ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Mendaftarkan Perusahaan...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar & Masuk ke Dasbor</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500 font-medium">
                  Sudah memiliki akun terdaftar?{' '}
                  <Link
                    href="/perusahaan/login"
                    className="text-primary font-bold hover:underline underline-offset-4"
                  >
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* RIGHT: Live Preview & Benefits (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Company Preview Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pratinjau Profil Publik
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Mitra Aktif
                </span>
              </div>

              <div className="flex items-start gap-3.5 pt-2">
                <div className="relative w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-black text-xl">
                      {formData.name ? formData.name.substring(0, 2).toUpperCase() : 'PT'}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-base text-slate-900 truncate leading-snug">
                    {formData.name || 'Nama Perusahaan Anda'}
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 mt-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{formData.location || 'Timika, Papua'}</span>
                  </div>
                  {formData.industry && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                      {formData.industry}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {formData.about ||
                  'Deskripsi profil perusahaan Anda akan tampil di sini kepada para kandidat pencari kerja.'}
              </p>
            </div>

            {/* Why Partner with LokerTimika Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>

              <h3 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-300" />
                <span>Keuntungan Merekrut di LokerTimika</span>
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-sky-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Jangkauan Talenta Lokal Tertarget</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Diakses ribuan pencari kerja aktif setiap hari di Timika, Tembagapura, Kuala Kencana, & Papua Tengah.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Moderasi Cepat & Manajemen Mudah</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Loker ditinjau dengan cepat dan dapat dipantau langsung melalui Dasbor Perusahaan Anda.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-sky-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Bangun Employer Branding Terpercaya</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Halaman profil perusahaan resmi untuk meningkatkan kepercayaan dan minat para kandidat terbaik.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span>Butuh bantuan khusus?</span>
                <Link href="/contact" className="text-sky-300 font-bold hover:underline">
                  Hubungi Tim Support
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
