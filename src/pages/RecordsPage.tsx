import React, { useEffect, useState } from 'react';
import { FileText, UploadCloud, Search, Calendar } from 'lucide-react';
import type { PageId, HealthRecord, RecordCategory } from '../types';
import { HealthRecordCard } from '../components/cards/HealthRecordCard';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { ViewRecordModal } from '../components/modals/ViewRecordModal';
import { getHealthRecords, deleteHealthRecord } from '../services/recordsService';
import { useToast } from '../context/ToastContext';

interface RecordsPageProps {
  onNavigate: (page: PageId) => void;
  onOpenUploadRecord: () => void;
}

export const RecordsPage: React.FC<RecordsPageProps> = ({
  onOpenUploadRecord,
}) => {
  const { showToast } = useToast();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<RecordCategory | 'All'>('All');
  const [selectedRecordForView, setSelectedRecordForView] = useState<HealthRecord | null>(null);

  const categories: (RecordCategory | 'All')[] = [
    'All',
    'Prescriptions',
    'Lab Reports',
    'Vaccinations',
    'Allergies',
    'Medical Documents',
    'Other',
  ];

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await getHealthRecords();
      setRecords(data);
    } catch (err) {
      showToast({ type: 'error', title: 'Failed to load records' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHealthRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      showToast({ type: 'info', title: 'Record deleted' });
    } catch (err) {
      showToast({ type: 'error', title: 'Could not delete record' });
    }
  };

  const handleDownloadMock = (rec: HealthRecord) => {
    showToast({
      type: 'success',
      title: 'Downloading file',
      message: `Downloading ${rec.fileName || 'record.pdf'} (mock file download).`,
    });
  };

  const filteredRecords = records.filter((r) => {
    if (activeCategory !== 'All' && r.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.doctorOrHospital.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Health Records</h1>
          <p className="text-sm text-slate-500 mt-1">
            Encrypted storage for prescriptions, lab panels, vaccination certificates, and clinical reports.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenUploadRecord}
          leftIcon={<UploadCloud className="w-4 h-4" />}
        >
          Upload Record
        </Button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <Input
          placeholder="Search by record name, doctor, or medical facility..."
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" /> Medical Timeline (2026)
          </h3>
          <span className="text-xs text-slate-400 font-mono">{filteredRecords.length} records</span>
        </div>

        {isLoading ? (
          <LoadingState type="skeleton" />
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-8 h-8 text-teal-600" />}
            title="No records found"
            description="Upload medical documents to keep track of lab tests and prescriptions."
            actionText="Upload Record"
            onAction={onOpenUploadRecord}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((rec) => (
              <HealthRecordCard
                key={rec.id}
                record={rec}
                onView={(r) => setSelectedRecordForView(r)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <ViewRecordModal
        record={selectedRecordForView}
        onClose={() => setSelectedRecordForView(null)}
        onDownloadMock={handleDownloadMock}
      />
    </div>
  );
};
