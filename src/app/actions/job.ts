"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import JobSubmittedEmail from "@/emails/JobSubmittedEmail";
import JobApprovedEmail from "@/emails/JobApprovedEmail";
import JobRejectedEmail from "@/emails/JobRejectedEmail";
import { render } from "@react-email/render";
import DOMPurify from "isomorphic-dompurify";
import { headers } from "next/headers";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";

const emailSchema = z.string().trim().toLowerCase()
  .email("Email belum diisi dengan benar. Contoh: nama@perusahaan.com")
  .max(255, "Email terlalu panjang");

const whatsappSchema = z.string().trim().optional().nullable().or(z.literal(""))
  .refine(val => {
    if (!val || val.trim() === "") return true;
    const digitsOnly = val.replace(/\D/g, "");
    return digitsOnly.length >= 9 && digitsOnly.length <= 15;
  }, { message: "Nomor WhatsApp belum benar. Isi 9-15 angka, contoh: 081234567890" });

const urlSchema = z.string().trim().optional().nullable().or(z.literal(""))
  .refine(val => {
    if (!val || val.trim() === "") return true;
    try {
      const parsed = new URL(val);
      return (parsed.protocol === "http:" || parsed.protocol === "https:") && val.length <= 2048;
    } catch {
      return false;
    }
  }, { message: "Link belum benar. Harus diawali http:// atau https://" });

const createJobSchema = z.object({
  isNewCompany: z.boolean(),
  companyId: z.string().optional().nullable(),
  newCompanyName: z.string().trim().max(100, "Nama perusahaan terlalu panjang").optional().nullable(),
  newCompanyLocation: z.string().trim().max(150, "Alamat perusahaan terlalu panjang").optional().nullable(),
  newCompanyDesc: z.string().trim().min(30, "Deskripsi perusahaan terlalu pendek. Isi minimal 30 huruf").max(2000, "Deskripsi perusahaan terlalu panjang").optional().nullable(),
  email: emailSchema,
  picName: z.string().trim().max(100, "Nama PIC maksimal 100 karakter").optional().nullable().or(z.literal("")),
  imageUrl: urlSchema,
  title: z.string().trim().min(3, "Posisi pekerjaan terlalu pendek. Isi minimal 3 huruf").max(120, "Posisi pekerjaan terlalu panjang"),
  category: z.string().trim().min(1, "Silakan pilih kategori pekerjaan"),
  location: z.string().trim().min(1, "Lokasi penempatan masih kosong, harap diisi").max(150, "Lokasi penempatan terlalu panjang"),
  description: z.string().trim().min(10, "Deskripsi pekerjaan terlalu pendek. Isi minimal 10 huruf").max(20000, "Deskripsi pekerjaan terlalu panjang"),
  requirementsRaw: z.string().trim().min(5, "Persyaratan terlalu pendek. Isi minimal 5 huruf").max(10000, "Persyaratan terlalu panjang"),
  type: z.string().trim().min(1, "Silakan pilih tipe kontrak"),
  education: z.string().default("Semua").nullable(),
  experience: z.string().default("Tanpa Pengalaman").nullable(),
  gender: z.string().default("Pria/Wanita").nullable(),
  ageRange: z.string().default("Bebas").nullable(),
  whatsapp: whatsappSchema,
  salaryMinStr: z.string().optional().nullable().or(z.literal("")),
  salaryMaxStr: z.string().optional().nullable().or(z.literal("")),
  deadlineStr: z.string().optional().nullable().or(z.literal("")),
  applicationLink: urlSchema,
  terms: z.boolean().refine(val => val, {
    message: "Anda harus menyetujui Panduan & Ketentuan terlebih dahulu",
  }),
})
.refine(data => {
  if (data.isNewCompany) {
    return !!data.newCompanyName && !!data.newCompanyLocation;
  }
  return !!data.companyId;
}, {
  message: "Nama dan alamat perusahaan baru wajib diisi",
  path: ["newCompanyName"]
})
.refine(data => {
  if (data.isNewCompany) {
    return !!data.newCompanyDesc;
  }
  return true;
}, {
  message: "Deskripsi perusahaan wajib diisi",
  path: ["newCompanyDesc"]
})
.refine(data => {
  if (data.salaryMinStr && data.salaryMaxStr && data.salaryMinStr !== "" && data.salaryMaxStr !== "") {
    const min = parseInt(data.salaryMinStr, 10);
    const max = parseInt(data.salaryMaxStr, 10);
    if (!isNaN(min) && !isNaN(max) && max < min) {
      return false;
    }
  }
  return true;
}, {
  message: "Gaji maksimal tidak boleh lebih kecil dari gaji minimal",
  path: ["salaryMaxStr"]
})
.refine(data => {
  if (data.deadlineStr && data.deadlineStr.trim() !== "") {
    const deadline = new Date(data.deadlineStr);
    if (isNaN(deadline.getTime())) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (deadline < today) {
      return false;
    }
  }
  return true;
}, {
  message: "Tanggal batas lamaran tidak boleh sudah lewat",
  path: ["deadlineStr"]
});

const updateJobSchema = z.object({
  email: emailSchema,
  picName: z.string().trim().max(100, "Nama PIC maksimal 100 karakter").optional().nullable().or(z.literal("")),
  imageUrl: urlSchema,
  title: z.string().trim().min(3, "Posisi pekerjaan terlalu pendek. Isi minimal 3 huruf").max(120, "Posisi pekerjaan terlalu panjang"),
  category: z.string().trim().min(1, "Silakan pilih kategori pekerjaan"),
  location: z.string().trim().min(1, "Lokasi penempatan masih kosong, harap diisi").max(150, "Lokasi penempatan terlalu panjang"),
  description: z.string().trim().min(10, "Deskripsi pekerjaan terlalu pendek. Isi minimal 10 huruf").max(20000, "Deskripsi pekerjaan terlalu panjang"),
  requirementsRaw: z.string().trim().min(5, "Persyaratan terlalu pendek. Isi minimal 5 huruf").max(10000, "Persyaratan terlalu panjang"),
  type: z.string().trim().min(1, "Silakan pilih tipe kontrak"),
  education: z.string().default("Semua").nullable(),
  experience: z.string().default("Tanpa Pengalaman").nullable(),
  gender: z.string().default("Pria/Wanita").nullable(),
  ageRange: z.string().default("Bebas").nullable(),
  whatsapp: whatsappSchema,
  salaryMinStr: z.string().optional().nullable().or(z.literal("")),
  salaryMaxStr: z.string().optional().nullable().or(z.literal("")),
  deadlineStr: z.string().optional().nullable().or(z.literal("")),
  applicationLink: urlSchema,
})
.refine(data => {
  if (data.salaryMinStr && data.salaryMaxStr && data.salaryMinStr !== "" && data.salaryMaxStr !== "") {
    const min = parseInt(data.salaryMinStr, 10);
    const max = parseInt(data.salaryMaxStr, 10);
    if (!isNaN(min) && !isNaN(max) && max < min) {
      return false;
    }
  }
  return true;
}, {
  message: "Gaji maksimal tidak boleh lebih kecil dari gaji minimal",
  path: ["salaryMaxStr"]
})
.refine(data => {
  if (data.deadlineStr && data.deadlineStr.trim() !== "") {
    const deadline = new Date(data.deadlineStr);
    if (isNaN(deadline.getTime())) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (deadline < today) {
      return false;
    }
  }
  return true;
}, {
  message: "Tanggal batas lamaran tidak boleh sudah lewat",
  path: ["deadlineStr"]
});

const step1Schema = z.object({
  email: emailSchema,
  picName: z.string().trim().max(100, "Nama PIC maksimal 100 karakter").optional().nullable().or(z.literal("")),
  whatsapp: whatsappSchema,
  applicationLink: urlSchema,
  isNewCompany: z.boolean(),
  companyId: z.string().optional().nullable(),
  newCompanyName: z.string().trim().max(100, "Nama perusahaan terlalu panjang").optional().nullable(),
  newCompanyLocation: z.string().trim().max(150, "Alamat perusahaan terlalu panjang").optional().nullable(),
  newCompanyDesc: z.string().trim().min(30, "Deskripsi perusahaan terlalu pendek. Isi minimal 30 huruf").max(2000, "Deskripsi perusahaan terlalu panjang").optional().nullable(),
}).refine(data => {
  if (data.isNewCompany) {
    return !!data.newCompanyName && !!data.newCompanyLocation;
  }
  return !!data.companyId;
}, {
  message: "Nama dan alamat perusahaan baru wajib diisi",
  path: ["newCompanyName"]
})
.refine(data => {
  if (data.isNewCompany) {
    return !!data.newCompanyDesc;
  }
  return true;
}, {
  message: "Deskripsi perusahaan wajib diisi",
  path: ["newCompanyDesc"]
});

const step2Schema = z.object({
  title: z.string().trim().min(3, "Posisi pekerjaan terlalu pendek. Isi minimal 3 huruf").max(120, "Posisi pekerjaan terlalu panjang"),
  category: z.string().trim().min(1, "Silakan pilih kategori pekerjaan"),
  location: z.string().trim().min(1, "Lokasi penempatan masih kosong, harap diisi").max(150, "Lokasi penempatan terlalu panjang"),
  description: z.string().trim().min(10, "Deskripsi pekerjaan terlalu pendek. Isi minimal 10 huruf").max(20000, "Deskripsi pekerjaan terlalu panjang"),
  requirementsRaw: z.string().trim().min(5, "Persyaratan terlalu pendek. Isi minimal 5 huruf").max(10000, "Persyaratan terlalu panjang"),
  salaryMinStr: z.string().optional().nullable().or(z.literal("")),
  salaryMaxStr: z.string().optional().nullable().or(z.literal("")),
}).refine(data => {
  if (data.salaryMinStr && data.salaryMaxStr && data.salaryMinStr !== "" && data.salaryMaxStr !== "") {
    const min = parseInt(data.salaryMinStr, 10);
    const max = parseInt(data.salaryMaxStr, 10);
    if (!isNaN(min) && !isNaN(max) && max < min) {
      return false;
    }
  }
  return true;
}, {
  message: "Gaji maksimal tidak boleh lebih kecil dari gaji minimal",
  path: ["salaryMaxStr"]
});

const step3Schema = z.object({
  type: z.string().trim().min(1, "Silakan pilih tipe kontrak"),
  education: z.string().default("Semua").nullable(),
  experience: z.string().default("Tanpa Pengalaman").nullable(),
  gender: z.string().default("Pria/Wanita").nullable(),
  ageRange: z.string().default("Bebas").nullable(),
  deadlineStr: z.string().optional().nullable().or(z.literal("")),
  terms: z.boolean().refine(val => val, {
    message: "Anda harus menyetujui Panduan & Ketentuan terlebih dahulu",
  }),
}).refine(data => {
  if (data.deadlineStr && data.deadlineStr.trim() !== "") {
    const deadline = new Date(data.deadlineStr);
    if (isNaN(deadline.getTime())) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (deadline < today) {
      return false;
    }
  }
  return true;
}, {
  message: "Tanggal batas lamaran tidak boleh sudah lewat",
  path: ["deadlineStr"]
});

export async function validateJobStepAction(step: number, formData: FormData) {
  const rawData = {
    isNewCompany: formData.get("isNewCompany") === "true",
    companyId: formData.get("companyId") as string | null,
    newCompanyName: formData.get("newCompanyName") as string | null,
    newCompanyLocation: formData.get("newCompanyLocation") as string | null,
    newCompanyDesc: formData.get("newCompanyDesc") as string | null,
    email: (formData.get("email") as string) ?? "",
    picName: (formData.get("picName") as string | null) ?? "",
    title: (formData.get("title") as string) ?? "",
    category: (formData.get("category") as string) ?? "",
    location: (formData.get("location") as string) ?? "",
    description: (formData.get("description") as string) ?? "",
    requirementsRaw: (formData.get("requirements") as string) ?? "",
    type: (formData.get("type") as string) ?? "",
    education: formData.get("education") as string | null,
    experience: formData.get("experience") as string | null,
    gender: formData.get("gender") as string | null,
    ageRange: formData.get("ageRange") as string | null,
    whatsapp: formData.get("whatsapp") as string | null,
    salaryMinStr: formData.get("salaryMin") as string | null,
    salaryMaxStr: formData.get("salaryMax") as string | null,
    deadlineStr: formData.get("deadline") as string | null,
    applicationLink: formData.get("applicationLink") as string | null,
    terms: formData.get("terms") === "on",
  };

  const schemaMap: Record<number, z.ZodType> = { 1: step1Schema, 2: step2Schema, 3: step3Schema };
  const schema = schemaMap[step];
  if (!schema) {
    return { success: false, errors: ["Langkah tidak dikenal, silakan muat ulang halaman"] };
  }

  const result = schema.safeParse(rawData);
  if (!result.success) {
    return { success: false, errors: result.error.issues.map(err => err.message) };
  }

  return { success: true, errors: [] as string[] };
}

export async function getCompaniesAction() {
  try {
    const companies = await prisma.company.findMany({
      select: { id: true, name: true, email: true }
    });
    return companies;
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    return [];
  }
}

export async function getCompaniesByEmailAction(email: string) {
  try {
    const companies = await prisma.company.findMany({
      where: { email },
      select: { id: true, name: true, email: true }
    });
    return companies;
  } catch (error) {
    console.error("Failed to fetch companies by email:", error);
    return [];
  }
}

export async function createJobAction(formData: FormData) {
  try {
    const ip = await getClientIp();
    const rateLimit = checkRateLimit('create_job', ip, 5, 10 * 60 * 1000); // 5 submissions per 10 mins
    if (!rateLimit.success) {
      return { success: false, error: rateLimit.error };
    }
    const rawData = {
      isNewCompany: formData.get("isNewCompany") === "true",
      companyId: formData.get("companyId") as string | null,
      newCompanyName: formData.get("newCompanyName") as string | null,
      newCompanyLocation: formData.get("newCompanyLocation") as string | null,
      newCompanyDesc: formData.get("newCompanyDesc") as string | null,
      email: (formData.get("email") as string) ?? "",
      picName: (formData.get("picName") as string | null) ?? "",
      imageUrl: formData.get("imageUrl") as string | null,
      title: (formData.get("title") as string) ?? "",
      category: (formData.get("category") as string) ?? "",
      location: (formData.get("location") as string) ?? "",
      description: (formData.get("description") as string) ?? "",
      requirementsRaw: (formData.get("requirements") as string) ?? "",
      type: (formData.get("type") as string) ?? "",
      education: formData.get("education") as string | null,
      experience: formData.get("experience") as string | null,
      gender: formData.get("gender") as string | null,
      ageRange: formData.get("ageRange") as string | null,
      whatsapp: formData.get("whatsapp") as string | null,
      salaryMinStr: formData.get("salaryMin") as string | null,
      salaryMaxStr: formData.get("salaryMax") as string | null,
      deadlineStr: formData.get("deadline") as string | null,
      applicationLink: formData.get("applicationLink") as string | null,
      terms: formData.get("terms") === "on",
    };

    const validatedData = createJobSchema.safeParse(rawData);

    if (!validatedData.success) {
      const errors = validatedData.error.issues.map(err => err.message);
      return { success: false, error: errors.join(", "), errors };
    }

    const data = validatedData.data;
    let finalCompanyId = data.companyId;

    // Link the company to the logged-in user (if any) so the dashboard can find it
    let authUserId: string | null = null;
    try {
      const { createClient } = await import("@/utils/supabase/server");
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      authUserId = user?.id ?? null;
    } catch {
      // ignore, posting stays open to the public
    }

    if (data.isNewCompany) {
      let existingCompany = null;
      if (authUserId) {
        existingCompany = await prisma.company.findUnique({
          where: { authUserId },
        });
      }

      if (!existingCompany && data.email) {
        existingCompany = await prisma.company.findFirst({
          where: { email: data.email },
        });
      }

      if (existingCompany) {
        const updatedCompany = await prisma.company.update({
          where: { id: existingCompany.id },
          data: {
            authUserId: authUserId ?? existingCompany.authUserId,
            name: data.newCompanyName || existingCompany.name,
            location: data.newCompanyLocation || existingCompany.location,
            email: data.email || existingCompany.email,
            about: data.newCompanyDesc || existingCompany.about,
            picName: data.picName || existingCompany.picName,
          },
        });
        finalCompanyId = updatedCompany.id;
      } else {
        const newCompany = await prisma.company.create({
          data: {
            name: data.newCompanyName!,
            location: data.newCompanyLocation!,
            logoUrl:
              data.imageUrl ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                data.newCompanyName!
              )}`,
            email: data.email,
            picName: data.picName || null,
            about: data.newCompanyDesc || null,
            authUserId,
          },
        });
        finalCompanyId = newCompany.id;
      }
    } else {
      const updateData: any = {};
      if (data.imageUrl) updateData.logoUrl = data.imageUrl;
      if (authUserId) updateData.authUserId = authUserId;
      if (data.picName) updateData.picName = data.picName;

      if (Object.keys(updateData).length > 0 && finalCompanyId) {
        await prisma.company.update({
          where: { id: finalCompanyId },
          data: updateData,
        });
      }
    }

    if (!finalCompanyId) {
      throw new Error("ID Perusahaan tidak ditemukan.");
    }

    const salaryMin = data.salaryMinStr ? parseInt(data.salaryMinStr, 10) : null;
    const salaryMax = data.salaryMaxStr ? parseInt(data.salaryMaxStr, 10) : null;
    const deadline = data.deadlineStr ? new Date(data.deadlineStr) : null;

    // Sanitize requirements and description to prevent XSS
    const cleanDescription = DOMPurify.sanitize(data.description);

    const requirements = data.requirementsRaw
      .replace(/<\/p>|<\/li>|<br\s*\/?>/gi, "\n")
      .split("\n")
      .map((r) => DOMPurify.sanitize(r.trim().replace(/<[^>]*>/g, "")))
      .filter((r) => r.length > 0);

    const newJob = await prisma.job.create({
      data: {
        title: data.title,
        category: data.category,
        location: data.location,
        description: cleanDescription,
        requirements,
        picName: data.picName || null,
        type: data.type,
        education: data.education || "Semua",
        experience: data.experience || "Tanpa Pengalaman",
        gender: data.gender || "Pria/Wanita",
        ageRange:
          data.ageRange && data.ageRange !== "Bebas"
            ? `Maks. ${data.ageRange.replace(/\D/g, "")} Tahun`
            : "Bebas",
        companyId: finalCompanyId,
        salaryMin,
        salaryMax,
        deadline,
        imageUrl: data.imageUrl || null,
        contactUrl:
          data.applicationLink ||
          (data.whatsapp
            ? `https://wa.me/${data.whatsapp.replace(/\D/g, "")}`
            : `mailto:${data.email}`),
        contacts: {
          email: data.email,
          picName: data.picName || "",
          whatsapp: data.whatsapp || "",
          applicationLink: data.applicationLink || "",
        },
      },
      include: {
        company: true,
      },
    });

    // Send email non-blocking
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const manageLink = `${baseUrl}/manage/${newJob.id}`;

      sendEmail({
        to: data.email,
        subject: `Lowongan ${newJob.title} Sedang Direview`,
        react: JobSubmittedEmail({
          jobTitle: newJob.title,
          companyName: newJob.company?.name || "Perusahaan",
          manageLink,
        }) as any,
      }).catch(console.error);
    } catch (emailErr) {
      console.error("Email notification skipped:", emailErr);
    }

    return { success: true, jobId: newJob.id };
  } catch (error: any) {
    console.error("Failed to create job:", error);
    return {
      success: false,
      error:
        error?.message ||
        "Terjadi kesalahan saat memproses lowongan. Silakan coba kembali.",
    };
  }
}

export async function updateJobAction(jobId: string, formData: FormData) {
  try {
    const rawData = {
      email: (formData.get("email") as string) ?? "",
      imageUrl: formData.get("imageUrl") as string | null,
      title: (formData.get("title") as string) ?? "",
      category: (formData.get("category") as string) ?? "",
      location: (formData.get("location") as string) ?? "",
      description: (formData.get("description") as string) ?? "",
      requirementsRaw: (formData.get("requirements") as string) ?? "",
      type: (formData.get("type") as string) ?? "",
      education: formData.get("education") as string | null,
      experience: formData.get("experience") as string | null,
      gender: formData.get("gender") as string | null,
      ageRange: formData.get("ageRange") as string | null,
      whatsapp: formData.get("whatsapp") as string | null,
      salaryMinStr: formData.get("salaryMin") as string | null,
      salaryMaxStr: formData.get("salaryMax") as string | null,
      deadlineStr: formData.get("deadline") as string | null,
      applicationLink: formData.get("applicationLink") as string | null,
    };

    const validatedData = updateJobSchema.safeParse(rawData);

    if (!validatedData.success) {
      const errorMessage = validatedData.error.issues.map(err => err.message).join(", ");
      return { success: false, error: errorMessage };
    }

    const data = validatedData.data;

    const salaryMin = data.salaryMinStr ? parseInt(data.salaryMinStr, 10) : null;
    const salaryMax = data.salaryMaxStr ? parseInt(data.salaryMaxStr, 10) : null;
    const deadline = data.deadlineStr ? new Date(data.deadlineStr) : null;

    // Sanitize description and requirements
    const cleanDescription = DOMPurify.sanitize(data.description);
    
    const requirements = data.requirementsRaw
      .replace(/<\/p>|<\/li>|<br\s*\/?>/gi, '\n')
      .split('\n')
      .map(r => DOMPurify.sanitize(r.trim().replace(/<[^>]*>/g, "")))
      .filter(r => r.length > 0);

    const updateData: any = {
      title: data.title,
      category: data.category,
      location: data.location,
      description: cleanDescription,
      requirements,
      picName: data.picName || null,
      type: data.type,
      education: data.education || "Semua",
      experience: data.experience || "Tanpa Pengalaman",
      gender: data.gender || "Pria/Wanita",
      ageRange: data.ageRange && data.ageRange !== "Bebas" ? `Maks. ${data.ageRange.replace(/\D/g, "")} Tahun` : "Bebas",
      salaryMin,
      salaryMax,
      deadline,
      contactUrl: data.applicationLink || (data.whatsapp ? `https://wa.me/${data.whatsapp.replace(/\D/g, '')}` : `mailto:${data.email}`),
      contacts: {
        email: data.email,
        picName: data.picName || "",
        whatsapp: data.whatsapp || "",
        applicationLink: data.applicationLink || "",
      },
    };

    if (data.imageUrl) {
      updateData.imageUrl = data.imageUrl;
    }

    await prisma.job.update({
      where: { id: jobId },
      data: updateData
    });

    revalidatePath("/admin");
    revalidatePath("/admin/jobs");
    revalidatePath("/admin/jobs/active");
    revalidatePath("/admin/jobs/pending");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update job:", error);
    return { success: false, error: error.message || "Failed to update job" };
  }
}

import { revalidatePath } from "next/cache";
import { getUserSession } from "./auth";

export async function approveJobAction(jobId: string) {
  try {
    const user = await getUserSession();
    if (!user) {
      return { success: false, error: "Unauthorized access" };
    }

    const job = await prisma.job.update({
      where: { id: jobId },
      data: { status: "approved" },
      include: { company: true }
    });

    // Extract email from contacts json or company email
    const posterEmail = (job.contacts as any)?.email || job.company?.email;
    
    if (posterEmail) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const publicLink = `${baseUrl}/job/${job.id}`;
      
      sendEmail({
        to: posterEmail,
        subject: `✅ Lowongan ${job.title} Telah Disetujui`,
        react: JobApprovedEmail({
          jobTitle: job.title,
          companyName: job.company?.name || "Perusahaan",
          publicLink
        }) as any
      }).catch(console.error);
    }

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to approve job:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectJobAction(jobId: string) {
  try {
    const user = await getUserSession();
    if (!user) {
      return { success: false, error: "Unauthorized access" };
    }

    const job = await prisma.job.update({
      where: { id: jobId },
      data: { status: "rejected" },
      include: { company: true }
    });

    const posterEmail = (job.contacts as any)?.email || job.company?.email;
    
    if (posterEmail) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const manageLink = `${baseUrl}/manage/${job.id}`;
      
      sendEmail({
        to: posterEmail,
        subject: `❌ Lowongan ${job.title} Belum Dapat Ditayangkan`,
        react: JobRejectedEmail({
          jobTitle: job.title,
          companyName: job.company?.name || "Perusahaan",
          manageLink
        }) as any
      }).catch(console.error);
    }

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to reject job:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteJobAction(jobId: string) {
  try {
    const user = await getUserSession();
    if (!user) {
      return { success: false, error: "Unauthorized access" };
    }

    await prisma.job.delete({
      where: { id: jobId }
    });
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete job:", error);
    return { success: false, error: error.message };
  }
}

import { unstable_cache } from "next/cache";

export const getApprovedJobsAction = unstable_cache(async () => {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: "approved" },
      include: { company: true },
      orderBy: { postedAt: "desc" },
      take: 150, // Batasi 150 loker terbaru agar hemat RAM
    });
    
    return jobs.map(job => ({
      ...job,
      postedAt: job.postedAt.toISOString(),
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch approved jobs:", error);
    return [];
  }
}, ['approved-jobs'], { revalidate: 60, tags: ['jobs'] });

export async function getAdminCompaniesAction() {
  try {
    const user = await getUserSession();
    if (!user) {
      throw new Error("Unauthorized access");
    }

    const companies = await prisma.company.findMany({
      include: {
        jobs: true
      }
    });
    return companies.map(comp => ({
      ...comp,
      jobs: comp.jobs.map(job => ({
        ...job,
        postedAt: job.postedAt.toISOString(),
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
      }))
    }));
  } catch (error) {
    console.error("Failed to fetch admin companies:", error);
    return [];
  }
}

export async function getAdminCategoriesAction() {
  try {
    const user = await getUserSession();
    if (!user) {
      throw new Error("Unauthorized access");
    }

    const dbCategories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    const categories = dbCategories.map(c => c.name);

    const jobs = await prisma.job.findMany({
      select: {
        category: true,
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          }
        }
      }
    });

    const categoryData: Record<string, { count: number; companies: Map<string, any> }> = {};
    
    jobs.forEach(job => {
      if (!categoryData[job.category]) {
        categoryData[job.category] = { count: 0, companies: new Map() };
      }
      categoryData[job.category].count += 1;
      if (job.company) {
        categoryData[job.category].companies.set(job.company.id, job.company);
      }
    });

    const result = dbCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      jobCount: categoryData[cat.name]?.count || 0,
      companies: Array.from(categoryData[cat.name]?.companies.values() || [])
    }));

    Object.keys(categoryData).forEach(cat => {
      if (!categories.includes(cat)) {
        result.push({
          id: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: cat,
          jobCount: categoryData[cat].count,
          companies: Array.from(categoryData[cat].companies.values())
        });
      }
    });

    return result;
  } catch (error) {
    console.error("Failed to fetch admin categories:", error);
    return [];
  }
}

export async function closeJobAction(jobId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return { success: false, error: "Lowongan tidak ditemukan" };
    }

    await prisma.job.update({
      where: { id: jobId },
      data: { status: "closed" }
    });

    revalidatePath("/admin");
    revalidatePath("/admin/jobs");
    revalidatePath("/admin/jobs/active");
    revalidatePath("/admin/jobs/pending");
    revalidatePath("/dashboard");
    revalidatePath("/");
    revalidatePath(`/manage/${jobId}`);
    revalidatePath(`/job/${jobId}`);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to close job:", error);
    return { success: false, error: error.message || "Failed to close job" };
  }
}
