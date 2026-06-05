"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const createJobSchema = z.object({
  isNewCompany: z.boolean(),
  companyId: z.string().optional().nullable(),
  newCompanyName: z.string().optional().nullable(),
  newCompanyLocation: z.string().optional().nullable(),
  email: z.string().email("Format email tidak valid"),
  imageUrl: z.string().url("Format URL gambar tidak valid").optional().nullable().or(z.literal("")),
  title: z.string().min(3, "Posisi pekerjaan minimal 3 karakter"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  description: z.string().min(10, "Deskripsi terlalu singkat"),
  requirementsRaw: z.string().min(5, "Persyaratan terlalu singkat"),
  type: z.string().min(1, "Tipe kontrak wajib dipilih"),
  education: z.string().default("Semua").nullable(),
  experience: z.string().default("Tanpa Pengalaman").nullable(),
  gender: z.string().default("Pria/Wanita").nullable(),
  ageRange: z.string().default("Bebas").nullable(),
  whatsapp: z.string().optional().nullable().or(z.literal("")),
  salaryMinStr: z.string().optional().nullable().or(z.literal("")),
  salaryMaxStr: z.string().optional().nullable().or(z.literal("")),
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
    const rawData = {
      isNewCompany: formData.get("isNewCompany") === "true",
      companyId: formData.get("companyId") as string | null,
      newCompanyName: formData.get("newCompanyName") as string | null,
      newCompanyLocation: formData.get("newCompanyLocation") as string | null,
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
          email: data.email
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

    // Sanitize requirements
    const requirements = data.requirementsRaw
      .split('\n')
      .map(r => r.trim().replace(/<[^>]*>/g, ""))
      .filter(r => r.length > 0);

    const newJob = await prisma.job.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        requirements,
        type: data.type,
        education: data.education || "Semua",
        experience: data.experience || "Tanpa Pengalaman",
        gender: data.gender || "Pria/Wanita",
        ageRange: data.ageRange || "Bebas",
        companyId: finalCompanyId,
        salaryMin,
        salaryMax,
        imageUrl: data.imageUrl || null,
        contactUrl: data.whatsapp ? `https://wa.me/${data.whatsapp.replace(/\D/g, '')}` : `mailto:${data.email}`,
        contacts: {
          email: data.email,
          whatsapp: data.whatsapp || "",
        },
      }
    });

    return { success: true, jobId: newJob.id };
  } catch (error: any) {
    console.error("Failed to create job:", error);
    return { success: false, error: error.message || "Failed to create job" };
  }
}

import { revalidatePath } from "next/cache";

export async function approveJobAction(jobId: string) {
  try {
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "approved" }
    });
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
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "rejected" }
    });
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

export async function getApprovedJobsAction() {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: "approved" },
      include: { company: true },
      orderBy: { postedAt: "desc" },
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
}

export async function getAdminCompaniesAction() {
  try {
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

