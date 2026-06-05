"use server";

import prisma from "@/lib/prisma";

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
    const isNewCompany = formData.get("isNewCompany") === "true";
    
    let companyId = formData.get("companyId") as string;
    const imageUrl = formData.get("imageUrl") as string | null;
    const email = formData.get("email") as string;

    if (isNewCompany) {
      const companyName = formData.get("newCompanyName") as string;
      const companyLocation = formData.get("newCompanyLocation") as string;
      // const companyDesc = formData.get("newCompanyDesc") as string;
      
      const newCompany = await prisma.company.create({
        data: {
          name: companyName,
          location: companyLocation,
          logoUrl: imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(companyName)}`,
          email: email
        }
      });
      companyId = newCompany.id;
    } else {
      // If the company doesn't have an email set yet, we might want to update it.
      // But mainly, update the logo if present
      const updateData: any = {};
      if (imageUrl) updateData.logoUrl = imageUrl;
      
      if (Object.keys(updateData).length > 0) {
        await prisma.company.update({
          where: { id: companyId },
          data: updateData
        });
      }
    }

    if (!companyId) {
      throw new Error("Company ID is missing");
    }

    // Extract other fields
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const requirementsRaw = formData.get("requirements") as string;
    const type = formData.get("type") as string;
    const education = formData.get("education") as string;
    const experience = formData.get("experience") as string;
    const gender = formData.get("gender") as string || "Pria/Wanita";
    const ageRange = formData.get("ageRange") as string || "Bebas";
    const whatsapp = formData.get("whatsapp") as string;
    
    const salaryMinStr = formData.get("salaryMin") as string;
    const salaryMaxStr = formData.get("salaryMax") as string;
    const salaryMin = salaryMinStr ? parseInt(salaryMinStr, 10) : null;
    const salaryMax = salaryMaxStr ? parseInt(salaryMaxStr, 10) : null;

    // Split requirements by newline if entered as plain text, or just store as single string in array
    const requirements = requirementsRaw
      .split('\n')
      .map(r => r.trim().replace(/<[^>]*>/g, ""))
      .filter(r => r.length > 0);

    const newJob = await prisma.job.create({
      data: {
        title,
        category,
        description,
        requirements,
        type,
        education,
        experience,
        gender,
        ageRange,
        companyId,
        salaryMin,
        salaryMax,
        imageUrl,
        contactUrl: whatsapp ? `https://wa.me/${whatsapp}` : `mailto:${email}`,
        contacts: {
          email,
          whatsapp,
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

