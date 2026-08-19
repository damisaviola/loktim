"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight,
  Bug, 
  CheckCircle2, 
  Send, 
  MessageCircle,
  HelpCircle, 
  ShieldAlert, 
  Briefcase, 
  AlertCircle, 
  Sparkles, 
  ChevronDown,
  MessageSquare,
  Handshake,
  Lightbulb,
  Building,
  Radio,
  FileQuestion
} from "lucide-react";
import { toast } from "sonner";
import { contactFormSchema, formatZodErrors } from "@/lib/validations";

type FormMode = "general" | "issue";

// Categories for Form Umum
const generalCategories = [
  { id: "general_question", label: "Pertanyaan Layanan", icon: FileQuestion, color: "text-blue-500 bg-blue-50 border-blue-100" },
  { id: "partnership", label: "Kemitraan & Kerjasama", icon: Handshake, color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
  { id: "feedback", label: "Saran & Masukan", icon: Lightbulb, color: "text-amber-500 bg-amber-50 border-amber-100" },
  { id: "media", label: "Media & Komunitas", icon: Radio, color: "text-purple-500 bg-purple-50 border-purple-100" },
];

const generalQuickTopics = [
  "Informasi Pasang Iklan / Promosi Loker",
  "Penawaran Kerjasama Lembaga / Instansi",
  "Cara Verifikasi Profil Perusahaan",
  "Usulan Kategori Pekerjaan Baru",
  "Konsultasi Rekrutmen Talenta Mimika",
];

// Categories for Form Kendala
const issueCategories = [
  { id: "technical", label: "Kendala Teknis / Bug Web", icon: Bug, color: "text-rose-500 bg-rose-50 border-rose-100" },
  { id: "job_post", label: "Bantuan Pasang / Kelola Loker", icon: Briefcase, color: "text-blue-500 bg-blue-50 border-blue-100" },
  { id: "fraud", label: "Laporan Penipuan / Pungli", icon: ShieldAlert, color: "text-amber-500 bg-amber-50 border-amber-100" },
  { id: "account", label: "Masalah Akun & Login", icon: HelpCircle, color: "text-purple-500 bg-purple-50 border-purple-100" },
];

const issueQuickTopics = [
  "Gagal mengunggah logo perusahaan",
  "Status lowongan masih 'Pending'",
  "Ingin mengedit rincian lowongan",
  "Laporan lowongan memungut biaya",
  "Kendala verifikasi email / akun",
];

const faqs = [
  {
    q: "Berapa lama pesan atau laporan saya akan dibalas?",
    a: "Tim kami merespons setiap pesan dan laporan dalam waktu maksimal 1x24 jam pada hari kerja (Senin - Sabtu, 08.00 - 21.00 WIT). Untuk urusan mendesak, silakan langsung menghubungi WhatsApp resmi kami."
  },
  {
    q: "Apakah pemasangan lowongan di LokerTimika berbayar?",
    a: "Pemasangan lowongan standar di platform kami adalah 100% GRATIS tanpa biaya tersembunyi. Kami juga menyediakan opsi promosi (Featured Job) bagi perusahaan yang membutuhkan percepatan rekrutmen."
  },
  {
    q: "Bagaimana cara mengajukan kerjasama kemitraan atau CSR?",
    a: "Pilih tab 'Form Kontak Umum' di atas dengan kategori 'Kemitraan & Kerjasama', lalu sertakan profil instansi Anda. Tim partnership kami akan segera menghubungi Anda."
  },
  {
    q: "Bagaimana cara mengubah rincian lowongan yang sudah terbit?",
    a: "Jika Anda memiliki akun perusahaan, status dan deadline lowongan dapat dikelola langsung melalui Dashboard. Untuk perubahan posisi atau isi lowongan, silakan kirimkan laporan kendala melalui form ini."
  }
];

export default function ContactPage() {
  const [formMode, setFormMode] = useState<FormMode>("general");
  const [selectedCategory, setSelectedCategory] = useState("general_question");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    subject: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const isGeneral = formMode === "general";
  const activeCategories = isGeneral ? generalCategories : issueCategories;
  const activeQuickTopics = isGeneral ? generalQuickTopics : issueQuickTopics;

  const handleModeSwitch = (mode: FormMode) => {
    setFormMode(mode);
    setSelectedCategory(mode === "general" ? "general_question" : "technical");
    setFormData((prev) => ({ ...prev, subject: "" }));
    setFieldErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSelectTopic = (topic: string) => {
    setFormData((prev) => ({ ...prev, subject: topic }));
    if (fieldErrors.subject) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.subject;
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Client-side Zod validation
    const validationResult = contactFormSchema.safeParse({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      organization: formData.organization || null,
      category: selectedCategory,
      subject: formData.subject,
      message: formData.message,
    });

    if (!validationResult.success) {
      const { fieldErrors: errs, generalErrors } = formatZodErrors(validationResult.error);
      setFieldErrors(errs);
      const firstError = Object.values(errs)[0] || generalErrors[0] || "Mohon periksa kembali isian formulir.";
      toast.error(firstError);
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const prefix = isGeneral ? "MSG" : "TICK";
      const generatedCode = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedCode);
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success(isGeneral ? "Pesan Anda berhasil terkirim!" : "Laporan kendala berhasil dikirim!");
    }, 900);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ name: "", email: "", phone: "", organization: "", subject: "", message: "" });
    setFieldErrors({});
    setSelectedCategory(isGeneral ? "general_question" : "technical");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pb-24">
      <div className="container mx-auto px-4 max-w-5xl pt-8 sm:pt-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-primary transition-colors group mb-6"
        >
          <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 group-hover:border-primary group-hover:text-primary transition-all shadow-2xs">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </div>
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-radial from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-12 text-white overflow-hidden shadow-xl shadow-slate-950/10 border border-slate-800 mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30 text-[11px] sm:text-xs font-bold tracking-wide uppercase mb-4 backdrop-blur-xs">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              Pusat Layanan &amp; Kontak Resmi
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-snug mb-3">
              Hubungi Kami &amp; <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">Pusat Bantuan</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Punya pertanyaan seputar platform, tawaran kemitraan, kendala teknis, atau butuh bantuan pasang loker? Kami siap mendengar dan membantu Anda.
            </p>
          </div>
        </div>

        {/* Tab Mode Switcher: Form Umum vs Lapor Kendala */}
        <div className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 max-w-md mx-auto mb-8 grid grid-cols-2 gap-1.5 shadow-2xs">
          <button
            type="button"
            onClick={() => handleModeSwitch("general")}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              formMode === "general"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Form Kontak Umum</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeSwitch("issue")}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              formMode === "issue"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Bug className="w-4 h-4 text-rose-500" />
            <span>Lapor Kendala / Bug</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form / Success State */}
          <div className="lg:col-span-8">
            {isSubmitted ? (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-xs text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isGeneral ? "Pesan Diterima" : "Laporan Kendala Diterima"}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {isGeneral ? "Terima Kasih Telah Menghubungi Kami!" : "Laporan Anda Berhasil Dicatat!"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {isGeneral
                      ? "Pesan dan pertanyaan Anda telah masuk ke sistem kami. Tim LokerTimika akan segera membalas ke email Anda."
                      : "Laporan kendala Anda telah kami terima. Tim teknis dan operasional kami akan segera melakukan penelusuran."}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 max-w-sm mx-auto text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Kode Referensi:</span>
                    <span className="font-mono font-bold text-slate-800 text-sm bg-white px-2 py-0.5 rounded border border-slate-200">{ticketId}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Email Pengirim:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[180px]">{formData.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Estimasi Balasan:</span>
                    <span className="font-semibold text-emerald-600">Maks. 1x24 Jam Kerja</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs"
                  >
                    Kirim Pesan Lainnya
                  </button>
                  <a
                    href={`https://wa.me/6281234567890?text=Halo%20Admin%20LokerTimika,%20saya%20telah%20mengirimkan%20pesan%20dengan%20kode%20${ticketId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Konfirmasi via WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider mb-2 bg-slate-100 text-slate-700">
                    {isGeneral ? "Form Kontak Umum & Kemitraan" : "Form Pelaporan Masalah / Bug"}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {isGeneral ? "Kirim Pesan atau Pertanyaan" : "Formulir Laporan Kendala Teknis"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {isGeneral
                      ? "Silakan sampaikan pertanyaan, proposal kerjasama, atau saran perbaikan untuk LokerTimika."
                      : "Pilih kategori masalah yang dihadapi dan sertakan detail langkah terjadinya error."}
                  </p>
                </div>

                {/* Category Selection Chips */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Pilih Kategori {isGeneral ? "Pesan" : "Kendala"} <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeCategories.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${cat.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-xs sm:text-sm font-bold ${isSelected ? "text-primary" : "text-slate-700"}`}>
                            {cat.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Topic Autofill Pills */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Topik Populer (Klik untuk mengisi subjek otomatis):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeQuickTopics.map((topic, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectTopic(topic)}
                        className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        + {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* The Form */}
                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="block text-xs font-bold text-slate-700">
                        Nama Lengkap / Kontak PIC <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Contoh: Budi Santoso"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full h-12 px-4 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all bg-white ${
                          fieldErrors.name
                            ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                            : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                        }`}
                      />
                      {fieldErrors.name && (
                        <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                        Alamat Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="nama@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full h-12 px-4 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all bg-white ${
                          fieldErrors.email
                            ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                            : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="block text-xs font-bold text-slate-700">
                        Nomor WhatsApp / HP <span className="text-slate-400 font-normal">(Opsional)</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="081234567890"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full h-12 px-4 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all bg-white ${
                          fieldErrors.phone
                            ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                            : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                        }`}
                      />
                      {fieldErrors.phone && (
                        <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>

                    {isGeneral ? (
                      <div className="space-y-1.5">
                        <label htmlFor="organization" className="block text-xs font-bold text-slate-700">
                          Nama Perusahaan / Instansi <span className="text-slate-400 font-normal">(Opsional)</span>
                        </label>
                        <input
                          type="text"
                          id="organization"
                          name="organization"
                          placeholder="Contoh: PT Maju Jaya Mimika"
                          value={formData.organization}
                          onChange={handleChange}
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                        />
                      </div>
                    ) : null}

                    <div className={`space-y-1.5 ${!isGeneral ? "" : "sm:col-span-2"}`}>
                      <label htmlFor="subject" className="block text-xs font-bold text-slate-700">
                        Subjek Pesan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        placeholder={isGeneral ? "Contoh: Pertanyaan kerjasama publikasi lowongan" : "Ringkasan singkat masalah"}
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full h-12 px-4 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all bg-white ${
                          fieldErrors.subject
                            ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                            : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                        }`}
                      />
                      {fieldErrors.subject && (
                        <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {fieldErrors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="message" className="block text-xs font-bold text-slate-700">
                        {isGeneral ? "Isi Pesan / Pertanyaan" : "Deskripsi Lengkap Kendala"} <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {isGeneral ? "Tuliskan pesan Anda secara jelas" : "Sertakan link atau kronologi error"}
                      </span>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder={
                        isGeneral
                          ? "Tuliskan pertanyaan, detail tawaran kerjasama, atau saran Anda di sini..."
                          : "Jelaskan detail masalah yang dihadapi, pesan error yang muncul, atau link lowongan yang ingin diperbaiki..."
                      }
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all bg-white resize-y ${
                        fieldErrors.message
                          ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                          : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                      }`}
                    />
                    {fieldErrors.message && (
                      <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fieldErrors.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-13 rounded-2xl bg-primary hover:bg-primary/90 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Mengirimkan Pesan...</span>
                        </>
                      ) : (
                        <>
                          <span>{isGeneral ? "Kirim Pesan Sekarang" : "Kirim Laporan Kendala"}</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Column: FAQ & Helpful Guides */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Tips Box */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                {isGeneral ? "Tips Kontak & Bantuan" : "Tips Laporan Cepat Selesai"}
              </div>
              <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                {isGeneral ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Pastikan alamat email aktif agar Anda menerima notifikasi balasan kami.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Sertakan nama instansi jika mewakili lembaga bisnis atau institusi.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Untuk pertanyaan mendesak, admin siap melayani via chat WhatsApp.</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Sertakan nama akun atau nama perusahaan yang bersangkutan.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Cantumkan link URL lowongan bila berkaitan dengan loker spesifik.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Jelaskan pesan error yang muncul pada layar Anda.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Accordion FAQ */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                Pertanyaan Populer
              </div>

              <div className="space-y-2 divide-y divide-slate-100">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index} className="pt-2.5 first:pt-0">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full flex items-center justify-between text-left gap-2 text-xs font-bold text-slate-800 hover:text-primary transition-colors cursor-pointer py-1"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <p className="text-[11px] text-slate-500 leading-relaxed pt-1.5 pb-1 animate-in fade-in duration-200">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/ketentuan-pasang-loker"
                  className="text-xs font-bold text-primary hover:underline flex items-center justify-between"
                >
                  <span>Baca Ketentuan Pasang Loker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}