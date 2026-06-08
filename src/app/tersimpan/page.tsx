import { getApprovedJobsAction } from '@/app/actions/job';
import { jobs as dummyJobs } from '@/lib/dummy-data';
import { Job } from '@/types';
import { SavedClient } from './SavedClient';
import { MainLayoutWrapper } from '@/components/MainLayoutWrapper';

export const metadata = {
  title: 'Loker Tersimpan',
  description: 'Daftar lowongan kerja yang Anda simpan.',
};

export default async function TersimpanPage() {
  let initialJobs: Job[] = [];
  
  try {
    const fetchedJobs = await getApprovedJobsAction();
    initialJobs = [...(fetchedJobs as unknown as Job[]), ...dummyJobs];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    initialJobs = dummyJobs;
  }

  return (
    <main className="bg-background">
      <SavedClient initialJobs={initialJobs} />
    </main>
  );
}
