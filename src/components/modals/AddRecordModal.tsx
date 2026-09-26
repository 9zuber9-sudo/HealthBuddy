import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { HealthRecord, RecordCategory, FamilyMember } from '../../types';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (record: Omit<HealthRecord, 'id'>) => Promise<void>;
  familyMembers?: FamilyMember[];
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  familyMembers = [],
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<RecordCategory>('Prescriptions');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctorOrHospital, setDoctorOrHospital] = useState('');
  const [notes, setNotes] = useState('');
  const [familyMemberId, setFamilyMemberId] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a document record name.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const selectedFam = familyMembers.find((f) => f.id === familyMemberId);
      await onUpload({
        name,
        category,
        date,
        doctorOrHospital: doctorOrHospital || 'General Health System',
        fileName: fileName || `${name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        fileSize: '1.2 MB',
        notes: notes || undefined,
        familyMemberId: familyMemberId || undefined,
        familyMemberName: selectedFam ? `${selectedFam.name} (${selectedFam.relationship})` : undefined,
      });

      setName('');
      setDoctorOrHospital('');
      setNotes('');
      setFileName('');
      onClose();
    } catch (err) {
      setError('Failed to upload health record.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Health Record"
      subtitle="Store prescriptions, lab results, and medical reports securely."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}

        <Input
          label="Document Record Name *"
          placeholder="e.g. Annual Blood Panel Result, Dental X-Ray"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as RecordCategory)}
            options={[
              { value: 'Prescriptions', label: 'Prescriptions' },
              { value: 'Lab Reports', label: 'Lab Reports' },
              { value: 'Vaccinations', label: 'Vaccinations' },
              { value: 'Allergies', label: 'Allergies' },
              { value: 'Medical Documents', label: 'Medical Documents' },
              { value: 'Other', label: 'Other' },
            ]}
          />
          <Input
            label="Record Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Input
          label="Doctor / Hospital / Clinic"
          placeholder="e.g. Dr. Sharma, City General Hospital"
          value={doctorOrHospital}
          onChange={(e) => setDoctorOrHospital(e.target.value)}
        />

        {familyMembers.length > 0 && (
          <Select
            label="Belongs to (Optional)"
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
            Attach Document File (PDF, PNG, JPG)
          </label>
          <div className="border-2 border-dashed border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/30 rounded-2xl p-4 text-center cursor-pointer transition-colors relative">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center pointer-events-none">
              <UploadCloud className="w-8 h-8 text-teal-600 mb-1" />
              <p className="text-xs font-semibold text-slate-800">
                {fileName ? fileName : 'Click or drag file to attach'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Maximum file size: 25 MB</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Notes / Diagnosis Summary
          </label>
          <textarea
            rows={2}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 placeholder:text-slate-400"
            placeholder="e.g. Normal cholesterol levels. Repeat test in 12 months."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Upload Record
          </Button>
        </div>
      </form>
    </Modal>
  );
};
