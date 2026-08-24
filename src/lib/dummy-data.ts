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

export const jobs: Job[] = [];
