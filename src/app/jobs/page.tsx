import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getApprovedJobsAction } from '@/lib/queries/job';
import { jobs as dummyJobs } from '@/lib/dummy-data';
import { Job } from '@/types';
import { JobsClient } from './JobsClient';
import JobsLoading from './loading';

export const metadata: Metadata = {
  title: "Daftar Lowongan Kerja Terbaru di Timika & Mimika",
  description: "Temukan lowongan kerja terbaru di Timika, Mimika, Freeport, dan Papua Tengah. Ribuan peluang karir untuk berbagai lulusan dan kualifikasi.",
  openGraph: {
    title: "Daftar Lowongan Kerja Terbaru di Timika & Mimika - LokerTimika",
    description: "Temukan lowongan kerja terbaru di Timika, Mimika, Freeport, dan Papua Tengah. Ribuan peluang karir untuk berbagai lulusan dan kualifikasi.",
    siteName: "LokerTimika",
  },
};

async function HomeContent() {
  let initialJobs: Job[] = [];
  
  try {
    const fetchedJobs = await getApprovedJobsAction();
    initialJobs = [...(fetchedJobs as unknown as Job[]), ...dummyJobs];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    initialJobs = dummyJobs;
  }

  return <JobsClient initialJobs={initialJobs} />;
}

export default function JobsPage() {
  return (
    <main className="bg-slate-50/70 min-h-screen">
      <Suspense fallback={<JobsLoading />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}

