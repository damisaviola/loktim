import prisma from "@/lib/prisma";
import DashboardClient, { DashboardJob } from "./DashboardClient";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userEmail = user?.email ?? null;
  let company = null;

  if (user) {
    company = await prisma.company.findFirst({
      where: {
        OR: [
          { authUserId: user.id },
          ...(user.email ? [{ email: user.email }] : []),
        ],
      },
    });
  }

  let hrdJobs: DashboardJob[] = [];


  if (company) {
    const rawJobs = await prisma.job.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: "desc" },
    });

    hrdJobs = rawJobs.map((job) => ({
      id: job.id,
      title: job.title,
      category: job.category,
      location: job.location,
      status: job.status,
      isPremium: job.isPremium,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      postedAt: job.postedAt.toISOString(),
      deadline: job.deadline ? job.deadline.toISOString() : null,
    }));
  }

  const companyData = company
    ? {
        id: company.id,
        name: company.name,
        location: company.location,
        logoUrl: company.logoUrl,
        email: company.email,
      }
    : null;

  return (
    <DashboardClient
      company={companyData}
      hrdJobs={hrdJobs}
      userEmail={userEmail}
    />
  );
}