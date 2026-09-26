import type { HealthcareFacility, FacilityType } from '../types';
import { simulateDelay, API_BASE_URL, IS_MOCK_MODE } from './apiConfig';

const MOCK_FACILITIES: HealthcareFacility[] = [
  {
    id: 'fac-1',
    name: 'St. Jude Emergency Hospital & Trauma Center',
    type: 'hospital',
    distanceKm: 1.2,
    address: '742 Evergreen Terrace, Medical District',
    phone: '+1 (555) 911-0000',
    isOpenNow: true,
    isEmergencyFacility: true,
    hours: '24/7 Open',
    rating: 4.8,
    coordinates: { lat: 37.7749, lng: -122.4194 },
  },
  {
    id: 'fac-2',
    name: 'Walgreens 24hr Pharmacy & Express Care',
    type: 'pharmacy',
    distanceKm: 0.5,
    address: '108 Market Street, Downtown',
    phone: '+1 (555) 321-7654',
    isOpenNow: true,
    isEmergencyFacility: false,
    hours: '24 Hours',
    rating: 4.6,
    coordinates: { lat: 37.7785, lng: -122.4150 },
  },
  {
    id: 'fac-3',
    name: 'Quest Diagnostics Clinical Reference Lab',
    type: 'lab',
    distanceKm: 2.1,
    address: '450 Sutter St, Suite 1200',
    phone: '+1 (555) 888-2468',
    isOpenNow: true,
    isEmergencyFacility: false,
    hours: '7:00 AM - 6:00 PM',
    rating: 4.5,
    coordinates: { lat: 37.7891, lng: -122.4082 },
  },
  {
    id: 'fac-4',
    name: 'Cedar Sinai Urgent Care & General Clinic',
    type: 'clinic',
    distanceKm: 3.4,
    address: '1200 Geary Blvd, Mid-Market',
    phone: '+1 (555) 444-1234',
    isOpenNow: true,
    isEmergencyFacility: true,
    hours: '8:00 AM - 10:00 PM',
    rating: 4.7,
    coordinates: { lat: 37.7842, lng: -122.4270 },
  },
  {
    id: 'fac-5',
    name: 'CVS Pharmacy & HealthHUB',
    type: 'pharmacy',
    distanceKm: 1.8,
    address: '601 Van Ness Ave',
    phone: '+1 (555) 777-9911',
    isOpenNow: false,
    isEmergencyFacility: false,
    hours: '8:00 AM - 9:00 PM',
    rating: 4.3,
    coordinates: { lat: 37.7812, lng: -122.4211 },
  },
  {
    id: 'fac-6',
    name: 'Metropolitan General Hospital',
    type: 'hospital',
    distanceKm: 4.5,
    address: '1001 Potrero Ave',
    phone: '+1 (555) 222-3344',
    isOpenNow: true,
    isEmergencyFacility: true,
    hours: '24/7 Open',
    rating: 4.9,
    coordinates: { lat: 37.7558, lng: -122.4045 },
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
      const match = fac.name.toLowerCase().includes(q) || fac.address.toLowerCase().includes(q) || fac.type.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
};
