import React, { useEffect, useState } from 'react';
import {
  Bell,
  Shield,
  Save,
  ShieldAlert,
  Lock,
  Smartphone,
} from 'lucide-react';
import type { PageId, UserProfile } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { LoadingState } from '../components/common/LoadingState';
import { getCurrentUser, updateUserProfile, getSettings, updateSettings, type UserSettings } from '../services/authService';
import { useToast } from '../context/ToastContext';

interface ProfileSettingsPageProps {
  onNavigate: (page: PageId) => void;
  onUserUpdate: (updated: UserProfile) => void;
}

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({
  onUserUpdate,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [settings, setSettingsState] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(34);
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [conditionsInput, setConditionsInput] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [uData, sData] = await Promise.all([getCurrentUser(), getSettings()]);
      setSettingsState(sData);

      if (uData) {
        setName(uData.name);
        setAge(uData.age);
        setGender(uData.gender);
        setBloodGroup(uData.bloodGroup);
        setPhone(uData.phone);
        setEmail(uData.email);
        setEmergencyName(uData.emergencyContactName);
        setEmergencyPhone(uData.emergencyContactPhone);
        setAllergiesInput(uData.allergies.join(', '));
        setConditionsInput(uData.existingConditions.join(', '));
      }
    } catch (err) {
      showToast({ type: 'error', title: 'Failed to load user profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updateUserProfile({
        name,
        age: Number(age),
        gender,
        bloodGroup,
        phone,
        email,
        emergencyContactName: emergencyName,
        emergencyContactPhone: emergencyPhone,
        allergies: allergiesInput.split(',').map((s) => s.trim()).filter(Boolean),
        existingConditions: conditionsInput.split(',').map((s) => s.trim()).filter(Boolean),
      });

      onUserUpdate(updated);
      showToast({
        type: 'success',
        title: 'Profile Saved',
        message: 'Your personal health profile has been updated.',
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Could not save profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSetting = async (key: keyof UserSettings) => {
    if (!settings) return;
    const nextVal = !settings[key];
    const updated = await updateSettings({ [key]: nextVal });
    setSettingsState(updated);
    showToast({
      type: 'info',
      title: 'Settings Updated',
      message: `${key} toggled.`,
    });
  };

  if (isLoading) {
    return <LoadingState type="full" message="Loading profile settings..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Profile & App Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal health ID, emergency contacts, and privacy preferences.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Personal Health Profile
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            App Preferences & Privacy
          </button>
        </div>
      </div>

      {activeTab === 'profile' ? (
        <Card className="bg-white border-slate-200 shadow-sm">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                {name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{name}</h3>
                <p className="text-xs text-slate-500">{email} • Registered Primary User</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="teal" size="sm">
                    Blood Group: {bloodGroup}
                  </Badge>
                  <Badge variant="success" size="sm">
                    Age: {age}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Demographic Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Age" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} required />
                <Select
                  label="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  options={[
                    { value: 'Non-binary / Male', label: 'Non-binary / Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Prefer not to say', label: 'Prefer not to say' },
                  ]}
                />
                <Select
                  label="Blood Group"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  options={[
                    { value: 'O+', label: 'O+' },
                    { value: 'O-', label: 'O-' },
                    { value: 'A+', label: 'A+' },
                    { value: 'A-', label: 'A-' },
                    { value: 'B+', label: 'B+' },
                    { value: 'B-', label: 'B-' },
                    { value: 'AB+', label: 'AB+' },
                    { value: 'AB-', label: 'AB-' },
                  ]}
                />
              </div>

              <Input label="Phone Contact" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Emergency Contact Setup</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Emergency Contact Name"
                  placeholder="e.g. Sarah Morgan (Sister)"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                />
                <Input
                  label="Emergency Contact Phone"
                  placeholder="e.g. +1 (555) 987-6543"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Medical History & Allergies</h4>
              <Input
                label="Known Allergies (Comma separated)"
                placeholder="e.g. Penicillin, Peanuts, Dust Mites"
                value={allergiesInput}
                onChange={(e) => setAllergiesInput(e.target.value)}
              />
              <Input
                label="Existing Pre-existing Chronic Conditions"
                placeholder="e.g. Asthma, Hypertension, Diabetes"
                value={conditionsInput}
                onChange={(e) => setConditionsInput(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="primary" size="md" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                Save Health Profile
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="bg-white border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Notification & Reminders</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-teal-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Push Notifications</h4>
                    <p className="text-xs text-slate-500">Receive dose reminders and appointment alerts</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.notificationsEnabled}
                  onChange={() => handleToggleSetting('notificationsEnabled')}
                  className="w-5 h-5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Medicine Reminders Sound</h4>
                    <p className="text-xs text-slate-500">Audio chime when daily medication is due</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.medicineReminders}
                  onChange={() => handleToggleSetting('medicineReminders')}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Emergency Alert Broadcast</h4>
                    <p className="text-xs text-slate-500">Notify emergency contacts during emergency mode trigger</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.emergencyAlerts}
                  onChange={() => handleToggleSetting('emergencyAlerts')}
                  className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
              </div>
            </div>
          </Card>

          <Card className="bg-white border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Privacy & Security</h3>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-purple-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Privacy Mode (HIPAA Compliant UI)</h4>
                  <p className="text-xs text-slate-500">Hide sensitive diagnosis names on lock screen</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings?.privacyMode}
                onChange={() => handleToggleSetting('privacyMode')}
                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>
          </Card>
        </div>
      )}

      <Card className="bg-slate-900 text-white border-slate-800">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-teal-500/20 rounded-2xl text-teal-300 shrink-0 border border-teal-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Healthcare Regulatory & Medical Disclaimer</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              “HealthBuddy provides general health information and does not replace professional medical advice. Always seek the advice of a qualified physician or other health provider with any questions you may have regarding a medical condition.”
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
