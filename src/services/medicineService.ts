import type { Medicine } from '../types';
import { simulateDelay, API_BASE_URL, IS_MOCK_MODE } from './apiConfig';

const MOCK_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Paracetamol',
    dosage: '500 mg',
    frequency: 'As needed (max 3x daily)',
    nextDoseTime: '10:00 AM',
    status: 'pending',
    reminderTime: '10:00 AM',
    startDate: '2026-09-20',
    endDate: '2026-09-30',
    notes: 'Take with full glass of water after food.',
  },
  {
    id: 'med-2',
    name: 'Vitamin D3',
    dosage: '1000 IU',
    frequency: 'Once daily',
    nextDoseTime: '8:00 PM',
    status: 'taken',
    reminderTime: '08:00 PM',
    startDate: '2026-01-01',
    notes: 'Fat soluble, best taken with dinner.',
  },
  {
    id: 'med-3',
    name: 'Amoxicillin',
    dosage: '500 mg',
    frequency: 'Twice daily',
    nextDoseTime: '8:00 PM',
    status: 'pending',
    reminderTime: '08:00 PM',
    startDate: '2026-09-24',
    endDate: '2026-10-01',
    notes: 'Finish full course prescribed by Dr. Sharma.',
  },
  {
    id: 'med-4',
    name: 'Metformin',
    dosage: '850 mg',
    frequency: 'Twice daily with meals',
    nextDoseTime: '1:00 PM',
    status: 'taken',
    reminderTime: '01:00 PM',
    startDate: '2025-11-15',
    notes: 'For blood sugar management.',
    familyMemberId: 'fam-3',
    familyMemberName: 'Grandmother (Age 72)',
  },
  {
    id: 'med-5',
    name: 'Lisinopril',
    dosage: '10 mg',
    frequency: 'Once daily (morning)',
    nextDoseTime: '9:00 AM',
    status: 'taken',
    reminderTime: '09:00 AM',
    startDate: '2024-05-10',
    notes: 'Blood pressure maintenance.',
    familyMemberId: 'fam-2',
    familyMemberName: 'Father (Age 52)',
  },
];

let memoryMedicines = [...MOCK_MEDICINES];

export const getMedicines = async (): Promise<Medicine[]> => {
  await simulateDelay(250);
  if (!IS_MOCK_MODE) {
    const res = await fetch(`${API_BASE_URL}/medicines`);
    return await res.json();
  }
  return [...memoryMedicines];
};

export const addMedicine = async (med: Omit<Medicine, 'id'>): Promise<Medicine> => {
  await simulateDelay(400);
  const newMed: Medicine = {
    ...med,
    id: `med-${Date.now()}`,
  };

  if (!IS_MOCK_MODE) {
    const res = await fetch(`${API_BASE_URL}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMed),
    });
    return await res.json();
  }

  memoryMedicines = [newMed, ...memoryMedicines];
  return newMed;
};

export const updateMedicine = async (id: string, updated: Partial<Medicine>): Promise<Medicine> => {
  await simulateDelay(300);
  let found: Medicine | null = null;
  memoryMedicines = memoryMedicines.map((m) => {
    if (m.id === id) {
      found = { ...m, ...updated };
      return found;
    }
    return m;
  });
  if (!found) throw new Error('Medicine not found');
  return found;
};

export const toggleMedicineStatus = async (id: string): Promise<Medicine> => {
  await simulateDelay(200);
  let updatedMed: Medicine | null = null;
  memoryMedicines = memoryMedicines.map((m) => {
    if (m.id === id) {
      const nextStatus = m.status === 'taken' ? 'pending' : 'taken';
      updatedMed = { ...m, status: nextStatus };
      return updatedMed;
    }
    return m;
  });
  if (!updatedMed) throw new Error('Medicine not found');
  return updatedMed;
};

export const deleteMedicine = async (id: string): Promise<void> => {
  await simulateDelay(300);
  memoryMedicines = memoryMedicines.filter((m) => m.id !== id);
};
