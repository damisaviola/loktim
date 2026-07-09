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

// Rate limiting in-memory map
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();

const createJobSchema = z.object({
  isNewCompany: z.boolean(),
  companyId: z.string().optional().nullable(),
  newCompanyName: z.string().optional().nullable(),
  newCompanyLocation: z.string().optional().nullable(),
  newCompanyDesc: z.string().optional().nullable(),
  email: z.string().email("Format email tidak valid"),
  imageUrl: z.string().url("Format URL gambar tidak valid").optional().nullable().or(z.literal("")),
  title: z.string().min(3, "Posisi pekerjaan minimal 3 karakter"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  requirementsRaw: z.string().min(1, "Persyaratan wajib diisi"),
  type: z.string().min(1, "Tipe kontrak wajib dipilih"),
  education: z.string().default("Semua").nullable(),
  experience: z.string().default("Tanpa Pengalaman").nullable(),
  gender: z.string().default("Pria/Wanita").nullable(),
  ageRange: z.string().default("Bebas").nullable(),
  whatsapp: z.string().optional().nullable().or(z.literal("")),
  salaryMinStr: z.string().optional().nullable().or(z.literal("")),
  salaryMaxStr: z.string().optional().nullable().or(z.literal("")),
  deadlineStr: z.string().optional().nullable().or(z.literal("")),
  applicationLink: z.string().url("Format URL tidak valid").optional().nullable().or(z.literal("")),
}).refine(data => {
  if (data.isNewCompany) {
    return !!data.newCompanyName && !!data.newCompanyLocation;
  }
  return !!data.companyId;
}, {
  message: "Data perusahaan tidak lengkap",
  path: ["companyId"]
});

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
    // Basic IP-based Rate Limiting (3 jobs per 10 minutes)
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    
    if (ip !== "unknown-ip") {
      const rateData = rateLimitMap.get(ip) || { count: 0, resetAt: now + 10 * 60 * 1000 };
      if (now > rateData.resetAt) {
        rateData.count = 1;
        rateData.resetAt = now + 10 * 60 * 1000;
      } else {
        rateData.count++;
      }
      rateLimitMap.set(ip, rateData);

      if (rateData.count > 3) {
        return { success: false, error: "Terlalu banyak permintaan. Silakan coba lagi dalam 10 menit." };
      }
    }
    const rawData = {
      isNewCompany: formData.get("isNewCompany") === "true",
      companyId: formData.get("companyId") as string | null,
      newCompanyName: formData.get("newCompanyName") as string | null,
      newCompanyLocation: formData.get("newCompanyLocation") as string | null,
      newCompanyDesc: formData.get("newCompanyDesc") as string | null,
      email: formData.get("email") as string,
      imageUrl: formData.get("imageUrl") as string | null,
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      requirementsRaw: formData.get("requirements") as string,
      type: formData.get("type") as string,
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

    const validatedData = createJobSchema.safeParse(rawData);

    if (!validatedData.success) {
      const errorMessage = validatedData.error.issues.map(err => err.message).join(", ");
      return { success: false, error: errorMessage };
    }

    const data = validatedData.data;
    let finalCompanyId = data.companyId;

    if (data.isNewCompany) {
      const newCompany = await prisma.company.create({
        data: {
          name: data.newCompanyName!,
          location: data.newCompanyLocation!,
          logoUrl: data.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.newCompanyName!)}`,
          email: data.email,
          about: data.newCompanyDesc || null,
        }
      });
      finalCompanyId = newCompany.id;
    } else {
      const updateData: any = {};
      if (data.imageUrl) updateData.logoUrl = data.imageUrl;
      
      if (Object.keys(updateData).length > 0 && finalCompanyId) {
        await prisma.company.update({
          where: { id: finalCompanyId },
          data: updateData
        });
      }
    }

    if (!finalCompanyId) {
      throw new Error("Company ID is missing");
    }

    const salaryMin = data.salaryMinStr ? parseInt(data.salaryMinStr, 10) : null;
    const salaryMax = data.salaryMaxStr ? parseInt(data.salaryMaxStr, 10) : null;
    const deadline = data.deadlineStr ? new Date(data.deadlineStr) : null;

    // Sanitize requirements and description to prevent XSS
    const cleanDescription = DOMPurify.sanitize(data.description);
    
    const requirements = data.requirementsRaw
      .replace(/<\/p>|<\/li>|<br\s*\/?>/gi, '\n')
      .split('\n')
      .map(r => DOMPurify.sanitize(r.trim().replace(/<[^>]*>/g, "")))
      .filter(r => r.length > 0);

    const newJob = await prisma.job.create({
      data: {
        title: data.title,
        category: data.category,
        description: cleanDescription,
        requirements,
        type: data.type,
        education: data.education || "Semua",
        experience: data.experience || "Tanpa Pengalaman",
        gender: data.gender || "Pria/Wanita",
        ageRange: data.ageRange && data.ageRange !== "Bebas" ? `Maks. ${data.ageRange.replace(/\D/g, "")} Tahun` : "Bebas",
        companyId: finalCompanyId,
        salaryMin,
        salaryMax,
        deadline,
        imageUrl: data.imageUrl || null,
        contactUrl: data.applicationLink || (data.whatsapp ? `https://wa.me/${data.whatsapp.replace(/\D/g, '')}` : `mailto:${data.email}`),
        contacts: {
          email: data.email,
          whatsapp: data.whatsapp || "",
          applicationLink: data.applicationLink || "",
        },
      },
      include: {
        company: true
      }
    });

    // Send email non-blocking
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const manageLink = `${baseUrl}/manage/${newJob.id}`;
    
    sendEmail({
      to: data.email,
      subject: `Lowongan ${newJob.title} Sedang Direview`,
      react: JobSubmittedEmail({ 
        jobTitle: newJob.title, 
        companyName: newJob.company?.name || "Perusahaan", 
        manageLink 
      }) as any,
    }).catch(console.error);

    return { success: true, jobId: newJob.id };
  } catch (error: any) {
    console.error("Failed to create job:", error);
    return { success: false, error: error.message || "Failed to create job" };
  }
}

export async function updateJobAction(jobId: string, formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email") as string,
      imageUrl: formData.get("imageUrl") as string | null,
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      requirementsRaw: formData.get("requirements") as string,
      type: formData.get("type") as string,
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

    const salaryMin = rawData.salaryMinStr ? parseInt(rawData.salaryMinStr, 10) : null;
    const salaryMax = rawData.salaryMaxStr ? parseInt(rawData.salaryMaxStr, 10) : null;
    const deadline = rawData.deadlineStr ? new Date(rawData.deadlineStr) : null;

    // Sanitize requirements
    const requirements = rawData.requirementsRaw
      .replace(/<\/p>|<\/li>|<br\s*\/?>/gi, '\n')
      .split('\n')
      .map(r => r.trim().replace(/<[^>]*>/g, ""))
      .filter(r => r.length > 0);

    const updateData: any = {
      title: rawData.title,
      category: rawData.category,
      description: rawData.description,
      requirements,
      type: rawData.type,
      education: rawData.education || "Semua",
      experience: rawData.experience || "Tanpa Pengalaman",
      gender: rawData.gender || "Pria/Wanita",
      ageRange: rawData.ageRange && rawData.ageRange !== "Bebas" ? `Maks. ${rawData.ageRange.replace(/\D/g, "")} Tahun` : "Bebas",
      salaryMin,
      salaryMax,
      deadline,
      contactUrl: rawData.applicationLink || (rawData.whatsapp ? `https://wa.me/${rawData.whatsapp.replace(/\D/g, '')}` : `mailto:${rawData.email}`),
      contacts: {
        email: rawData.email,
        whatsapp: rawData.whatsapp || "",
        applicationLink: rawData.applicationLink || "",
      },
    };

    if (rawData.imageUrl) {
      updateData.imageUrl = rawData.imageUrl;
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
