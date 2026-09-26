import type { HealthRecord } from '../types';
import { simulateDelay } from './apiConfig';

const getRecordsKey = () => {
  const session = localStorage.getItem('healthbuddy_auth_session');
  return session ? `healthbuddy_records_${session}` : null;
};

const loadFromStorage = (): HealthRecord[] => {
  const key = getRecordsKey();
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (records: HealthRecord[]): void => {
  const key = getRecordsKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(records));
};

export const getHealthRecords = async (): Promise<HealthRecord[]> => {
  await simulateDelay(250);
  return loadFromStorage();
};

export const uploadHealthRecord = async (record: Omit<HealthRecord, 'id'>): Promise<HealthRecord> => {
  await simulateDelay(600);
  const newRecord: HealthRecord = {
    ...record,
    id: `rec-${Date.now()}`,
    fileName: record.fileName || `${record.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    fileSize: record.fileSize || '1.2 MB',
  };
  const records = loadFromStorage();
  records.unshift(newRecord);
  saveToStorage(records);
  return newRecord;
};

export const deleteHealthRecord = async (id: string): Promise<void> => {
  await simulateDelay(300);
  const records = loadFromStorage();
  saveToStorage(records.filter((r) => r.id !== id));
};
