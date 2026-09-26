import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Heart, ShieldAlert, Pill, FileText, Phone, ArrowLeft } from 'lucide-react';
import type { PageId, FamilyMember, Medicine, HealthRecord } from '../types';
import { FamilyMemberCard } from '../components/cards/FamilyMemberCard';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { getFamilyMembers, deleteFamilyMember } from '../services/familyService';
import { getMedicines } from '../services/medicineService';
import { getHealthRecords } from '../services/recordsService';
import { useToast } from '../context/ToastContext';

interface FamilyHealthPageProps {
  onNavigate: (page: PageId) => void;
  onOpenAddFamily: () => void;
}

export const FamilyHealthPage: React.FC<FamilyHealthPageProps> = ({
  onOpenAddFamily,
}) => {
  const { showToast } = useToast();
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fRes, mRes, rRes] = await Promise.all([
        getFamilyMembers(),
        getMedicines(),
        getHealthRecords(),
      ]);
      setFamily(fRes);
      setMedicines(mRes);
      setRecords(rRes);
    } catch (err) {
      showToast({ type: 'error', title: 'Failed to load family health data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFamilyMember(id);
      setFamily((prev) => prev.filter((m) => m.id !== id));
      if (selectedMember?.id === id) setSelectedMember(null);
      showToast({ type: 'info', title: 'Family profile deleted' });
    } catch (err) {
      showToast({ type: 'error', title: 'Could not delete family profile' });
    }
  };

  const memberMedicines = selectedMember
    ? medicines.filter((m) => m.familyMemberId === selectedMember.id)
    : [];

  const memberRecords = selectedMember
    ? records.filter((r) => r.familyMemberId === selectedMember.id)
    : [];

  return (
    <div className="space-y-6">
      {!selectedMember ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Family Health</h1>
            <p className="text-sm text-slate-500 mt-1">
              Centralized health tracking, allergy alerts, and emergency records for family members.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={onOpenAddFamily}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Add Family Member
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedMember(null)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to All Family Members
          </Button>
        </div>
      )}

      {isLoading ? (
        <LoadingState type="skeleton" />
      ) : selectedMember ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-700 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {selectedMember.avatarUrl ? (
                  <img
                    src={selectedMember.avatarUrl}
                    alt={selectedMember.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-2xl">
                    {selectedMember.name.charAt(0)}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-white">{selectedMember.name}</h2>
                    <Badge variant="teal" size="md">
                      {selectedMember.relationship}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Age {selectedMember.age} • Gender: {selectedMember.gender} • Emergency Phone: {selectedMember.emergencyContact}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedMember.emergencyContact}`}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4" /> Call Contact
                </a>
                <Button variant="danger" size="sm" onClick={() => handleDelete(selectedMember.id)}>
                  Delete Profile
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700/80 text-xs">
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-700/60">
                <span className="text-rose-400 font-bold flex items-center gap-1.5 mb-1.5">
                  <ShieldAlert className="w-4 h-4" /> Confirmed Allergies:
                </span>
                <p className="text-slate-200">
                  {selectedMember.knownAllergies.length > 0 ? selectedMember.knownAllergies.join(', ') : 'None listed'}
                </p>
              </div>

              <div className="p-3 bg-slate-850 rounded-xl border border-slate-700/60">
                <span className="text-purple-400 font-bold flex items-center gap-1.5 mb-1.5">
                  <Heart className="w-4 h-4" /> Existing Medical Conditions:
                </span>
                <p className="text-slate-200">
                  {selectedMember.existingConditions.length > 0 ? selectedMember.existingConditions.join(', ') : 'None listed'}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Pill className="w-5 h-5 text-teal-600" /> Prescribed Medications ({memberMedicines.length})
              </h3>
              {memberMedicines.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">No specific medicines assigned to this family member.</p>
              ) : (
                <div className="space-y-3">
                  {memberMedicines.map((m) => (
                    <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900">{m.name} ({m.dosage})</h4>
                        <p className="text-slate-500 mt-0.5">{m.frequency} • Next: {m.nextDoseTime}</p>
                      </div>
                      <Badge variant={m.status === 'taken' ? 'success' : 'warning'} size="sm">
                        {m.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="bg-white border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-purple-600" /> Medical Documents ({memberRecords.length})
              </h3>
              {memberRecords.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">No health records uploaded for this family member.</p>
              ) : (
                <div className="space-y-3">
                  {memberRecords.map((r) => (
                    <div key={r.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900">{r.name}</h4>
                        <p className="text-slate-500 mt-0.5">{r.category} • {r.date}</p>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">{r.fileSize}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : family.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8 text-teal-600" />}
          title="No family members added"
          description="Keep track of medication schedules, allergies, and emergency info for your entire family."
          actionText="Add Family Member"
          onAction={onOpenAddFamily}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {family.map((member) => (
            <FamilyMemberCard
              key={member.id}
              member={member}
              onSelect={(m) => setSelectedMember(m)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
