import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getApprovedJobsAction } from '@/lib/queries/job';
import { jobs as dummyJobs } from '@/lib/dummy-data';
import { Job } from '@/types';
import { JobsClient } from './JobsClient';
import JobsLoading from './loading';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lokertimika.vercel.app';

export const metadata: Metadata = {
  title: "Loker Timika Terbaru - Lowongan Kerja Timika & Mimika",
  description: "Cari & lamar lowongan kerja (loker) terbaru di Timika, Mimika, Freeport, & Papua Tengah. Ribuan peluang karir untuk tambang, BUMN, toko, kantor & perusahaan resmi.",
  keywords: [
    "loker timika",
    "lowongan kerja timika",
    "loker timika terbaru",
    "loker mimika",
    "loker freeport timika",
    "loker papua tengah",
    "info loker timika hari ini",
    "lokertimika"
  ],
  alternates: {
    canonical: `${siteUrl}/jobs`,
  },
  openGraph: {
    title: "Loker Timika Terbaru & Lowongan Kerja Mimika - LokerTimika",
    description: "Cari & lamar lowongan kerja (loker) terbaru di Timika, Mimika, Freeport, & Papua Tengah.",
    url: `${siteUrl}/jobs`,
    siteName: "LokerTimika",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loker Timika Terbaru - Lowongan Kerja Timika & Mimika",
    description: "Cari & lamar lowongan kerja (loker) terbaru di Timika, Mimika, Freeport, & Papua Tengah.",
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

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Daftar Lowongan Kerja Timika & Mimika Terbaru",
    "description": "Kumpulan info loker terbaru di wilayah Timika, Mimika, Freeport, dan Papua Tengah.",
    "numberOfItems": initialJobs.length,
    "itemListElement": initialJobs.slice(0, 15).map((job, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": job.title,
      "url": `${siteUrl}/job/${job.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <JobsClient initialJobs={initialJobs} />
    </>
  );
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
