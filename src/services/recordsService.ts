import type { HealthRecord } from '../types';
import { simulateDelay, API_BASE_URL, IS_MOCK_MODE } from './apiConfig';

const MOCK_RECORDS: HealthRecord[] = [
  {
    id: 'rec-1',
    name: 'Comprehensive Blood Test & Lipid Panel',
    category: 'Lab Reports',
    date: '2026-09-15',
    doctorOrHospital: 'City General Diagnostics',
    fileName: 'lipid_panel_sep2026.pdf',
    fileSize: '1.4 MB',
    notes: 'Total Cholesterol 185 mg/dL. Normal range across all metabolic markers.',
  },
  {
    id: 'rec-2',
    name: 'Amoxicillin & Allergy Relief Prescription',
    category: 'Prescriptions',
    date: '2026-08-28',
    doctorOrHospital: 'Dr. Sharma (Primary Care)',
    fileName: 'prescription_dr_sharma.pdf',
    fileSize: '420 KB',
    notes: 'Prescribed for acute sinonasal congestion. Course of 7 days.',
  },
  {
    id: 'rec-3',
    name: 'Annual COVID-19 & Flu Vaccine Booster',
    category: 'Vaccinations',
    date: '2026-06-10',
    doctorOrHospital: 'Community Health Clinic',
    fileName: 'vaccine_certificate_2026.pdf',
    fileSize: '890 KB',
    notes: 'Administered in left arm. Next booster recommended in 12 months.',
  },
  {
    id: 'rec-4',
    name: 'Penicillin Allergy Clinical Record',
    category: 'Allergies',
    date: '2025-11-04',
    doctorOrHospital: 'St. Jude Immunology Center',
    fileName: 'penicillin_allergy_assessment.pdf',
    fileSize: '650 KB',
    notes: 'Confirmed IgE mediated response. Severe hives and mild wheezing history.',
  },
  {
    id: 'rec-5',
    name: 'Echocardiogram & Cardiac Stress Test',
    category: 'Medical Documents',
    date: '2025-05-18',
    doctorOrHospital: 'Dr. Rachel Vance (Cardiology)',
    fileName: 'cardiac_echo_report.pdf',
    fileSize: '3.2 MB',
    notes: 'Normal left ventricular ejection fraction (62%). No wall motion abnormalities.',
  },
  {
    id: 'rec-6',
    name: 'Father\'s Eye Pressure & Glaucoma Screen',
    category: 'Lab Reports',
    date: '2026-07-22',
    doctorOrHospital: 'VisionCare Eye Institute',
    fileName: 'father_iop_screening.pdf',
    fileSize: '1.1 MB',
    notes: 'Intraocular pressure stable at 14 mmHg bilateral.',
    familyMemberId: 'fam-2',
    familyMemberName: 'Father (Age 52)',
  },
];

let memoryRecords = [...MOCK_RECORDS];

export const getHealthRecords = async (): Promise<HealthRecord[]> => {
  await simulateDelay(250);
  if (!IS_MOCK_MODE) {
    const res = await fetch(`${API_BASE_URL}/records`);
    return await res.json();
  }
  return [...memoryRecords];
};

export const uploadHealthRecord = async (record: Omit<HealthRecord, 'id'>): Promise<HealthRecord> => {
  await simulateDelay(600);
  const newRecord: HealthRecord = {
    ...record,
    id: `rec-${Date.now()}`,
    fileName: record.fileName || `${record.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    fileSize: record.fileSize || '1.2 MB',
  };

  if (!IS_MOCK_MODE) {
    const res = await fetch(`${API_BASE_URL}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    });
    return await res.json();
  }

  memoryRecords = [newRecord, ...memoryRecords];
  return newRecord;
};

export const deleteHealthRecord = async (id: string): Promise<void> => {
  await simulateDelay(300);
  memoryRecords = memoryRecords.filter((r) => r.id !== id);
};
