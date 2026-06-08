import { Suspense } from 'react';
import { getApprovedJobsAction } from '@/app/actions/job';
import { jobs as dummyJobs } from '@/lib/dummy-data';
import { Job } from '@/types';
import { HomeClient } from './HomeClient';
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

  return <HomeClient initialJobs={initialJobs} />;
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<HomeLoadingSkeleton />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
