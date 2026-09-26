export type PageId = 
  | 'landing' 
  | 'auth'
  | 'dashboard' 
  | 'ai-guide' 
  | 'emergency' 
  | 'medicines' 
  | 'records' 
  | 'family' 
  | 'healthcare' 
  | 'profile';

export type MedicineStatus = 'taken' | 'pending';

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDoseTime: string;
  status: MedicineStatus;
  reminderTime: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  familyMemberId?: string;
  familyMemberName?: string;
}

export interface Appointment {
  id: string;
  title: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  type: 'In-person' | 'Virtual';
}

export type RecordCategory = 
  | 'Prescriptions' 
  | 'Lab Reports' 
  | 'Vaccinations' 
  | 'Allergies' 
  | 'Medical Documents' 
  | 'Other';

export interface HealthRecord {
  id: string;
  name: string;
  category: RecordCategory;
  date: string;
  doctorOrHospital: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  notes?: string;
  familyMemberId?: string;
  familyMemberName?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  dateOfBirth?: string;
  gender: string;
  emergencyContact: string;
  knownAllergies: string[];
  existingConditions: string[];
  avatarUrl?: string;
}

export type FacilityType = 'hospital' | 'pharmacy' | 'lab' | 'clinic';

export interface HealthcareFacility {
  id: string;
  name: string;
  type: FacilityType;
  distanceKm: number;
  address: string;
  phone: string;
  isOpenNow: boolean;
  isEmergencyFacility: boolean;
  hours: string;
  rating?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export type UrgencyLevel = 'monitor' | 'consult' | 'emergency';

export interface SymptomInput {
  symptoms: string[];
  age?: number;
  duration?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  existingConditions?: string;
  currentMedicines?: string;
}

export interface AIAnalysisResult {
  symptoms: string[];
  summary: string;
  generalInfo: string[];
  urgencyLevel: UrgencyLevel;
  recommendations: string[];
  urgencyMessage: string;
  disclaimer: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  allergies: string[];
  existingConditions: string[];
}

export interface ActivityLog {
  id: string;
  type: 'medicine' | 'prescription' | 'appointment' | 'record' | 'emergency';
  title: string;
  description: string;
  timestamp: string;
  iconName?: string;
}

export interface FirstAidGuide {
  id: string;
  title: string;
  icon: string;
  category: string;
  urgency: 'critical' | 'high' | 'medium';
  steps: string[];
  warnings: string[];
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}
