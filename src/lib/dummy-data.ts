import { Job, Company } from '../types';

export const companies: Record<string, Company> = {
  'c1': {
    id: 'c1',
    name: 'PT Freeport Indonesia (Kontraktor)',
    location: 'Kuala Kencana, Timika',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=FI',
  },
  'c2': {
    id: 'c2',
    name: 'Kopi Tembagapura',
    location: 'Pusat Kota Timika',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=KT',
  },
  'c3': {
    id: 'c3',
    name: 'Maju Jaya Retail Mimika',
    location: 'SP 2, Timika',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=MJ',
  }
};

export const jobs: Job[] = [
  {
    id: 'j1',
    title: 'Senior Heavy Equipment Mechanic',
    companyId: 'c1',
    company: companies['c1'],
    type: 'Full-time',
    education: 'SMA/SMK',
    experience: '3-5 Tahun',
    gender: 'Pria/Wanita',
    ageRange: 'Maks. 35 Tahun',
    salaryMin: 15000000,
    salaryMax: 25000000,
    isPremium: true,
    postedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    description: 'Kami mencari Mekanik Alat Berat berpengalaman untuk ditempatkan di area tambang. Harus siap bekerja dengan sistem roster.',
    requirements: [
      'Minimal 3 tahun pengalaman sebagai mekanik alat berat (Caterpillar, Komatsu)',
      'Memiliki sertifikat mekanik yang relevan',
      'Bersedia mematuhi standar keselamatan kerja yang ketat'
    ],
    contactUrl: 'https://wa.me/6281234567890',
    contacts: {
      whatsapp: '6281234567890',
      email: 'hrd@freeport-kontraktor.com'
    }
  },
  {
    id: 'j2',
    title: 'Barista & Kasir',
    companyId: 'c2',
    company: companies['c2'],
    type: 'Part-time',
    education: 'SMA/SMK',
    experience: '1-3 Tahun',
    gender: 'Pria/Wanita',
    ageRange: '18 - 25 Tahun',
    salaryMin: 3000000,
    salaryMax: 4500000,
    isPremium: false,
    postedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    description: 'Dibutuhkan segera Barista untuk kedai kopi kami di pusat kota Timika. Penempatan shift pagi dan malam.',
    requirements: [
      'Pria/Wanita max 28 tahun',
      'Berpengalaman minimal 1 tahun meracik kopi',
      'Domisili di Timika dan memiliki kendaraan sendiri'
    ],
    contactUrl: 'https://wa.me/6281234567891',
    contacts: {
      whatsapp: '6281234567891'
    }
  },
  {
    id: 'j3',
    title: 'Admin Gudang (Warehouse)',
    companyId: 'c3',
    company: companies['c3'],
    type: 'Full-time',
    education: 'SMA/SMK',
    experience: 'Tanpa Pengalaman',
    gender: 'Pria',
    ageRange: 'Maks. 28 Tahun',
    isPremium: true,
    postedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    description: 'Dibutuhkan segera Admin Gudang untuk penempatan di cabang SP 2, Timika. Terbuka untuk lulusan baru.',
    requirements: [
      'Lulusan SMA/SMK sederajat',
      'Bisa menggunakan komputer (Ms. Excel & Word)',
      'Jujur, teliti, dan disiplin'
    ],
    contactUrl: 'mailto:hrd@majujayatm.com',
    contacts: {
      email: 'hrd@majujayatm.com'
    }
  }
];
