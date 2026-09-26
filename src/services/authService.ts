import type { UserProfile } from '../types';
import { simulateDelay } from './apiConfig';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const LOCAL_STORAGE_USER_KEY = 'healthbridge_user_profile';
const LOCAL_STORAGE_SESSION_KEY = 'healthbridge_auth_session';

const DEFAULT_USER_PROFILE: UserProfile = {
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

const DEFAULT_SETTINGS: UserSettings = {
  notificationsEnabled: true,
  medicineReminders: true,
  emergencyAlerts: true,
  privacyMode: false,
  emergencyNumber: '911',
  theme: 'light',
};

// Retrieve User Profile
export const getCurrentUser = async (): Promise<UserProfile> => {
  if (isSupabaseConfigured) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return {
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'HealthBridge User',
        age: user.user_metadata?.age || 30,
        gender: user.user_metadata?.gender || 'Not specified',
        bloodGroup: user.user_metadata?.bloodGroup || 'O+',
        phone: user.phone || '+1 (555) 000-0000',
        email: user.email || '',
        emergencyContactName: user.user_metadata?.emergencyContactName || 'Emergency Contact',
        emergencyContactPhone: user.user_metadata?.emergencyContactPhone || '+1 (555) 911-0000',
        allergies: user.user_metadata?.allergies || [],
        existingConditions: user.user_metadata?.existingConditions || [],
      };
    }
  }

  // Fallback Local Storage Mode
  await simulateDelay(150);
  const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored user profile', e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(DEFAULT_USER_PROFILE));
  return { ...DEFAULT_USER_PROFILE };
};

// Supabase Sign Up
export const signUpWithSupabase = async (
  email: string,
  pass: string,
  fullName: string
): Promise<{ user: UserProfile | null; error: string | null }> => {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) return { user: null, error: error.message };

    if (data.user) {
      const newUser: UserProfile = {
        id: data.user.id,
        name: fullName,
        age: 30,
        gender: 'Not specified',
        bloodGroup: 'O+',
        phone: '',
        email,
        emergencyContactName: 'Emergency Contact',
        emergencyContactPhone: '+1 (555) 911-0000',
        allergies: [],
        existingConditions: [],
      };
      return { user: newUser, error: null };
    }
  }

  // Local Storage Mode Simulation
  await simulateDelay(500);
  const newUser: UserProfile = {
    ...DEFAULT_USER_PROFILE,
    id: `usr_${Date.now()}`,
    name: fullName,
    email: email,
  };
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
  localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, 'active');
  return { user: newUser, error: null };
};

// Supabase Sign In
export const signInWithSupabase = async (
  email: string,
  pass: string
): Promise<{ user: UserProfile | null; error: string | null }> => {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) return { user: null, error: error.message };

    if (data.user) {
      const u = await getCurrentUser();
      return { user: u, error: null };
    }
  }

  // Local Storage Mode Simulation
  await simulateDelay(500);
  const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  let user: UserProfile = DEFAULT_USER_PROFILE;
  if (stored) {
    try {
      user = JSON.parse(stored);
      user.email = email;
    } catch (e) {
      user = { ...DEFAULT_USER_PROFILE, email };
    }
  } else {
    user = { ...DEFAULT_USER_PROFILE, email };
  }
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
  localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, 'active');
  return { user, error: null };
};

// Sign Out
export const signOutUser = async (): Promise<void> => {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  await simulateDelay(200);
};

// Update User Profile
export const updateUserProfile = async (updated: Partial<UserProfile>): Promise<UserProfile> => {
  const current = await getCurrentUser();
  const merged = { ...current, ...updated };

  if (isSupabaseConfigured) {
    await supabase.auth.updateUser({
      data: {
        full_name: merged.name,
        age: merged.age,
        gender: merged.gender,
        bloodGroup: merged.bloodGroup,
        emergencyContactName: merged.emergencyContactName,
        emergencyContactPhone: merged.emergencyContactPhone,
        allergies: merged.allergies,
        existingConditions: merged.existingConditions,
      },
    });
  }

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(merged));
  return merged;
};

export const getSettings = async (): Promise<UserSettings> => {
  await simulateDelay(150);
  return { ...DEFAULT_SETTINGS };
};

export const updateSettings = async (updated: Partial<UserSettings>): Promise<UserSettings> => {
  await simulateDelay(200);
  return { ...DEFAULT_SETTINGS, ...updated };
};
