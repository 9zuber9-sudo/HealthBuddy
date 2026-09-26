import React from 'react';
import { Pill, Check, Clock, Edit2, Trash2, User } from 'lucide-react';
import type { Medicine } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface MedicineCardProps {
  medicine: Medicine;
  onToggleStatus: (id: string) => void;
  onEdit?: (medicine: Medicine) => void;
  onDelete?: (id: string) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const isTaken = medicine.status === 'taken';

  return (
    <Card hoverable className="transition-all relative overflow-hidden group">
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isTaken ? 'bg-emerald-500' : 'bg-amber-500'
        }`}
      />

      <div className="flex items-start justify-between gap-3 mb-3 pt-1">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl border shrink-0 ${
              isTaken ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-amber-50 border-amber-200 text-amber-600'
            }`}
          >
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 leading-tight">{medicine.name}</h4>
            <p className="text-xs font-semibold text-teal-700 mt-0.5">{medicine.dosage}</p>
          </div>
        </div>

        <Badge variant={isTaken ? 'success' : 'warning'} dot>
          {isTaken ? 'Taken' : 'Pending'}
        </Badge>
      </div>

      <div className="space-y-1.5 text-xs text-slate-600 my-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Frequency:</span>
          <span className="font-medium text-slate-700">{medicine.frequency}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Next Dose:
          </span>
          <span className="font-bold text-slate-900">{medicine.nextDoseTime}</span>
        </div>
        {medicine.familyMemberName && (
          <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5 mt-1.5 text-purple-700">
            <span className="text-slate-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-purple-500" /> Member:
            </span>
            <span className="font-semibold">{medicine.familyMemberName}</span>
          </div>
        )}
      </div>

      {medicine.notes && (
        <p className="text-xs text-slate-500 italic mb-4 line-clamp-1 bg-white">
          "{medicine.notes}"
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          onClick={() => onToggleStatus(medicine.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isTaken
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          {isTaken ? 'Mark as Pending' : 'Mark as Taken'}
        </button>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(medicine)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Edit Medicine"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(medicine.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Delete Medicine"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
