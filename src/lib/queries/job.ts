import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getApprovedJobsAction = unstable_cache(
  async () => {
    try {
      const jobs = await prisma.job.findMany({
        where: { status: "approved" },
        include: { company: true },
        orderBy: { postedAt: "desc" },
        take: 150, // Batasi 150 loker terbaru agar hemat RAM & response cepat
      });

      return jobs.map((job) => ({
        ...job,
        postedAt: job.postedAt.toISOString(),
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
      }));
    } catch (error) {
      console.error("Failed to fetch approved jobs:", error);
      return [];
    }
  },
  ["approved-jobs"],
  { revalidate: 60, tags: ["jobs"] }
);
