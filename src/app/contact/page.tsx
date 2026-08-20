"use client";
p
import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Send, 
  MessageCircle,
  HelpCircle, 
  MessageSquare,
  Sparkles, 
  ChevronDown,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { contactFormSchema, formatZodErrors } from "@/lib/validations";

const faqs = [
  {
    q: "Berapa lama pesan saya akan dibalas?",
    a: "Tim kami merespons setiap pesan dalam waktu maksimal 1x24 jam pada hari kerja (08.00 - 21.00 WIT). Untuk urusan mendesak, Anda dapat langsung menghubungi via WhatsApp resmi."
  },
  {
    q: "Apakah pemasangan lowongan kerja dipungut biaya?",
    a: "Tidak. Pemasangan lowongan kerja di LokerTimika adalah 100% GRATIS untuk seluruh perusahaan, instansi, maupun pelaku UMKM lokal di Mimika."
  },
  {
    q: "Bagaimana cara melaporkan lowongan palsu atau pungutan biaya?",
    a: "Anda dapat mengirim pesan melalui formulir ini atau menekan tombol laporkan langsung pada halaman detail lowongan terkait."
  },
  {
    q: "Bagaimana cara mengedit lowongan yang sudah terbit?",
    a: "Jika Anda memiliki akun, Anda dapat mengelolanya melalui Dasbor. Jika memasang tanpa akun, silakan kirim permohonan edit melalui formulir ini beserta judul lowongan."
  }
];

export default function ContactPage() {
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
  const [copiedCode, setCopiedCode] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ticketId);
    setCopiedCode(true);
    toast.success("Kode tiket berhasil disalin!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const validationResult = contactFormSchema.safeParse({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      organization: formData.organization || null,
      category: "general",
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
      const generatedCode = `MSG-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedCode);
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success("Pesan Anda berhasil terkirim!");
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ name: "", email: "", phone: "", organization: "", subject: "", message: "" });
    setFieldErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="container mx-auto px-4 max-w-4xl pt-8 sm:pt-10">
        <Link 
          href="/jobs" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary transition-colors group mb-6"
        >
          <div className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 group-hover:border-primary group-hover:text-primary transition-all">
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          </div>
          <span>Kembali ke Daftar Lowongan</span>
        </Link>

        {/* Minimalist Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            <span>Pusat Bantuan &amp; Kontak Resmi</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Hubungi Tim LokerTimika
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Punya pertanyaan seputar lowongan, kendala teknis, masukan platform, atau tawaran kemitraan? Silakan kirimkan pesan Anda melalui formulir di bawah ini.
          </p>
        </div>
      </div>

      {/* 2. MAIN FORM CONTAINER */}
      <div className="container mx-auto px-4 max-w-4xl mt-8 space-y-8">
        
        {isSubmitted ? (
          /* SUCCESS STATE */
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-xs text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="max-w-md mx-auto space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80 font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                Pesan Berhasil Terkirim
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 pt-1">
                Terima Kasih, Pesan Anda Sudah Masuk!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Tim admin kami akan meninjau dan merespons ke email Anda dalam waktu maksimal 1x24 jam kerja.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 max-w-sm mx-auto text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-500">
                <span>Nomor Tiket:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">{ticketId}</span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title="Salin Nomor Tiket"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Email Anda:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[170px]">{formData.email}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Estimasi Balasan:</span>
                <span className="font-bold text-emerald-600">&lt; 24 Jam Kerja</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto h-11 px-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Kirim Pesan Lainnya
              </button>
              <a
                href={`https://wa.me/6281234567890?text=Halo%20Admin%20LokerTimika,%20saya%20telah%20mengirimkan%20pesan%20dengan%20nomor%20tiket%20${ticketId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                Konfirmasi Cepat via WhatsApp
              </a>
            </div>
          </div>
        ) : (
          /* FORM CARD */
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Formulir Kontak
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Isi rincian pesan atau pertanyaan Anda pada kolom di bawah.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-xs font-bold text-slate-700">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Cth: Maria Rumkorem"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all bg-white"
                  />
                  {fieldErrors.name && (
                    <p className="text-[11px] text-rose-600 font-medium">{fieldErrors.name}</p>
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
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all bg-white"
                  />
                  {fieldErrors.email && (
                    <p className="text-[11px] text-rose-600 font-medium">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-700">
                    Nomor WhatsApp <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="organization" className="block text-xs font-bold text-slate-700">
                    Nama Usaha / Instansi <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    placeholder="Cth: Kafe / Toko / PT Maju"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all bg-white"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className="block text-xs font-bold text-slate-700">
                  Subjek Pesan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  placeholder="Cth: Pertanyaan lowongan / bantuan pasang loker"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all bg-white"
                />
                {fieldErrors.subject && (
                  <p className="text-[11px] text-rose-600 font-medium">{fieldErrors.subject}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-xs font-bold text-slate-700">
                  Isi Pesan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tuliskan pertanyaan, masukan, laporan, atau pesan Anda secara lengkap di sini..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all bg-white resize-y"
                />
                {fieldErrors.message && (
                  <p className="text-[11px] text-rose-600 font-medium">{fieldErrors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Mengirimkan Pesan...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Pesan</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. FAQ ACCORDION SECTION */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base">
            <HelpCircle className="w-4 h-4 text-primary shrink-0" />
            <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
          </div>

          <div className="space-y-2.5 divide-y divide-slate-100">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="pt-3 first:pt-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left gap-2 text-xs font-bold text-slate-800 hover:text-primary transition-colors cursor-pointer py-1"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-1.5 pb-1 animate-in fade-in duration-150">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Butuh panduan pemasangan lowongan?</span>
            <Link
              href="/ketentuan-pasang-loker"
              className="font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>Ketentuan Pasang Loker</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}