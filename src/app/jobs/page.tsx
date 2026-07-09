import { Suspense } from 'react';
import { getApprovedJobsAction } from '@/app/actions/job';
import { jobs as dummyJobs } from '@/lib/dummy-data';
import { Job } from '@/types';
import { JobsClient } from './JobsClient';
import { HomeLoadingSkeleton } from '@/components/HomeLoadingSkeleton';

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
    <main className="bg-slate-50/50 min-h-screen pt-4">
      <Suspense fallback={<HomeLoadingSkeleton />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
