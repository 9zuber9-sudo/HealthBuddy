import React from 'react';
import { FileText, Calendar, Building2, Trash2, Eye } from 'lucide-react';
import type { HealthRecord } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface HealthRecordCardProps {
  record: HealthRecord;
  onView?: (record: HealthRecord) => void;
  onDelete?: (id: string) => void;
}

export const HealthRecordCard: React.FC<HealthRecordCardProps> = ({
  record,
  onView,
  onDelete,
}) => {
  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'Prescriptions': return 'info';
      case 'Lab Reports': return 'teal';
      case 'Vaccinations': return 'success';
      case 'Allergies': return 'warning';
      case 'Medical Documents': return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <Card hoverable className="flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={getCategoryBadgeVariant(record.category)} size="sm">
            {record.category}
          </Badge>
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {record.date}
          </span>
        </div>

        <div className="flex items-start gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
              {record.name}
            </h4>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <Building2 className="w-3 h-3 text-slate-400" /> {record.doctorOrHospital}
            </p>
          </div>
        </div>

        {record.notes && (
          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 my-3 line-clamp-2 leading-relaxed">
            {record.notes}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs text-slate-400">
        <span className="font-mono text-[11px]">{record.fileSize || 'PDF Document'}</span>

        <div className="flex items-center gap-2">
          {onView && (
            <button
              onClick={() => onView(record)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> View
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(record.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Delete Record"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
