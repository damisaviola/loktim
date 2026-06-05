import prisma from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // Since authentication is not fully implemented yet,
  // we will fetch the first company in the database to act as the logged-in company.
  const firstCompany = await prisma.company.findFirst();

  let hrdJobs: any[] = [];
  
  if (firstCompany) {
    hrdJobs = await prisma.job.findMany({
      where: { companyId: firstCompany.id },
      orderBy: { createdAt: 'desc' }
    });
  }

  return (
    <DashboardClient hrdJobs={hrdJobs} />
  );
}
