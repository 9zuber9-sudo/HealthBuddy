import type { Medicine } from '../types';
import { simulateDelay } from './apiConfig';

const getMedicineKey = () => {
  const session = localStorage.getItem('healthbuddy_auth_session');
  return session ? `healthbuddy_medicines_${session}` : null;
};

const loadFromStorage = (): Medicine[] => {
  const key = getMedicineKey();
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (medicines: Medicine[]): void => {
  const key = getMedicineKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(medicines));
};

export const getMedicines = async (): Promise<Medicine[]> => {
  await simulateDelay(250);
  return loadFromStorage();
};

export const addMedicine = async (med: Omit<Medicine, 'id'>): Promise<Medicine> => {
  await simulateDelay(400);
  const newMed: Medicine = {
    ...med,
    id: `med-${Date.now()}`,
  };
  const medicines = loadFromStorage();
  medicines.unshift(newMed);
  saveToStorage(medicines);
  return newMed;
};

export const updateMedicine = async (id: string, updated: Partial<Medicine>): Promise<Medicine> => {
  await simulateDelay(300);
  const medicines = loadFromStorage();
  let found: Medicine | null = null;
  const updatedList = medicines.map((m) => {
    if (m.id === id) {
      found = { ...m, ...updated };
      return found;
    }
    return m;
  });
  if (!found) throw new Error('Medicine not found');
  saveToStorage(updatedList);
  return found;
};

export const toggleMedicineStatus = async (id: string): Promise<Medicine> => {
  await simulateDelay(200);
  const medicines = loadFromStorage();
  let updatedMed: Medicine | null = null;
  const updatedList = medicines.map((m) => {
    if (m.id === id) {
      const nextStatus = m.status === 'taken' ? 'pending' : 'taken';
      updatedMed = { ...m, status: nextStatus };
      return updatedMed;
    }
    return m;
  });
  if (!updatedMed) throw new Error('Medicine not found');
  saveToStorage(updatedList);
  return updatedMed;
};

export const deleteMedicine = async (id: string): Promise<void> => {
  await simulateDelay(300);
  const medicines = loadFromStorage();
  saveToStorage(medicines.filter((m) => m.id !== id));
};
