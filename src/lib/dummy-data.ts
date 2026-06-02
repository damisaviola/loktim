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
  },
  'c4': {
    id: 'c4',
    name: 'Timika Tech Solutions',
    location: 'Kuala Kencana, Timika',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=TTS',
  },
  'c5': {
    id: 'c5',
    name: 'Papua Digital Kreatif',
    location: 'Pusat Kota Timika',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=PDK',
  },
  'c6': {
    id: 'c6',
    name: 'CV Trans Logistik Papua',
    location: 'Bandara Mozes Kilangin, Timika',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=TLP',
  },
  'c7': {
    id: 'c7',
    name: 'Hotel Grand Tembagapura',
    location: 'Tembagapura, Mimika',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=HGT',
  }
};

export const jobs: Job[] = [
  {
    id: 'j1',
    title: 'Senior Heavy Equipment Mechanic',
    companyId: 'c1',
    company: companies['c1'],
    type: 'Full-time',
    category: 'Pertambangan',
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
    category: 'F&B',
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
    category: 'Administrasi',
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
  },
  {
    id: 'j4',
    title: 'IT Network Engineer',
    companyId: 'c4',
    company: companies['c4'],
    type: 'Full-time',
    category: 'IT/Teknologi',
    education: 'S1',
    experience: '1-3 Tahun',
    gender: 'Pria/Wanita',
    ageRange: 'Maks. 30 Tahun',
    salaryMin: 7000000,
    salaryMax: 12000000,
    isPremium: true,
    postedAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    description: 'Timika Tech Solutions sedang mencari IT Network Engineer untuk mengelola jaringan dan infrastruktur server lokal.',
    requirements: [
      'Lulusan S1 Teknik Informatika atau setara',
      'Memahami konfigurasi Mikrotik, Cisco, dan jaringan fiber optik',
      'Bersedia bekerja sistem on-call (siaga) jika terjadi gangguan',
      'Memiliki sertifikasi CCNA/MTCNA menjadi nilai tambah'
    ],
    contactUrl: 'mailto:karir@timikatech.co.id',
    contacts: {
      email: 'karir@timikatech.co.id'
    }
  },
  {
    id: 'j5',
    title: 'Junior Web Developer',
    companyId: 'c4',
    company: companies['c4'],
    type: 'Full-time',
    category: 'IT/Teknologi',
    education: 'S1',
    experience: 'Tanpa Pengalaman',
    gender: 'Pria/Wanita',
    ageRange: 'Maks. 25 Tahun',
    salaryMin: 5000000,
    salaryMax: 8000000,
    isPremium: false,
    postedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    description: 'Dibutuhkan Junior Web Developer untuk membantu tim mengembangkan aplikasi internal berbasis web.',
    requirements: [
      'Menguasai HTML, CSS, JavaScript',
      'Familiar dengan React.js atau Next.js',
      'Memahami penggunaan Git dan REST API',
      'Mampu bekerja dalam tim dan ingin terus belajar'
    ],
    contactUrl: 'mailto:karir@timikatech.co.id',
    contacts: {
      email: 'karir@timikatech.co.id'
    }
  },
  {
    id: 'j6',
    title: 'Desainer Grafis (Sosmed)',
    companyId: 'c5',
    company: companies['c5'],
    type: 'Freelance',
    category: 'Desain/Kreatif',
    education: 'SMA/SMK',
    experience: '1-3 Tahun',
    gender: 'Pria/Wanita',
    ageRange: 'Bebas',
    isPremium: false,
    postedAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    description: 'Papua Digital Kreatif mencari Freelance Graphic Designer untuk mendesain konten sosial media klien lokal Timika.',
    requirements: [
      'Mahir menggunakan Adobe Illustrator, Photoshop, atau Figma',
      'Memiliki sense of art yang baik dan up-to-date dengan tren',
      'Dapat bekerja dengan target waktu (deadline)',
      'Wajib melampirkan portofolio desain'
    ],
    contactUrl: 'https://wa.me/6289998887776',
    contacts: {
      whatsapp: '6289998887776'
    }
  },
  {
    id: 'j7',
    title: 'Driver Logistik (SIM B1)',
    companyId: 'c6',
    company: companies['c6'],
    type: 'Full-time',
    category: 'Logistik',
    education: 'SMA/SMK',
    experience: '1-3 Tahun',
    gender: 'Pria',
    ageRange: 'Maks. 45 Tahun',
    salaryMin: 4500000,
    salaryMax: 6000000,
    isPremium: false,
    postedAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    description: 'Dibutuhkan segera Sopir Pengiriman Logistik area Timika - Pelabuhan Pomako.',
    requirements: [
      'Memiliki SIM B1 Umum aktif',
      'Paham area jalan di Timika dan sekitarnya',
      'Sehat jasmani dan rohani, tidak memiliki riwayat penyakit berat',
      'Jujur, tepat waktu, dan bertanggung jawab'
    ],
    contactUrl: 'https://wa.me/6287776665554',
    contacts: {
      whatsapp: '6287776665554'
    }
  },
  {
    id: 'j8',
    title: 'Resepsionis Hotel',
    companyId: 'c7',
    company: companies['c7'],
    type: 'Full-time',
    category: 'Pelayanan',
    education: 'D3',
    experience: 'Tanpa Pengalaman',
    gender: 'Wanita',
    ageRange: '18 - 25 Tahun',
    salaryMin: 4000000,
    salaryMax: 5500000,
    isPremium: true,
    postedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    description: 'Hotel Grand Tembagapura sedang mencari Resepsionis (Front Desk Agent) yang ramah dan komunikatif.',
    requirements: [
      'Berpenampilan menarik dan rapi',
      'Bisa berbahasa Inggris (minimal pasif)',
      'Mampu mengoperasikan komputer (Ms. Office)',
      'Bersedia bekerja dalam sistem shift'
    ],
    contactUrl: 'mailto:hrd@hotelgrandtembagapura.com',
    contacts: {
      email: 'hrd@hotelgrandtembagapura.com'
    }
  },
  {
    id: 'j9',
    title: 'Teknisi Instalasi Listrik',
    companyId: 'c1',
    company: companies['c1'],
    type: 'Full-time',
    category: 'Konstruksi',
    education: 'SMA/SMK',
    experience: '3-5 Tahun',
    gender: 'Pria',
    ageRange: 'Maks. 35 Tahun',
    salaryMin: 8000000,
    salaryMax: 12000000,
    isPremium: false,
    postedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    description: 'Kami mencari teknisi listrik berpengalaman untuk instalasi bangunan perumahan di area Kuala Kencana.',
    requirements: [
      'Lulusan SMK Jurusan Teknik Instalasi Tenaga Listrik',
      'Mampu membaca gambar diagram kelistrikan tunggal (Single Line Diagram)',
      'Bersertifikat Ahli K3 Listrik diutamakan',
      'Siap bekerja di lapangan dengan tingkat disiplin tinggi'
    ],
    contactUrl: 'https://wa.me/6281234567890',
    contacts: {
      whatsapp: '6281234567890',
      email: 'hrd@freeport-kontraktor.com'
    }
  },
  {
    id: 'j10',
    title: 'Data Entry (Magang)',
    companyId: 'c3',
    company: companies['c3'],
    type: 'Magang',
    category: 'Administrasi',
    education: 'SMA/SMK',
    experience: 'Tanpa Pengalaman',
    gender: 'Pria/Wanita',
    ageRange: '18 - 22 Tahun',
    salaryMin: 1500000,
    salaryMax: 2000000,
    isPremium: false,
    postedAt: new Date(Date.now() - 86400000 * 6).toISOString(), // 6 days ago
    description: 'Peluang magang selama 3 bulan di bagian administrasi gudang. Cocok untuk lulusan baru yang ingin mencari pengalaman kerja.',
    requirements: [
      'Mengetik dengan cepat dan teliti',
      'Mampu menggunakan Microsoft Excel tingkat dasar',
      'Bersemangat untuk belajar dan disiplin waktu'
    ],
    contactUrl: 'mailto:hrd@majujayatm.com',
    contacts: {
      email: 'hrd@majujayatm.com'
    }
  },
  {
    id: 'j11',
    title: 'Staff Gudang & Checker',
    companyId: 'c6',
    company: companies['c6'],
    type: 'Full-time',
    category: 'Logistik',
    education: 'SMA/SMK',
    experience: '1-3 Tahun',
    gender: 'Pria',
    ageRange: 'Maks. 30 Tahun',
    salaryMin: 3500000,
    salaryMax: 4500000,
    isPremium: false,
    postedAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    description: 'Dibutuhkan staff gudang untuk menghitung, memeriksa, dan memuat barang dari bandara ke kendaraan.',
    requirements: [
      'Fisik kuat dan mampu mengangkat beban (Barang logistik)',
      'Teliti dalam menghitung jumlah barang',
      'Pernah bekerja di ekspedisi/kargo menjadi poin plus',
      'Tidak bertato dan berkelakuan baik'
    ],
    contactUrl: 'https://wa.me/6287776665554',
    contacts: {
      whatsapp: '6287776665554'
    }
  }
];
