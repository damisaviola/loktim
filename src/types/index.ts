export type JobType = 'Full-time' | 'Part-time' | 'Magang' | 'Kontrak' | 'Freelance';
export type EducationLevel = 'Semua' | 'SMA/SMK' | 'D3' | 'S1' | 'S2';
export type ExperienceLevel = 'Semua' | 'Tanpa Pengalaman' | '1-3 Tahun' | '3-5 Tahun' | '> 5 Tahun';

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  location: string;
  about?: string;
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  company?: Company;
  type: JobType;
  category?: string;
  education?: EducationLevel;
  experience?: ExperienceLevel;
  gender?: 'Pria' | 'Wanita' | 'Pria/Wanita';
  ageRange?: string;
  salaryMin?: number;
  salaryMax?: number;
  isPremium: boolean;
  postedAt: string;
  description: string;
  requirements: string[];
  contactUrl?: string; // Fallback
  status?: 'pending' | 'approved' | 'rejected';
  contacts?: {
    whatsapp?: string;
    email?: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: 'hr' | 'applicant';
  companyId?: string;
}
