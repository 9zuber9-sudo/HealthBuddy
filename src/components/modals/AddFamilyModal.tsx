import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { FamilyMember } from '../../types';

interface AddFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: Omit<FamilyMember, 'id'>) => Promise<void>;
}

export const AddFamilyModal: React.FC<AddFamilyModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Mother');
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState('Female');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [conditionsInput, setConditionsInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const knownAllergies = allergiesInput
        ? allergiesInput.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const existingConditions = conditionsInput
        ? conditionsInput.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      await onAdd({
        name,
        relationship,
        age: Number(age) || 0,
        gender,
        emergencyContact: emergencyContact || '+1 (555) 000-0000',
        knownAllergies,
        existingConditions,
      });

      setName('');
      setAllergiesInput('');
      setConditionsInput('');
      onClose();
    } catch (err) {
      setError('Failed to add family member.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Family Member Profile"
      subtitle="Track healthcare records, medicines, and allergies for loved ones."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Eleanor Morgan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Select
            label="Relationship *"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            options={[
              { value: 'Mother', label: 'Mother' },
              { value: 'Father', label: 'Father' },
              { value: 'Grandmother', label: 'Grandmother' },
              { value: 'Grandfather', label: 'Grandfather' },
              { value: 'Spouse / Partner', label: 'Spouse / Partner' },
              { value: 'Son', label: 'Son' },
              { value: 'Daughter', label: 'Daughter' },
              { value: 'Sibling', label: 'Sibling' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Age *"
            type="number"
            min={0}
            max={120}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            required
          />
          <Select
            label="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            options={[
              { value: 'Female', label: 'Female' },
              { value: 'Male', label: 'Male' },
              { value: 'Non-binary / Other', label: 'Non-binary / Other' },
            ]}
          />
        </div>

        <Input
          label="Emergency Phone Contact"
          placeholder="e.g. +1 (555) 987-6543"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
        />

        <Input
          label="Known Allergies (Comma separated)"
          placeholder="e.g. Penicillin, Peanuts, Latex"
          value={allergiesInput}
          onChange={(e) => setAllergiesInput(e.target.value)}
        />

        <Input
          label="Existing Chronic Conditions (Comma separated)"
          placeholder="e.g. Asthma, Diabetes, Hypertension"
          value={conditionsInput}
          onChange={(e) => setConditionsInput(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Add Family Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
};
