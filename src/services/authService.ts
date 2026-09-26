import type { UserProfile } from '../types';
import { simulateDelay } from './apiConfig';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const LOCAL_STORAGE_USER_KEY = 'healthbuddy_user_profile';
const LOCAL_STORAGE_SESSION_KEY = 'healthbuddy_auth_session';
const LOCAL_STORAGE_ACCOUNTS_KEY = 'healthbuddy_user_accounts';

export interface StoredAccount {
  email: string;
  password: string;
  name: string;
  profile: UserProfile;
}



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
  emergencyNumber: '112',
  theme: 'light',
};

// Helper: Get all registered accounts from local storage
const getRegisteredAccounts = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY);
    if (raw) {
      const accounts: StoredAccount[] = JSON.parse(raw);
      if (Array.isArray(accounts)) {
        return accounts;
      }
    }
  } catch (e) {
    console.error('Error reading registered accounts', e);
  }
  return [];
};

// Helper: Save accounts list
const saveRegisteredAccounts = (accounts: StoredAccount[]): void => {
  localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
};

// Retrieve User Profile (returns null if not logged in)
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return {
          id: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'HealthBuddy User',
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
    } catch (err) {
      console.warn('Supabase auth check failed:', err);
    }
  }

  // Fallback Local Storage Mode
  await simulateDelay(100);
  const session = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
  if (!session) {
    return null;
  }

  const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored user profile', e);
    }
  }
  
  return null;
};

// Supabase / Local Sign Up
export const signUpWithSupabase = async (
  email: string,
  pass: string,
  fullName: string
): Promise<{ user: UserProfile | null; error: string | null }> => {
  const normalizedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
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
        email: normalizedEmail,
        emergencyContactName: 'Emergency Contact',
        emergencyContactPhone: '+1 (555) 911-0000',
        allergies: [],
        existingConditions: [],
      };
      return { user: newUser, error: null };
    }
  }

  // Local Storage Mode Simulation
  await simulateDelay(350);

  const accounts = getRegisteredAccounts();
  const existing = accounts.find((acc) => acc.email.toLowerCase() === normalizedEmail);

  if (existing) {
    return {
      user: null,
      error: 'An account with this email address already exists. Please sign in instead.',
    };
  }

  const newUser: UserProfile = {
    id: `usr_${Date.now()}`,
    name: fullName.trim(),
    age: 30,
    gender: 'Not specified',
    bloodGroup: 'O+',
    phone: '',
    email: normalizedEmail,
    emergencyContactName: 'Emergency Contact',
    emergencyContactPhone: '+1 (555) 911-0000',
    allergies: [],
    existingConditions: [],
  };

  const newAccount: StoredAccount = {
    email: normalizedEmail,
    password: pass,
    name: fullName.trim(),
    profile: newUser,
  };

  accounts.push(newAccount);
  saveRegisteredAccounts(accounts);

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
  localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, newUser.id);

  return { user: newUser, error: null };
};

// Supabase / Local Sign In
export const signInWithSupabase = async (
  email: string,
  pass: string
): Promise<{ user: UserProfile | null; error: string | null }> => {
  const normalizedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: pass,
    });

    if (error) return { user: null, error: error.message };

    if (data.user) {
      const u = await getCurrentUser();
      return { user: u, error: null };
    }
  }

  // Local Storage Mode Simulation
  await simulateDelay(350);

  const accounts = getRegisteredAccounts();
  const matched = accounts.find((acc) => acc.email.toLowerCase() === normalizedEmail);

  if (!matched) {
    return {
      user: null,
      error: 'No account found with this email address. Please register first.',
    };
  }

  if (matched.password !== pass) {
    return {
      user: null,
      error: 'Invalid password. Please check your credentials and try again.',
    };
  }

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(matched.profile));
  localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, matched.profile.id);

  return { user: matched.profile, error: null };
};

// Sign Out
export const signOutUser = async (): Promise<void> => {
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout failed', e);
    }
  }
  localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  await simulateDelay(150);
};

// Google OAuth Sign-In (Supabase handles the redirect)
export const signInWithGoogle = async (): Promise<{ error: string | null }> => {
  if (!isSupabaseConfigured) {
    return {
      error: 'Google Sign-In requires Supabase to be configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
    };
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,   // redirect back to the app after Google login
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) return { error: error.message };
  return { error: null };
};

// Update User Profile
export const updateUserProfile = async (updated: Partial<UserProfile>): Promise<UserProfile> => {
  const current = await getCurrentUser();
  if (!current) throw new Error('No user logged in');
  const merged = { ...current, ...updated };

  if (isSupabaseConfigured) {
    try {
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
    } catch (e) {
      console.warn('Supabase profile update warning', e);
    }
  }

  // Update in accounts array as well
  const accounts = getRegisteredAccounts();
  const index = accounts.findIndex((acc) => acc.email.toLowerCase() === merged.email.toLowerCase());
  if (index !== -1) {
    accounts[index].profile = merged;
    accounts[index].name = merged.name;
    saveRegisteredAccounts(accounts);
  }

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(merged));
  return merged;
};

export const getSettings = async (): Promise<UserSettings> => {
  await simulateDelay(100);
  return { ...DEFAULT_SETTINGS };
};

export const updateSettings = async (updated: Partial<UserSettings>): Promise<UserSettings> => {
  await simulateDelay(150);
  return { ...DEFAULT_SETTINGS, ...updated };
};

