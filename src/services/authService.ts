import type { UserProfile } from '../types';
import { simulateDelay, API_BASE_URL, IS_MOCK_MODE } from './apiConfig';

const MOCK_USER_PROFILE: UserProfile = {
  id: 'usr_101',
  name: 'Alex Morgan',
  age: 34,
  gender: 'Non-binary / Male',
  bloodGroup: 'O+',
  phone: '+1 (555) 234-5678',
  email: 'alex.morgan@healthbridge.io',
  emergencyContactName: 'Sarah Morgan (Sister)',
  emergencyContactPhone: '+1 (555) 987-6543',
  allergies: ['Penicillin', 'Peanuts', 'Dust Mites'],
  existingConditions: ['Asthma (Mild)', 'Hypertension'],
};

export interface UserSettings {
  notificationsEnabled: boolean;
  medicineReminders: boolean;
  emergencyAlerts: boolean;
  privacyMode: boolean;
  emergencyNumber: string;
  theme: 'light' | 'dark' | 'system';
}

const MOCK_SETTINGS: UserSettings = {
  notificationsEnabled: true,
  medicineReminders: true,
  emergencyAlerts: true,
  privacyMode: false,
  emergencyNumber: '911',
  theme: 'light',
};

export const getCurrentUser = async (): Promise<UserProfile> => {
  await simulateDelay(250);
  if (!IS_MOCK_MODE) {
    const res = await fetch(`${API_BASE_URL}/user/profile`);
    return await res.json();
  }
  return { ...MOCK_USER_PROFILE };
};

export const updateUserProfile = async (updated: Partial<UserProfile>): Promise<UserProfile> => {
  await simulateDelay(350);
  if (!IS_MOCK_MODE) {
    const res = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    return await res.json();
  }
  Object.assign(MOCK_USER_PROFILE, updated);
  return { ...MOCK_USER_PROFILE };
};

export const getSettings = async (): Promise<UserSettings> => {
  await simulateDelay(200);
  return { ...MOCK_SETTINGS };
};

export const updateSettings = async (updated: Partial<UserSettings>): Promise<UserSettings> => {
  await simulateDelay(300);
  Object.assign(MOCK_SETTINGS, updated);
  return { ...MOCK_SETTINGS };
};
