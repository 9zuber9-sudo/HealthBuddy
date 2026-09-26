import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { Medicine, FamilyMember } from '../../types';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (medicine: Omit<Medicine, 'id'>) => Promise<void>;
  familyMembers?: FamilyMember[];
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  familyMembers = [],
}) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [reminderTime, setReminderTime] = useState('08:00 AM');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [familyMemberId, setFamilyMemberId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) {
      setError('Please provide medicine name and dosage.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const selectedFam = familyMembers.find((f) => f.id === familyMemberId);
      await onAdd({
        name,
        dosage,
        frequency,
        nextDoseTime: reminderTime,
        status: 'pending',
        reminderTime,
        startDate,
        endDate: endDate || undefined,
        notes: notes || undefined,
        familyMemberId: familyMemberId || undefined,
        familyMemberName: selectedFam ? `${selectedFam.name} (${selectedFam.relationship})` : undefined,
      });

      setName('');
      setDosage('');
      setNotes('');
      onClose();
    } catch (err) {
      setError('Failed to save medicine. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Medicine Reminder"
      subtitle="Configure daily intake schedules and alert times."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Medicine Name *"
            placeholder="e.g. Amoxicillin, Paracetamol"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Dosage *"
            placeholder="e.g. 500 mg, 10 ml, 1 tablet"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            options={[
              { value: 'Once daily', label: 'Once daily' },
              { value: 'Twice daily', label: 'Twice daily' },
              { value: 'Three times daily', label: 'Three times daily' },
              { value: 'Every 8 hours', label: 'Every 8 hours' },
              { value: 'As needed (PRN)', label: 'As needed (PRN)' },
            ]}
          />
          <Input
            label="Reminder Time"
            type="text"
            placeholder="e.g. 08:00 AM, 08:00 PM"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date (Optional)"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {familyMembers.length > 0 && (
          <Select
            label="Assign to Family Member (Optional)"
            value={familyMemberId}
            onChange={(e) => setFamilyMemberId(e.target.value)}
            options={[
              { value: '', label: 'Myself (Primary User)' },
              ...familyMembers.map((fam) => ({
                value: fam.id,
                label: `${fam.name} (${fam.relationship})`,
              })),
            ]}
          />
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Special Instructions / Notes
          </label>
          <textarea
            rows={2}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 placeholder:text-slate-400"
            placeholder="e.g. Take after breakfast with food."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Save Medicine
          </Button>
        </div>
      </form>
    </Modal>
  );
};
