import React, { useEffect, useState } from 'react';
import { Pill, Plus, Search, BellRing } from 'lucide-react';
import type { PageId, Medicine } from '../types';
import { MedicineCard } from '../components/cards/MedicineCard';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { getMedicines, toggleMedicineStatus, deleteMedicine } from '../services/medicineService';
import { useToast } from '../context/ToastContext';

interface MedicinesPageProps {
  onNavigate: (page: PageId) => void;
  onOpenAddMedicine: () => void;
}

export const MedicinesPage: React.FC<MedicinesPageProps> = ({
  onOpenAddMedicine,
}) => {
  const { showToast } = useToast();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'taken'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const mRes = await getMedicines();
      setMedicines(mRes);
    } catch (err) {
      showToast({ type: 'error', title: 'Failed to load medicines' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updated = await toggleMedicineStatus(id);
      setMedicines((prev) => prev.map((m) => (m.id === id ? updated : m)));
      showToast({
        type: updated.status === 'taken' ? 'success' : 'info',
        title: updated.status === 'taken' ? 'Dose Recorded' : 'Marked Pending',
        message: `${updated.name} updated to ${updated.status}.`,
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Could not update status' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMedicine(id);
      setMedicines((prev) => prev.filter((m) => m.id !== id));
      showToast({ type: 'info', title: 'Medicine removed' });
    } catch (err) {
      showToast({ type: 'error', title: 'Could not remove medicine' });
    }
  };

  const filteredMedicines = medicines.filter((m) => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.dosage.toLowerCase().includes(q);
    }
    return true;
  });

  const pendingCount = medicines.filter((m) => m.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Medicines</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage daily prescription reminders, dosages, and intake completion.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenAddMedicine}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Medicine
        </Button>
      </div>

      <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-xs">
            <BellRing className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-teal-950">Medication Alerts Active</h4>
            <p className="text-xs text-teal-700 mt-0.5">
              Frontend is synced with local timers. Backend web push notifications will trigger at dose time.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-teal-800 bg-white/80 px-3 py-1 rounded-full border border-teal-200 shrink-0">
          {pendingCount} Pending Doses
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search medicine name or dosage..."
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'pending', 'taken'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st} {st === 'pending' ? `(${pendingCount})` : ''}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingState type="skeleton" />
      ) : filteredMedicines.length === 0 ? (
        <EmptyState
          icon={<Pill className="w-8 h-8 text-teal-600" />}
          title="No medicines found"
          description={
            searchQuery || statusFilter !== 'all'
              ? 'No medicines match your active search filter.'
              : 'Keep track of daily prescriptions and supplements with timely alerts.'
          }
          actionText="Add Medicine Reminder"
          onAction={onOpenAddMedicine}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((med) => (
            <MedicineCard
              key={med.id}
              medicine={med}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
