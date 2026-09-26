import React from 'react';
import { FileText, Download, Calendar, User, ShieldCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import type { HealthRecord } from '../../types';

interface ViewRecordModalProps {
  record: HealthRecord | null;
  onClose: () => void;
  onDownloadMock?: (record: HealthRecord) => void;
}

export const ViewRecordModal: React.FC<ViewRecordModalProps> = ({
  record,
  onClose,
  onDownloadMock,
}) => {
  if (!record) return null;

  return (
    <Modal
      isOpen={Boolean(record)}
      onClose={onClose}
      title={record.name}
      subtitle={`Category: ${record.category}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-mono">{record.fileName || 'document_scan.pdf'}</p>
              <h5 className="text-sm font-bold text-slate-900">{record.doctorOrHospital}</h5>
            </div>
          </div>
          <Badge variant="teal" size="md">
            {record.fileSize || 'PDF File'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-600" /> Record Date
            </span>
            <p className="text-sm font-semibold text-slate-900 mt-1">{record.date}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-teal-600" /> Assigned Person
            </span>
            <p className="text-sm font-semibold text-slate-900 mt-1">
              {record.familyMemberName || 'Primary User (Self)'}
            </p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-6 bg-slate-950 text-slate-100 shadow-inner space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-teal-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> HEALTHBRIDGE ENCRYPTED PREVIEW
            </span>
            <span className="text-slate-500">ID: {record.id}</span>
          </div>

          <p className="text-slate-300 leading-relaxed font-sans text-sm">
            {record.notes || 'Official diagnostic summary verified by clinical staff. No abnormal pathologies flagged in system scan.'}
          </p>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-sans flex items-center justify-between">
            <span>Issuer: {record.doctorOrHospital}</span>
            <span>Verified Digital Signature ✓</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="primary"
            onClick={() => onDownloadMock && onDownloadMock(record)}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download Document
          </Button>
        </div>
      </div>
    </Modal>
  );
};
