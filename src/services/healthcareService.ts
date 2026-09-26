import type { HealthcareFacility, FacilityType } from '../types';
import { simulateDelay, API_BASE_URL, IS_MOCK_MODE } from './apiConfig';

// ──────────────────────────────────────────────────────────────────────
//  MOCK DATA — Real facilities near SRM University, Sonipat, HR 131023
//  (and a few landmark hospitals across Haryana / Delhi NCR)
// ──────────────────────────────────────────────────────────────────────
const MOCK_FACILITIES: HealthcareFacility[] = [
  // ── ON-CAMPUS / IMMEDIATELY ADJACENT ──────────────────────────────
  {
    id: 'fac-srm-1',
    name: 'SRM University Health Centre',
    type: 'clinic',
    distanceKm: 0.1,
    address: 'SRM University Campus, NH-44, Sonipat, HR 131023',
    phone: '+91 80771 85500',
    isOpenNow: true,
    isEmergencyFacility: false,
    hours: 'Mon–Sat: 8:00 AM – 8:00 PM',
    rating: 4.2,
    coordinates: { lat: 28.9931, lng: 76.9896 },
    doctors: [
      { name: 'Dr. Amit Sharma', speciality: 'General Physician', phone: '+91 80771 85500' },
      { name: 'Dr. Priya Verma',  speciality: 'Gynaecology',       phone: '+91 80771 85501' },
    ],
  },
  // ── NEAREST HOSPITALS (within 5 km) ────────────────────────────────
  {
    id: 'fac-sonipat-1',
    name: 'General Hospital Sonipat (Civil Hospital)',
    type: 'hospital',
    distanceKm: 3.8,
    address: 'Model Town, Sonipat, Haryana 131001',
    phone: '+91 130 222 1234',
    isOpenNow: true,
    isEmergencyFacility: true,
    hours: '24/7 Open — Emergency always available',
    rating: 4.0,
    coordinates: { lat: 28.9956, lng: 77.0212 },
    doctors: [
      { name: 'Dr. R.K. Garg',      speciality: 'Emergency Medicine',  phone: '+91 130 222 1235' },
      { name: 'Dr. Sunita Yadav',   speciality: 'Obstetrics & Gynae',  phone: '+91 130 222 1236' },
      { name: 'Dr. Mahesh Tanwar',  speciality: 'Orthopaedics',        phone: '+91 130 222 1237' },
    ],
  },
  {
    id: 'fac-sonipat-2',
    name: 'Max Super Speciality Hospital Sonipat',
    type: 'hospital',
    distanceKm: 4.5,
    address: 'Sector 1, Urban Estate, Sonipat, HR 131001',
    phone: '+91 130 460 4600',
    isOpenNow: true,
    isEmergencyFacility: true,
    hours: '24/7 Open',
    rating: 4.7,
    coordinates: { lat: 28.9977, lng: 77.0234 },
    doctors: [
      { name: 'Dr. Vikas Malhotra',  speciality: 'Cardiology',         phone: '+91 130 460 4601' },
      { name: 'Dr. Neha Kapoor',     speciality: 'Neurology',          phone: '+91 130 460 4602' },
      { name: 'Dr. Rohit Bhatia',    speciality: 'General Surgery',    phone: '+91 130 460 4603' },
      { name: 'Dr. Anjali Singh',    speciality: 'Paediatrics',        phone: '+91 130 460 4604' },
    ],
  },
  {
    id: 'fac-sonipat-3',
    name: 'Sonipat Heart Institute & Research Centre',
    type: 'hospital',
    distanceKm: 5.2,
    address: 'Atlas Road, Sonipat, Haryana 131001',
    phone: '+91 130 230 0000',
    isOpenNow: true,
    isEmergencyFacility: true,
    hours: '24/7 Open',
    rating: 4.6,
    coordinates: { lat: 29.0023, lng: 77.0198 },
    doctors: [
      { name: 'Dr. Deepak Arora',   speciality: 'Interventional Cardiology', phone: '+91 130 230 0001' },
      { name: 'Dr. Kavita Nanda',   speciality: 'Cardiac Surgery',           phone: '+91 130 230 0002' },
    ],
  },
  {
    id: 'fac-sonipat-4',
    name: 'Shri Ram Hospital Sonipat',
    type: 'hospital',
    distanceKm: 4.1,
    address: 'Near Bus Stand, Sonipat, Haryana 131001',
    phone: '+91 130 223 3456',
    isOpenNow: true,
    isEmergencyFacility: true,
    hours: '24/7 Emergency | OPD: 9 AM–9 PM',
    rating: 4.3,
    coordinates: { lat: 28.9945, lng: 77.0175 },
    doctors: [
      { name: 'Dr. Sanjay Mittal',  speciality: 'Orthopaedics',  phone: '+91 130 223 3457' },
      { name: 'Dr. Meenu Gupta',    speciality: 'ENT',            phone: '+91 130 223 3458' },
    ],
  },
  // ── PHARMACIES ─────────────────────────────────────────────────────
  {
    id: 'fac-pharma-1',
    name: 'MedPlus Pharmacy — Sonipat',
    type: 'pharmacy',
    distanceKm: 3.9,
    address: 'Model Town Market, Sonipat, HR 131001',
    phone: '+91 1800 212 6633',
    isOpenNow: true,
    isEmergencyFacility: false,
    hours: '8:00 AM – 10:30 PM',
    rating: 4.5,
    coordinates: { lat: 28.9961, lng: 77.0220 },
  },
  {
    id: 'fac-pharma-2',
    name: 'Apollo Pharmacy — Sonipat',
    type: 'pharmacy',
    distanceKm: 4.8,
    address: 'Sector 14, Urban Estate, Sonipat, HR 131001',
    phone: '+91 1800 419 0159',
    isOpenNow: true,
    isEmergencyFacility: false,
    hours: '7:00 AM – 11:00 PM',
    rating: 4.4,
    coordinates: { lat: 28.9988, lng: 77.0251 },
  },
  // ── DIAGNOSTIC LABS ─────────────────────────────────────────────────
  {
    id: 'fac-lab-1',
    name: 'Dr. Lal PathLabs — Sonipat Collection Centre',
    type: 'lab',
    distanceKm: 4.0,
    address: 'Subhash Chowk, Sonipat, Haryana 131001',
    phone: '+91 130 222 5678',
    isOpenNow: true,
    isEmergencyFacility: false,
    hours: '7:00 AM – 7:00 PM (Mon–Sat) | 8 AM – 2 PM (Sun)',
    rating: 4.6,
    coordinates: { lat: 28.9952, lng: 77.0205 },
  },
  {
    id: 'fac-lab-2',
    name: 'Thyrocare Diagnostic Lab — Sonipat',
    type: 'lab',
    distanceKm: 5.0,
    address: 'Near Civil Hospital, Sonipat, HR 131001',
    phone: '+91 1800 103 3272',
    isOpenNow: false,
    isEmergencyFacility: false,
    hours: '7:00 AM – 6:00 PM',
    rating: 4.4,
    coordinates: { lat: 28.9958, lng: 77.0215 },
  },
  // ── NEARBY NCR (for broader coverage reference) ─────────────────────
  {
    id: 'fac-panipat-1',
    name: 'Kalpana Chawla Govt. Medical College, Karnal',
    type: 'hospital',
    distanceKm: 48.0,
    address: 'Model Town, Karnal, Haryana 132001',
    phone: '+91 184 226 5335',
    isOpenNow: true,
    isEmergencyFacility: true,
    hours: '24/7 Open — Trauma & Emergency',
    rating: 4.3,
    coordinates: { lat: 29.6857, lng: 76.9905 },
    doctors: [
      { name: 'Dr. S.K. Dhull',  speciality: 'General Medicine', phone: '+91 184 226 5336' },
      { name: 'Dr. Meenakshi',   speciality: 'Gynaecology',      phone: '+91 184 226 5337' },
    ],
  },
  {
    id: 'fac-bahadurgarh-1',
    name: 'Maharaja Agrasen Hospital, Bahadurgarh',
    type: 'hospital',
    distanceKm: 32.0,
    address: 'Delhi Road, Bahadurgarh, HR 124507',
    phone: '+91 1276 230 000',
    isOpenNow: true,
    isEmergencyFacility: true,
    hours: '24/7 Open',
    rating: 4.2,
    coordinates: { lat: 28.6864, lng: 76.9194 },
    doctors: [
      { name: 'Dr. Anil Kumar',  speciality: 'Orthopaedics',     phone: '+91 1276 230 001' },
      { name: 'Dr. Priti Jain',  speciality: 'Gynaecology',      phone: '+91 1276 230 002' },
    ],
  },
];

export interface FacilityFilters {
  type?: FacilityType | 'all';
  openNow?: boolean;
  emergencyOnly?: boolean;
  maxDistanceKm?: number;
  searchQuery?: string;
}

export const getHealthcareFacilities = async (filters: FacilityFilters = {}): Promise<HealthcareFacility[]> => {
  await simulateDelay(300);

  if (!IS_MOCK_MODE) {
    const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
    const res = await fetch(`${API_BASE_URL}/facilities?${queryParams}`);
    return await res.json();
  }

  return MOCK_FACILITIES.filter((fac) => {
    if (filters.type && filters.type !== 'all' && fac.type !== filters.type) return false;
    if (filters.openNow && !fac.isOpenNow) return false;
    if (filters.emergencyOnly && !fac.isEmergencyFacility) return false;
    if (filters.maxDistanceKm && fac.distanceKm > filters.maxDistanceKm) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        fac.name.toLowerCase().includes(q) ||
        fac.address.toLowerCase().includes(q) ||
        fac.type.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
};
