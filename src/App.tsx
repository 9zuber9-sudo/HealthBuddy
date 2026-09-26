import React, { useState, useEffect } from 'react';
import type { PageId, UserProfile, FamilyMember } from './types';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AIHealthGuidePage } from './pages/AIHealthGuidePage';
import { EmergencyPage } from './pages/EmergencyPage';
import { MedicinesPage } from './pages/MedicinesPage';
import { RecordsPage } from './pages/RecordsPage';
import { FamilyHealthPage } from './pages/FamilyHealthPage';
import { FindHealthcarePage } from './pages/FindHealthcarePage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';

// Modals
import { AddMedicineModal } from './components/modals/AddMedicineModal';
import { AddRecordModal } from './components/modals/AddRecordModal';
import { AddFamilyModal } from './components/modals/AddFamilyModal';

// Services
import { getCurrentUser } from './services/authService';
import { addMedicine } from './services/medicineService';
import { uploadHealthRecord } from './services/recordsService';
import { addFamilyMember, getFamilyMembers } from './services/familyService';

export const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // Modals state
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
        const f = await getFamilyMembers();
        setFamilyMembers(f);
      } catch (err) {
        console.error('Failed to fetch initial user profile', err);
      }
    };
    init();
  }, []);

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddMedicineSubmit = async (med: Parameters<typeof addMedicine>[0]) => {
    await addMedicine(med);
  };

  const handleUploadRecordSubmit = async (rec: Parameters<typeof uploadHealthRecord>[0]) => {
    await uploadHealthRecord(rec);
  };

  const handleAddFamilySubmit = async (fam: Parameters<typeof addFamilyMember>[0]) => {
    const newMember = await addFamilyMember(fam);
    setFamilyMembers((prev) => [...prev, newMember]);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            onOpenAddMedicine={() => setIsAddMedicineOpen(true)}
            onOpenUploadRecord={() => setIsAddRecordOpen(true)}
          />
        );
      case 'ai-guide':
        return <AIHealthGuidePage onNavigate={handleNavigate} />;
      case 'emergency':
        return <EmergencyPage onNavigate={handleNavigate} />;
      case 'medicines':
        return (
          <MedicinesPage
            onNavigate={handleNavigate}
            onOpenAddMedicine={() => setIsAddMedicineOpen(true)}
          />
        );
      case 'records':
        return (
          <RecordsPage
            onNavigate={handleNavigate}
            onOpenUploadRecord={() => setIsAddRecordOpen(true)}
          />
        );
      case 'family':
        return (
          <FamilyHealthPage
            onNavigate={handleNavigate}
            onOpenAddFamily={() => setIsAddFamilyOpen(true)}
          />
        );
      case 'healthcare':
        return <FindHealthcarePage onNavigate={handleNavigate} />;
      case 'profile':
        return (
          <ProfileSettingsPage
            onNavigate={handleNavigate}
            onUserUpdate={(u) => setUser(u)}
          />
        );
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout activePage={activePage} user={user} onNavigate={handleNavigate}>
      {renderActivePage()}

      {/* Global Modals */}
      <AddMedicineModal
        isOpen={isAddMedicineOpen}
        onClose={() => setIsAddMedicineOpen(false)}
        onAdd={handleAddMedicineSubmit}
        familyMembers={familyMembers}
      />

      <AddRecordModal
        isOpen={isAddRecordOpen}
        onClose={() => setIsAddRecordOpen(false)}
        onUpload={handleUploadRecordSubmit}
        familyMembers={familyMembers}
      />

      <AddFamilyModal
        isOpen={isAddFamilyOpen}
        onClose={() => setIsAddFamilyOpen(false)}
        onAdd={handleAddFamilySubmit}
      />
    </Layout>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
