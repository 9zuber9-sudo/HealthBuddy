import type { FamilyMember } from '../types';
import { simulateDelay } from './apiConfig';

const getFamilyKey = () => {
  const session = localStorage.getItem('healthbuddy_auth_session');
  return session ? `healthbuddy_family_${session}` : null;
};

const loadFromStorage = (): FamilyMember[] => {
  const key = getFamilyKey();
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (family: FamilyMember[]): void => {
  const key = getFamilyKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(family));
};

export const getFamilyMembers = async (): Promise<FamilyMember[]> => {
  await simulateDelay(250);
  return loadFromStorage();
};

export const addFamilyMember = async (member: Omit<FamilyMember, 'id'>): Promise<FamilyMember> => {
  await simulateDelay(400);
  const newMember: FamilyMember = {
    ...member,
    id: `fam-${Date.now()}`,
  };
  const family = loadFromStorage();
  family.push(newMember);
  saveToStorage(family);
  return newMember;
};

export const updateFamilyMember = async (id: string, updated: Partial<FamilyMember>): Promise<FamilyMember> => {
  await simulateDelay(300);
  const family = loadFromStorage();
  let found: FamilyMember | null = null;
  const updatedList = family.map((m) => {
    if (m.id === id) {
      found = { ...m, ...updated };
      return found;
    }
    return m;
  });
  if (!found) throw new Error('Family member not found');
  saveToStorage(updatedList);
  return found;
};

export const deleteFamilyMember = async (id: string): Promise<void> => {
  await simulateDelay(300);
  const family = loadFromStorage();
  saveToStorage(family.filter((m) => m.id !== id));
};
