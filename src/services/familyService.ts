import type { FamilyMember } from '../types';
import { simulateDelay, API_BASE_URL, IS_MOCK_MODE } from './apiConfig';

const MOCK_FAMILY: FamilyMember[] = [
  {
    id: 'fam-1',
    name: 'Elena Morgan',
    relationship: 'Mother',
    age: 48,
    dateOfBirth: '1978-04-12',
    gender: 'Female',
    emergencyContact: '+1 (555) 432-8765',
    knownAllergies: ['Sulfa drugs', 'Latex'],
    existingConditions: ['Type 2 Diabetes', 'Hypothyroidism'],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'fam-2',
    name: 'David Morgan',
    relationship: 'Father',
    age: 52,
    dateOfBirth: '1974-09-05',
    gender: 'Male',
    emergencyContact: '+1 (555) 345-6789',
    knownAllergies: ['Aspirin', 'Bee stings'],
    existingConditions: ['Hypertension', 'High Cholesterol'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'fam-3',
    name: 'Clara Morgan',
    relationship: 'Grandmother',
    age: 72,
    dateOfBirth: '1954-01-20',
    gender: 'Female',
    emergencyContact: '+1 (555) 901-2345',
    knownAllergies: ['Codeine', 'Seafood'],
    existingConditions: ['Osteoarthritis', 'Mild Arrhythmia'],
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
  },
];

let memoryFamily = [...MOCK_FAMILY];

export const getFamilyMembers = async (): Promise<FamilyMember[]> => {
  await simulateDelay(250);
  if (!IS_MOCK_MODE) {
    const res = await fetch(`${API_BASE_URL}/family`);
    return await res.json();
  }
  return [...memoryFamily];
};

export const addFamilyMember = async (member: Omit<FamilyMember, 'id'>): Promise<FamilyMember> => {
  await simulateDelay(400);
  const newMember: FamilyMember = {
    ...member,
    id: `fam-${Date.now()}`,
  };

  if (!IS_MOCK_MODE) {
    const res = await fetch(`${API_BASE_URL}/family`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMember),
    });
    return await res.json();
  }

  memoryFamily = [...memoryFamily, newMember];
  return newMember;
};

export const updateFamilyMember = async (id: string, updated: Partial<FamilyMember>): Promise<FamilyMember> => {
  await simulateDelay(300);
  let found: FamilyMember | null = null;
  memoryFamily = memoryFamily.map((m) => {
    if (m.id === id) {
      found = { ...m, ...updated };
      return found;
    }
    return m;
  });
  if (!found) throw new Error('Family member not found');
  return found;
};

export const deleteFamilyMember = async (id: string): Promise<void> => {
  await simulateDelay(300);
  memoryFamily = memoryFamily.filter((m) => m.id !== id);
};
