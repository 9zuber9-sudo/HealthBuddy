import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  PlusCircle,
  FilePlus,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Pill,
  Users,
  FileText,
  Activity,
} from 'lucide-react';
import type { PageId, UserProfile, Medicine, ActivityLog, Appointment } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { HealthStatus } from '../components/common/HealthStatus';
import { Timeline } from '../components/common/Timeline';
import { LoadingState } from '../components/common/LoadingState';
import { getCurrentUser } from '../services/authService';
import { getMedicines, toggleMedicineStatus } from '../services/medicineService';
import { getRecentActivities } from '../services/healthService';
import { getHealthRecords } from '../services/recordsService';
import { getFamilyMembers } from '../services/familyService';
import { useToast } from '../context/ToastContext';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
  onOpenAddMedicine: () => void;
  onOpenUploadRecord: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenAddMedicine,
  onOpenUploadRecord,
}) => {
  const { showToast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [recordCount, setRecordCount] = useState<number>(0);
  const [familyCount, setFamilyCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const upcomingAppointment: Appointment = {
    id: 'apt-1',
    title: 'Post-Recovery Consultation',
    doctorName: 'Dr. Rachel Vance',
    specialty: 'Cardiology & General Health',
    date: 'Tomorrow',
    time: '11:30 AM',
    location: 'City General Health Center (Room 304)',
    type: 'In-person',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [uData, mData, aData, rData, fData] = await Promise.all([
          getCurrentUser(),
          getMedicines(),
          getRecentActivities(),
          getHealthRecords(),
          getFamilyMembers(),
        ]);
        setUser(uData);
        setMedicines(mData);
        setActivities(aData);
        setRecordCount(rData.length);
        setFamilyCount(fData.length);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleMedicine = async (id: string) => {
    try {
      const updated = await toggleMedicineStatus(id);
      setMedicines((prev) => prev.map((m) => (m.id === id ? updated : m)));
      showToast({
        type: updated.status === 'taken' ? 'success' : 'info',
        title: updated.status === 'taken' ? 'Medicine Taken!' : 'Marked as Pending',
        message: `${updated.name} status updated to ${updated.status}.`,
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Update failed',
        message: 'Could not update medicine status.',
      });
    }
  };

  if (isLoading) {
    return <LoadingState type="full" message="Loading your health dashboard..." />;
  }

  const pendingMeds = medicines.filter((m) => m.status === 'pending');
  const takenMeds = medicines.filter((m) => m.status === 'taken');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-semibold mb-2 backdrop-blur-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> All systems monitored
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, {user?.name || 'Alex Morgan'}
          </h1>
          <p className="text-teal-100 text-sm mt-1 max-w-xl">
            Here’s your health overview. You have {pendingMeds.length} pending medication doses today.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Button
            variant="emergency"
            size="md"
            onClick={() => onNavigate('emergency')}
            leftIcon={<ShieldAlert className="w-4 h-4 fill-current" />}
          >
            Emergency Mode
          </Button>
          <Button
            variant="outline"
            size="md"
            className="border-white/40 text-white hover:bg-white/10"
            onClick={() => onNavigate('ai-guide')}
            leftIcon={<Sparkles className="w-4 h-4 text-teal-200" />}
          >
            Check Symptoms
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Health Snapshot</h3>
          <span className="text-xs text-slate-500 font-medium">Updated 5m ago</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card hoverable padding="sm" onClick={() => onNavigate('medicines')} className="bg-gradient-to-br from-emerald-50/50 to-white">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                <Pill className="w-5 h-5" />
              </div>
              <Badge variant="success" size="sm">
                {takenMeds.length}/{medicines.length} Done
              </Badge>
            </div>
            <div className="mt-3">
              <h4 className="text-2xl font-black text-slate-900">{medicines.length}</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Active Medicines</p>
            </div>
          </Card>

          <Card hoverable padding="sm" onClick={() => onNavigate('dashboard')} className="bg-gradient-to-br from-purple-50/50 to-white">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                <Calendar className="w-5 h-5" />
              </div>
              <Badge variant="info" size="sm">
                Upcoming
              </Badge>
            </div>
            <div className="mt-3">
              <h4 className="text-2xl font-black text-slate-900">1</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Scheduled Appointments</p>
            </div>
          </Card>

          <Card hoverable padding="sm" onClick={() => onNavigate('records')} className="bg-gradient-to-br from-sky-50/50 to-white">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
                <FileText className="w-5 h-5" />
              </div>
              <Badge variant="teal" size="sm">
                Encrypted
              </Badge>
            </div>
            <div className="mt-3">
              <h4 className="text-2xl font-black text-slate-900">{recordCount}</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Health Records</p>
            </div>
          </Card>

          <Card hoverable padding="sm" onClick={() => onNavigate('family')} className="bg-gradient-to-br from-amber-50/50 to-white">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                <Users className="w-5 h-5" />
              </div>
              <Badge variant="warning" size="sm">
                Connected
              </Badge>
            </div>
            <div className="mt-3">
              <h4 className="text-2xl font-black text-slate-900">{familyCount}</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Family Members</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => onNavigate('ai-guide')}
            leftIcon={<Sparkles className="w-4 h-4 text-teal-200" />}
          >
            Check Symptoms
          </Button>

          <Button
            variant="emergency"
            size="md"
            fullWidth
            onClick={() => onNavigate('emergency')}
            leftIcon={<ShieldAlert className="w-4 h-4 fill-current" />}
          >
            Emergency
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={onOpenAddMedicine}
            leftIcon={<PlusCircle className="w-4 h-4 text-emerald-600" />}
          >
            Add Medicine
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={onOpenUploadRecord}
            leftIcon={<FilePlus className="w-4 h-4 text-purple-600" />}
          >
            Add Health Record
          </Button>

          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={() => onNavigate('healthcare')}
            leftIcon={<MapPin className="w-4 h-4 text-teal-600" />}
          >
            Find Healthcare
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" /> Today's Medicines
            </h3>
            <button
              onClick={() => onNavigate('medicines')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              View All ({medicines.length}) &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {medicines.slice(0, 3).map((med) => {
              const isTaken = med.status === 'taken';
              return (
                <div
                  key={med.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    isTaken ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl border shrink-0 ${
                        isTaken ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-amber-100 border-amber-300 text-amber-700'
                      }`}
                    >
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{med.name}</h4>
                        <span className="text-xs text-teal-700 font-semibold">{med.dosage}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {med.nextDoseTime}
                        </span>
                        <span>• {med.frequency}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={isTaken ? 'success' : 'warning'} dot>
                      {isTaken ? 'Taken' : 'Pending'}
                    </Badge>

                    <Button
                      variant={isTaken ? 'ghost' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleMedicine(med.id)}
                    >
                      {isTaken ? 'Undo' : 'Mark Taken'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" /> Upcoming Appointment
            </h3>
          </div>

          <Card className="bg-gradient-to-br from-purple-900 to-slate-900 text-white border-purple-800 shadow-md relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold uppercase">
                {upcomingAppointment.type}
              </span>
              <span className="text-xs font-bold text-teal-300">{upcomingAppointment.date}</span>
            </div>

            <h4 className="text-lg font-bold">{upcomingAppointment.title}</h4>
            <p className="text-xs text-purple-200 mt-0.5">{upcomingAppointment.doctorName} • {upcomingAppointment.specialty}</p>

            <div className="mt-4 pt-3 border-t border-purple-800/80 text-xs space-y-1.5 text-purple-100">
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-purple-300" /> {upcomingAppointment.time}
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-purple-300" /> {upcomingAppointment.location}
              </p>
            </div>
          </Card>

          <HealthStatus
            status="optimal"
            title="Post-Recovery Monitoring"
            subtitle="Vital stats and records verified for Alex Morgan"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" /> Recent Health Activity
          </h3>
          <span className="text-xs text-slate-400 font-mono">Log updates</span>
        </div>

        <Timeline activities={activities} />
      </div>
    </div>
  );
};
