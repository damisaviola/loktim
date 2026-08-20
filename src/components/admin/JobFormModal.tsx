"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import {
  Plus,
  Briefcase,
  MapPin,
  Building2,
  CheckCircle2,
  Mail,
  Wallet,
  Users,
  CalendarRange,
  Phone,
  Link as LinkIcon,
  UserCheck,
  GraduationCap,
  Sparkles,
  Info,
} from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { getCompaniesByEmailAction, createJobAction } from "@/app/actions/job";
import { toast } from "sonner";

interface JobFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const inputClass =
  "w-full h-11 px-4 bg-background border border-border/80 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all";
const selectClass = `${inputClass} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:9px_9px] bg-[right_1rem_center] bg-no-repeat pr-9`;
const labelClass = "block text-xs font-bold uppercase tracking-wider text-foreground/80";

const LOCATION_SUGGESTIONS = [
  "Kuala Kencana",
  "Tembagapura",
  "Timika Kota",
  "Portsite",
  "Bandara Mozes Kilangin",
  "SP 2 / SP 3 Mimika",
  "Mile 38",
];

export default function JobFormModal({ open, onOpenChange }: JobFormModalProps) {
  const [isNewCompany, setIsNewCompany] = useState(true);
  const [companyList, setCompanyList] = useState<{ id: string; name: string }[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

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

  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyLocation, setNewCompanyLocation] = useState("Timika, Papua Tengah");
  const [newCompanyDesc, setNewCompanyDesc] = useState("");

  const [email, setEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [picName, setPicName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [applicationLink, setApplicationLink] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/\D/g, "");
    if (!numberString) return "";
    return parseInt(numberString, 10).toLocaleString("id-ID");
  };

  const [salaryMinDisplay, setSalaryMinDisplay] = useState("");
  const [salaryMaxDisplay, setSalaryMaxDisplay] = useState("");

  useEffect(() => {
    if (open && categories.length === 0) {
      import("@/app/actions/category").then((m) => {
        m.getCategoriesAction().then((data) => setCategories(data));
      });
    }
  }, [open, categories.length]);

  const handleSalaryMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalaryMinDisplay(formatRupiah(e.target.value));
  };

  const handleSalaryMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalaryMaxDisplay(formatRupiah(e.target.value));
  };

  const handleQuickDeadline = (days: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
    const dd = String(targetDate.getDate()).padStart(2, "0");
    setDeadline(`${yyyy}-${mm}-${dd}`);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEmail(email);
    }, 400);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanDesc = description.replace(/<[^>]*>/g, "").trim();
    const cleanReq = requirements.replace(/<[^>]*>/g, "").trim();

    if (!cleanDesc) {
      toast.warning("Deskripsi Pekerjaan wajib diisi!");
      return;
    }
    if (!cleanReq) {
      toast.warning("Persyaratan (Requirements) wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("description", description);
    formData.append("requirements", requirements);
    formData.append("isNewCompany", isNewCompany.toString());
    formData.append("terms", "on");

    try {
      const result = await createJobAction(formData);
      setIsSubmitting(false);

      if (result.success) {
        toast.success("Lowongan baru berhasil ditambahkan!");
        onOpenChange(false);
      } else {
        toast.error("Gagal menambahkan lowongan: " + result.error);
      }
    } catch (error: any) {
      console.error(error);
      setIsSubmitting(false);
      toast.error(error?.message || "Terjadi kesalahan sistem.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl !p-0 overflow-hidden border border-border/80 bg-card shadow-2xl rounded-2xl !flex !flex-col max-h-[90vh] !gap-0">
        {/* HEADER FIXED */}
        <div className="p-5 sm:p-6 pr-12 border-b border-border/60 shrink-0 bg-card/80 backdrop-blur-md">
          <DialogHeader>
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold tracking-tight text-foreground">
                  Tambah Lowongan Baru
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-xs text-muted-foreground font-medium">
                  Publikasikan lowongan kerja baru secara langsung melalui panel admin.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* BODY SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 bg-background">
          <form id="create-job-form" onSubmit={handleSubmit} className="space-y-8">
            {/* SECTION 1: PROFIL & KONTAK */}
            <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-5 shadow-xs">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-3">
                <Building2 className="w-4 h-4" />
                <span>1. Profil Perusahaan / Usaha &amp; Kontak</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Email Resmi Perusahaan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hrd@perusahaan.com"
                    className={inputClass}
                  />
                  {companyList.length > 0 ? (
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Terdaftar: {companyList[0]?.name}
                    </p>
                  ) : null}
                </div>

                {/* Nama Penanggung Jawab */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Nama Penanggung Jawab / Pemilik</label>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      <UserCheck className="w-3 h-3" />
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
                </div>
              </div>

              {/* Company Selection / Creation */}
              {isNewCompany ? (
                <div className="space-y-4 pt-2 border-t border-border/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={labelClass}>
                        Nama Perusahaan Baru <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        name="newCompanyName"
                        type="text"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        placeholder="PT. Freeport Mandiri Papua"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>
                        Alamat Kantor / Lokasi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        name="newCompanyLocation"
                        type="text"
                        value={newCompanyLocation}
                        onChange={(e) => setNewCompanyLocation(e.target.value)}
                        placeholder="Jl. Cenderawasih SP 2, Timika"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass}>
                      Deskripsi Singkat Perusahaan <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      name="newCompanyDesc"
                      rows={3}
                      value={newCompanyDesc}
                      onChange={(e) => setNewCompanyDesc(e.target.value)}
                      placeholder="Profil singkat bidang usaha dan operasional..."
                      className="w-full p-3.5 bg-background border border-border/80 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <label className={labelClass}>Pilih Perusahaan Terdaftar</label>
                  <select
                    name="companyId"
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className={selectClass}
                  >
                    {companyList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Nomor WhatsApp</label>
                    <span className="text-[10px] text-muted-foreground font-normal">Opsional</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-bold text-muted-foreground pointer-events-none">
                      +62
                    </span>
                    <input
                      name="whatsapp"
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="81234567890"
                      className={`${inputClass} pl-12`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Link Form / Portal Karir</label>
                    <span className="text-[10px] text-muted-foreground font-normal">Opsional</span>
                  </div>
                  <input
                    name="applicationLink"
                    type="url"
                    value={applicationLink}
                    onChange={(e) => setApplicationLink(e.target.value)}
                    placeholder="https://forms.gle/..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: DETAIL LOWONGAN */}
            <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-5 shadow-xs">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-3">
                <Briefcase className="w-4 h-4" />
                <span>2. Detail Pekerjaan</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Posisi Pekerjaan (Job Title) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Cth: Mekanik Alat Berat"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelClass}>
                      Kategori <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      name="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={selectClass}
                    >
                      <option value="" disabled hidden>
                        -- Pilih Kategori --
                      </option>
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Pertambangan">Pertambangan &amp; Energi</option>
                          <option value="Teknik & Engineering">Teknik &amp; Engineering</option>
                          <option value="Operasional">Operasional &amp; Lapangan</option>
                          <option value="Logistik">Logistik, Gudang &amp; Supir</option>
                          <option value="Admin & HR">Admin, Keuangan &amp; HRD</option>
                          <option value="IT & Software">IT, Jaringan &amp; Software</option>
                          <option value="Pelayanan">Pelayanan, Hospitality &amp; F&B</option>
                          <option value="Kesehatan">Kesehatan &amp; Medis</option>
                          <option value="Keamanan & K3">Keamanan, Security &amp; K3</option>
                          <option value="Lainnya">Kategori Lainnya</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass}>
                      Lokasi Penempatan Kerja <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      name="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Cth: Kuala Kencana, Timika"
                      className={inputClass}
                    />

                    <div className="pt-1 flex flex-wrap items-center gap-1.5">
                      {LOCATION_SUGGESTIONS.slice(0, 4).map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setLocation(`${loc}, Timika`)}
                          className="text-[10px] bg-secondary hover:bg-secondary/80 text-foreground/80 px-2 py-0.5 rounded transition-colors cursor-pointer"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-secondary/30 p-4 border border-border/60">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">
                    Gaji Minimal (Rp) <span className="text-[10px] text-muted-foreground">(Opsional)</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-bold text-muted-foreground pointer-events-none">
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
                      placeholder="5.000.000"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">
                    Gaji Maksimal (Rp) <span className="text-[10px] text-muted-foreground">(Opsional)</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-bold text-muted-foreground pointer-events-none">
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
                      placeholder="8.000.000"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>

              {/* Rich Text: Deskripsi */}
              <div className="space-y-2">
                <label className={labelClass}>
                  Deskripsi Lengkap <span className="text-rose-500">*</span>
                </label>
                <div className="rounded-xl overflow-hidden border border-border/80">
                  <RichTextEditor
                    defaultValue={description}
                    onChange={(val) => setDescription(val)}
                    placeholder="Jelaskan peran, tanggung jawab, dan gambaran umum pekerjaan..."
                  />
                </div>
              </div>

              {/* Rich Text: Persyaratan */}
              <div className="space-y-2">
                <label className={labelClass}>
                  Persyaratan (Requirements) <span className="text-rose-500">*</span>
                </label>
                <div className="rounded-xl overflow-hidden border border-border/80">
                  <RichTextEditor
                    defaultValue={requirements}
                    onChange={(val) => setRequirements(val)}
                    placeholder="1. Pendidikan minimal...&#10;2. Pengalaman kerja..."
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: KUALIFIKASI KANDIDAT */}
            <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-5 shadow-xs">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-3">
                <GraduationCap className="w-4 h-4" />
                <span>3. Kriteria &amp; Kualifikasi Kandidat</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Tipe Kontrak */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Tipe Kontrak <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
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

                {/* Pendidikan */}
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

                {/* Pengalaman */}
                <div className="space-y-1.5">
                  <label className={labelClass}>Pengalaman Kerja</label>
                  <select
                    name="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className={selectClass}
                  >
                    <option value="Tanpa Pengalaman">Fresh Graduate</option>
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
                    <option value="Pria/Wanita">Pria / Wanita (Bebas)</option>
                    <option value="Pria">Khusus Pria</option>
                    <option value="Wanita">Khusus Wanita</option>
                  </select>
                </div>

                {/* Usia Maksimal */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Batas Umur Maksimal</label>
                    <span className="text-[10px] text-muted-foreground font-normal">Opsional</span>
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

                {/* Batas Lamaran */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Batas Akhir Lamaran</label>
                    <span className="text-[10px] text-muted-foreground font-normal">Opsional</span>
                  </div>
                  <input
                    name="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={inputClass}
                  />
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleQuickDeadline(7)}
                      className="text-[10px] bg-secondary hover:bg-secondary/80 text-foreground/80 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    >
                      +7 Hari
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDeadline(14)}
                      className="text-[10px] bg-secondary hover:bg-secondary/80 text-foreground/80 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    >
                      +14 Hari
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDeadline(30)}
                      className="text-[10px] bg-secondary hover:bg-secondary/80 text-foreground/80 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    >
                      +30 Hari
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER FIXED */}
        <div className="p-4 sm:p-5 border-t border-border/60 shrink-0 bg-card/80 backdrop-blur-md">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-muted-foreground bg-background border border-border hover:bg-secondary hover:text-foreground transition-all shadow-xs w-full sm:w-auto cursor-pointer"
            >
              Batal
            </button>
            <button
              form="create-job-form"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-primary hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 transition-all w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isSubmitting ? "Menyimpan..." : "Publikasikan Lowongan"}</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
